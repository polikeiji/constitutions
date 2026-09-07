# The Bicep naming pattern

The pattern every Azure resource name is built from, and the environment and region tokens
that go into it.

## Rules

### Pattern

1. Resource names follow this pattern:

```text
{abbreviation}-{workload}-{environment}-{region}-{instance}
```

- **abbreviation** — the CAF resource type prefix, lowercase, from
  [naming-convention-abbreviations.md](naming-convention-abbreviations.md)
- **workload** — short name for the application or service (`api`, `shared`)
- **environment** — one of the tokens below
- **region** — the Azure region shortname (`eastus`, `japaneast`, `westeurope`)
- **instance** — zero-padded 3-digit sequence: `001`, `002`, …

A resource group for the `api` workload in production in Japan East is
`rg-api-prod-japaneast-001`.

2. The separator is a hyphen. Resource names carry no underscores and no camelCase, and
   every character is lowercase.
3. **Exception — resources that do not allow hyphens.** Storage Accounts, Container
   Registries, and Cognitive Services accounts omit the hyphens and compress the pattern to
   `{abbreviation}{workload}{environment}{region}{instance}` — `stapiprodjapaneast001` —
   within their own character limits, which are tighter than most.

### Environment tokens

| Environment | Token |
|---|---|
| Production | `prod` |
| Development | `dev` |
| Staging / UAT | `stg` |
| Test | `test` |
| Shared / Hub | `shared` |

### Region shortnames

The token is the official Azure region name as returned by
`az account list-locations --query "[].name"`:

| Region | Token |
|---|---|
| Japan East | `japaneast` |
| Japan West | `japanwest` |
| East US | `eastus` |
| East US 2 | `eastus2` |
| West US 2 | `westus2` |
| West Europe | `westeurope` |
| North Europe | `northeurope` |
| Southeast Asia | `southeastasia` |
