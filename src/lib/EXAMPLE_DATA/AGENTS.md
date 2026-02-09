# Example Data Domain

## Purpose
This is a template/example showing how to structure a domain-specific data layer. Use this as a reference when building new domains for your projects.

## Architecture Pattern
Each domain should follow this structure:
- `types.ts`: All TypeScript interfaces and type definitions
- `dal.ts`: Database Access Layer - all direct database interactions
- `service.ts`: Service Layer - business logic that orchestrates DAL calls
- `utils.ts`: Domain-specific utility functions
- `AGENTS.md`: Documentation for AI agents on how to work with this domain

## Key Principles

### Layer Separation
- **DAL**: Only database operations, no business logic
- **SERVICE**: Orchestrates DAL calls, handles ID mapping, manages transactions
- **UTILS**: Pure functions for data transformation and validation

### Naming Conventions
- DAL functions: `DAL_<action>_<entity>` (e.g., `DAL_upsert_products`, `DAL_get_orders_by_user`)
- Service functions: `<DOMAIN>SERVICE_<action>_<entity>` (e.g., `PSERVICE_create_order`, `USERVICE_update_profile`)
- Utils: `<DOMAIN>UTIL_<description>` (e.g., `PUTIL_calculate_total`, `UUTIL_format_name`)

### Error Handling
All DAL and SERVICE functions should use the CORE error utilities:
- Throw `App_Error` using `create_app_error()` for new errors
- Use `push_error_frame()` to add context as errors bubble up
- Catch and re-throw with proper layer attribution

### Database Patterns
- Use deduplication for upserts to avoid duplicate inserts
- Return IDs from upsert operations
- Use ID mapping to update references after upserts
- Handle both positive (existing) and negative (temporary) IDs

## When to Create a New Domain
Create a new domain folder when you have:
- A distinct set of related database tables
- Business logic specific to that data
- Multiple routes/components that work with this data

## Example Domains
- **USER**: User profiles, preferences, settings
- **PRODUCT**: Product catalog, inventory, pricing
- **ORDER**: Orders, cart, checkout
- **CONTENT**: Blog posts, articles, media
- **ANALYTICS**: Metrics, events, tracking
