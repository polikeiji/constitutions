# Bicep

Standards and conventions for Azure infrastructure-as-code written in Bicep.

## Index

| Document | Covers |
|---|---|
| [Naming convention](naming-convention/README.md) | The Azure CAF naming pattern, the environment and region tokens, and the abbreviation per resource type |
| [Tooling](tooling.md) | The Bicep CLI, `bicepconfig.json` lint levels, parameter files, CI checks |
| [Code style](code-style.md) | File structure order, parameters, variables, resources, outputs, symbolic names |
| [Modules](modules.md) | When a module exists, its inputs and outputs, directory layout, loops |
| [Security](security.md) | Secrets, `@secure()`, the outputs policy, managed identity, network, TLS |

Bicep is Azure-specific, and so is this constitution. A project on another cloud takes the
shape of these rules — one naming pattern, lint levels that block rather than warn, secrets
that never leave through an output — and not their content.
