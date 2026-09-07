# Bicep abbreviations and implementation

The CAF abbreviation per resource type, and how the pattern is applied in a template.

## CAF resource abbreviations

The abbreviations are the official ones from
[Microsoft CAF — Abbreviation recommendations](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations).
The common ones:

| Resource type | Abbreviation | Notes |
|---|---|---|
| Resource Group | `rg` | |
| Virtual Network | `vnet` | |
| Subnet | `snet` | |
| Network Security Group | `nsg` | |
| Public IP Address | `pip` | |
| Private Endpoint | `pep` | |
| Private DNS Zone | `pdnsz` | |
| Application Gateway | `agw` | |
| Load Balancer (external) | `lbe` | |
| Load Balancer (internal) | `lbi` | |
| Virtual Machine | `vm` | max 15 chars on Windows |
| VM Scale Set | `vmss` | |
| App Service Plan | `asp` | |
| App Service / Web App | `app` | |
| Function App | `func` | |
| Static Web App | `stapp` | |
| Container App | `ca` | |
| Container Apps Environment | `cae` | |
| Container Apps Job | `caj` | |
| Azure Kubernetes Service | `aks` | |
| Azure Container Registry | `cr` | no hyphens, 5–50 chars |
| Storage Account | `st` | no hyphens, 3–24 chars |
| Key Vault | `kv` | 3–24 chars |
| Managed Identity | `id` | |
| Log Analytics Workspace | `log` | |
| Application Insights | `appi` | |
| API Management | `apim` | |
| Service Bus Namespace | `sb` | |
| Event Hub Namespace | `evhns` | |
| Event Hub | `evh` | |
| Azure SQL Server | `sql` | |
| Azure SQL Database | `sqldb` | |
| PostgreSQL Flexible Server | `psql` | |
| Cosmos DB Account | `cosmos` | |
| Redis Cache | `redis` | |
| Azure OpenAI | `oai` | |
| Cognitive Services | `cog` | no hyphens |
| AI Search | `srch` | |

## Rules

4. A full resource name is never a string literal. It is constructed by string interpolation
   from structured parameters, collected in one `resourceNames` variable so the pattern
   appears once per template rather than once per resource:

```bicep
param workload string
param environment string
param location string
param instance string = '001'

var resourceNames = {
  resourceGroup: 'rg-${workload}-${environment}-${location}-${instance}'
  keyVault:      'kv-${workload}-${environment}-${location}-${instance}'
  appService:    'app-${workload}-${environment}-${location}-${instance}'
  storage:       'st${workload}${environment}${replace(location, '-', '')}${instance}'
}
```

5. The generated name is validated against Azure's character limits, with `@maxLength` on
   the parameter or an `assert` statement where the name is computed. The limits differ per
   resource type and a name that exceeds one fails at deploy time, after everything before
   it in the template has already been created.
