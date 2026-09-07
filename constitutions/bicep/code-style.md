# Bicep code style

Formatting, structure, and language use inside a Bicep file.

## Rules

### File structure order

1. Every Bicep file follows this top-to-bottom order, with the sections kept apart:

```text
targetScope (if not resourceGroup)
metadata
params
variables
existing resources
resources / modules
outputs
```

### Parameters

2. Every parameter carries an `@description()` decorator. One line is enough.
3. Parameters are constrained by decorator wherever the constraint is real: `@minLength`,
   `@maxLength`, `@minValue`, `@maxValue`, `@allowed`.
4. A default value never hides required configuration. The `.bicepparam` files carry the
   configuration explicitly, and the template defaults only what is well understood, such as
   `location`.

```bicep
@description('Short workload name used in resource naming.')
@minLength(2)
@maxLength(10)
param workload string

@description('Deployment environment.')
@allowed(['dev', 'stg', 'prod'])
param environment string

@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('Zero-padded instance number.')
@minLength(3)
@maxLength(3)
param instance string = '001'
```

5. Parameters sharing a complex shape across files take a user-defined type:

```bicep
type SkuConfig = {
  name: string
  tier: string
  capacity: int?
}

param appServiceSku SkuConfig = {
  name: 'P1v3'
  tier: 'PremiumV3'
}
```

### Variables

6. Intermediate computed values and name construction live in variables, so the same
   expression appears once.
7. Resource name computations collect into a single `resourceNames` object variable — see
   [naming-convention/](naming-convention/README.md).

### Resources

8. The `name` property is set from a variable, never a raw string literal.
9. `location` is set from the `location` parameter, never a hardcoded region string.
10. The resource API version is explicit and recent, and a production template uses a stable
    version rather than a preview one.
11. A resource this template does not manage is referenced with `existing`, not by a
    hand-constructed resource ID:

```bicep
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: keyVaultName
  scope: resourceGroup(keyVaultResourceGroupName)
}
```

### Outputs

12. Outputs carry only what callers need, not every property of every resource.
13. Resource IDs and names are what callers usually need, and they are the ones to expose
    rather than connection strings or keys — see [security.md](security.md) for why.
14. Outputs carry descriptive names and `@description()` decorators.

### Symbolic names

15. Symbolic names — parameters, variables, resource symbolic names, outputs — are
    `camelCase`:

```bicep
param workload string
var storageAccountName = ...
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = { ... }
output storageAccountId string = storageAccount.id
```

### Interpolation and comments

16. String interpolation (`'${...}'`) replaces the `concat()` function. The linter enforces
    it, and it reads better regardless.
17. A value, dependency, or configuration choice that would not be obvious to a reader
    carries a comment. One line is enough.
18. A known gap still to be resolved before production is marked `// TODO:`, and CI flags or
    counts them, so the gap is visible somewhere other than the file it is in.
