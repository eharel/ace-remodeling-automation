# Domains

This directory contains all domain-specific code for the ACE Remodeling monorepo. Each domain represents a distinct business area or functionality.

## Structure

```
src/domains/
├── pm-toolkit/          # Project management toolkit domain
│   ├── src/
│   │   ├── domains/     # Internal domains (leads, projects)
│   │   ├── menu/        # Menu system
│   │   ├── utils/       # Domain-specific utilities
│   │   └── ...
│   └── ...
├── vendors/             # Vendor management domain
│   ├── core/           # Core business logic
│   ├── types.ts        # Domain-specific types
│   ├── constants.ts    # Domain constants
│   └── index.ts        # Public API
└── [future-domains]/   # Additional domains as needed
```

## Adding New Domains

When adding a new domain:

1. Create a new directory under `src/domains/`
2. Follow the established patterns:
   - Use `core/` for business logic
   - Define types in `types.ts`
   - Export public API through `index.ts`
   - Keep domain-specific constants in `constants.ts`
3. Import shared utilities from `src/shared/`, `src/utils/`, etc.
4. Avoid cross-domain dependencies - use shared utilities instead

## Shared Utilities

Domain-agnostic code should be placed in the top-level `src/` directory:

- `src/shared/` - Shared business logic and utilities
- `src/forms/` - Form handling utilities
- `src/utils/` - General utilities
- `src/tables/` - Table rendering utilities
- `src/ui/` - UI components
- `src/globals/` - Global configurations

## Import Patterns

- Domain-specific imports: `@/domains/[domain-name]/...`
- Shared utility imports: `@/shared/...`, `@/utils/...`, etc.
- Cross-domain dependencies should be avoided - use shared utilities instead
