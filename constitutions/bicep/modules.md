# Bicep modules

How Bicep modules are structured and used.

## Rules

### When a module exists

1. A resource or group of tightly related resources used in more than one deployment becomes
   a module, as does anything that would push a single Bicep file past ~150 lines.
2. A single resource with no added logic stays inline. Wrapping it in a module buys nothing
   until it is reused, and costs a layer of parameter passing.

### Directory structure

3. Infrastructure code is organised as:

```text
infra/azure/
  main.bicep                  ← entry point; orchestrates modules
  main.stg.bicepparam
  main.prod.bicepparam
  modules/
    keyvault.bicep
    storage.bicep
    network.bicep
    container-app.bicep
  bicepconfig.json
```

4. Module files are named in `kebab-case` after the primary resource they manage
   (`container-app.bicep`, `static-web-app.bicep`). A single-word module name
   (`storage.bicep`, `keyvault.bicep`) is one lowercase word, not hyphenated.

### Module inputs

5. A module accepts only the inputs it needs; the parent's whole parameter set does not
   travel into a child.
6. The parent passes the computed resource **name**, not the raw naming ingredients. Name
   construction belongs in the parent's `resourceNames` variable, so the pattern lives in
   one place.
7. `location` and `tags` are always parameters, which is what keeps a module region-agnostic
   and taggable.

```bicep
// modules/keyvault.bicep
@description('Name of the Key Vault.')
param name string

@description('Azure region.')
param location string

@description('Object ID of the principal granted access.')
param accessPrincipalId string

@description('Resource tags.')
param tags object = {}
```

### Module outputs

8. A module outputs the minimum callers need: typically the resource `id`, `name`, and any
   endpoint URLs.
9. Secrets, keys and connection strings are not module outputs — see
   [security.md](security.md).

### Calling modules

10. Every module receives the same `tags` object:

```bicep
var commonTags = {
  workload:     workload
  environment:  environment
  managedBy:    'bicep'
}

module kv 'modules/keyvault.bicep' = {
  name: 'deploy-kv'
  params: {
    name:              resourceNames.keyVault
    location:          location
    accessPrincipalId: appIdentity.outputs.principalId
    tags:              commonTags
  }
}
```

11. A module deployment's `name` property — not the resource name — is unique within the
    template, following the pattern `'deploy-{resourceType}'`: `'deploy-kv'`,
    `'deploy-storage'`.

### Scope and loops

12. A module deploying at subscription or management-group scope sets `targetScope`
    explicitly. A resource-group-scoped module needs no such declaration.
13. Multiple similar resources come from `[for item in items: { ... }]` rather than
    duplicated resource blocks.
14. Loop variables carry meaningful names, not `i` or `item`.

```bicep
module appServices 'modules/appservice.bicep' = [
  for slot in ['blue', 'green']: {
    name: 'deploy-app-${slot}'
    params: {
      name:     'app-${workload}-${environment}-${location}-${slot}'
      location: location
      tags:     commonTags
    }
  }
]
```
