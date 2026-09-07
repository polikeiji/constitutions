# Bicep tooling

The toolchain for infrastructure-as-code work in Bicep.

## Rules

### Bicep CLI

1. The **Bicep CLI** is the one bundled with the Azure CLI (`az bicep`), kept at the latest
   stable version.
2. The minimum Bicep version is **0.28**, which introduced user-defined types and type
   assertions. CI pins the version.

```bash
az bicep install
az bicep upgrade

az bicep build --file main.bicep   # compile to ARM JSON, for validation only
az bicep lint --file main.bicep

# The scope matters: a template that creates its own resource group deploys with
# `az deployment sub`, not `az deployment group`.
az deployment sub create \
  --location japaneast \
  --template-file main.bicep \
  --parameters main.prod.bicepparam

az deployment sub what-if \
  --location japaneast \
  --template-file main.bicep \
  --parameters main.prod.bicepparam
```

3. A change to production is preceded by a what-if run, and the output is read before the
   deploy. What-if is the only thing between a template edit and a resource being replaced.

### bicepconfig.json

4. Every repository carries a `bicepconfig.json` at its root, which controls linting for all
   Bicep files in it.
5. Security rules are set to `error`, which breaks the build. Code-quality rules are
   `warning` — visible but non-blocking:

```json
{
  "analyzers": {
    "core": {
      "enabled": true,
      "verbose": false,
      "rules": {
        "adminusername-should-not-be-literal": { "level": "error" },
        "no-hardcoded-env-urls":               { "level": "error" },
        "no-hardcoded-location":               { "level": "warning" },
        "no-unnecessary-dependson":            { "level": "warning" },
        "no-unused-params":                    { "level": "warning" },
        "no-unused-vars":                      { "level": "warning" },
        "outputs-should-not-contain-secrets":  { "level": "error" },
        "prefer-interpolation":                { "level": "warning" },
        "prefer-unquoted-property-names":      { "level": "warning" },
        "protect-commandtoexecute-secrets":    { "level": "error" },
        "secure-parameter-default":            { "level": "error" },
        "simplify-interpolation":              { "level": "warning" },
        "use-recent-api-versions":             { "level": "warning" },
        "use-stable-resource-identifiers":     { "level": "warning" },
        "use-stable-vm-image":                 { "level": "warning" }
      }
    }
  }
}
```

6. The **Bicep extension for VS Code** (`ms-azuretools.vscode-bicep`) supplies inline
   linting, intellisense, and parameter file support.

### Parameter files

7. Parameter files are `.bicepparam`, the native format, not JSON — one per environment,
   named `main.{environment}.bicepparam`:

```text
infra/azure/
  main.bicep
  main.stg.bicepparam
  main.prod.bicepparam
```

```bicep
// main.prod.bicepparam
using 'main.bicep'

param workload    = 'api'
param environment = 'prod'
param location    = 'japaneast'
```

### CI checks

8. CI pipelines run `az bicep lint` and a what-if at minimum, and a lint error blocks the
   merge. A warning-level security rule is a rule that does not exist — see
   [security.md](security.md), which restates the security policy in prose so it survives a
   config file someone loosened.
