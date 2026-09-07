# Bicep security

Security rules for every Bicep template. The security linter rules are set to `error` level
in [tooling.md](tooling.md); this file states the same policy in prose, so it survives a
config file someone loosened.

## Rules

### Secrets and sensitive values

1. **Secrets, passwords, keys and connection strings are never hardcoded** in a Bicep file
   or a parameter file. That includes dummy and placeholder values, which establish a
   pattern that gets copied with real ones.
2. A parameter holding a sensitive value carries the `@secure()` decorator. Azure Resource
   Manager does not log a secure parameter.

```bicep
@secure()
@description('Administrator password for the SQL Server.')
param sqlAdminPassword string
```

3. **A `@secure()` parameter never defaults to a real secret value.** A literal secret
   default embeds the secret in the template and shows up in deployment history. An
   empty-string default (`= ''`) is allowed as a "not supplied yet" sentinel on an optional
   secret that gates conditional behaviour — a token that enables a module only when set,
   for instance — because it holds no secret itself.
4. Sensitive values come from Key Vault references in `.bicepparam` files, not from plain
   strings:

```bicep
// main.prod.bicepparam
using 'main.bicep'

param sqlAdminPassword = az.getSecret(
  '<subscription-id>',
  'rg-shared-prod-japaneast-001',
  'kv-shared-prod-japaneast-001',
  'sql-admin-password'
)
```

### Outputs

5. **Outputs carry resource IDs rather than secrets.** The resource ID or name goes out and
   callers fetch the secret at runtime through RBAC, instead of a key or connection string
   being threaded through outputs.
6. Where a secret genuinely has to cross a module boundary within one deployment — a
   generated key written into Key Vault, say — that output is decorated `@secure()`, which
   suppresses the value from deployment history. An undecorated secret output is a violation
   even where the value is also reachable through RBAC.

```bicep
// Bad — an unmarked secret output is stored in plain text in deployment history
output storageConnectionString string = storageAccount.listKeys().keys[0].value

// Good — output the resource ID; callers fetch the key at runtime through RBAC
output storageAccountId string = storageAccount.id

// Good — the value must cross a module boundary in this deployment, so it is @secure()
@secure()
output primaryKey string = cosmosAccount.listKeys().primaryMasterKey
```

### Identity and access

7. Service-to-service authentication uses a **managed identity**, system-assigned or
   user-assigned. A resource that supports managed identity does not get a service principal
   with a client secret.
8. RBAC assignments are the minimum that works. `Owner` and `Contributor` do not stand in
   for a sufficient data-plane role such as `Storage Blob Data Contributor`.
9. Role assignments are declared in Bicep, not applied by hand in the portal, where they
   leave no diff.

### Network

10. NSG rules do not open management ports (SSH 22, RDP 3389) to `*`. They are restricted to
    known IP ranges, or reached through Azure Bastion.
11. A resource supporting Private Endpoints **should** use one in `prod` and `stg`, with
    public network access disabled alongside it. The exception is a resource whose consumer
    is outside the virtual network and cannot be moved into it.

### Resource configuration

12. Production resources that support diagnostic settings have them enabled, sending logs
    and metrics to the Log Analytics Workspace.
13. Key Vaults in `prod` and `stg` have soft-delete and purge protection enabled.
14. Storage Accounts and App Services are HTTPS-only, at a minimum of TLS 1.2.

```bicep
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  ...
  properties: {
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
  }
}
```

### Locations

15. **A `location` property is never a hardcoded region string**; it is the `location`
    parameter. The linter's `no-hardcoded-location` rule catches this at warning level only,
    so the rule here is what makes it binding.
