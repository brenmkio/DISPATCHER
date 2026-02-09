# CODING_PATTERNS.md
## Coding Style Guide for This Template

This document captures the coding patterns, conventions, and architectural decisions used throughout this template. Future agents and developers should follow these patterns to maintain consistency.

---

## Language & Formatting

### TypeScript
- **All code files**: Use TypeScript for `.ts` and `.svelte` files
- **Type everything**: Prefer explicit types over `any`
- **Interfaces over types**: Use `interface` for object shapes, `type` for unions/intersections

### Code Structure
- **Early returns**: Prefer early returns over deep nesting
- **Guard clauses**: Check error conditions first, then proceed with happy path
- **Avoid deep nesting**: Maximum 3 levels of nesting; refactor if deeper
- **Single responsibility**: Each function should do one thing well
- **Small functions**: Keep functions under 50 lines when possible

### Example
```typescript
// ✅ Good - early return, flat structure
async function get_user_orders(user_id: string) {
	if (!user_id) return []
	
	const user = await get_user(user_id)
	if (!user) return []
	
	return await fetch_orders(user.id)
}

// ❌ Bad - nested, hard to read
async function get_user_orders(user_id: string) {
	if (user_id) {
		const user = await get_user(user_id)
		if (user) {
			return await fetch_orders(user.id)
		}
	}
	return []
}
```

---

## Naming Conventions

### Layer Prefixes
Functions are explicitly prefixed with their architectural layer:

- **DAL_**: Database Access Layer (e.g., `DAL_get_user`, `DAL_upsert_products`)
- **SERVICE_**: Service Layer with domain prefix (e.g., `USERVICE_create_account`, `PSERVICE_calculate_total`)
- **UTIL_**: Utility functions with domain prefix (e.g., `VUTIL_normalize_text`, `CUTIL_format_date`)
- **ENDPOINT_**: API endpoint handlers (used in `+server.ts` files)

### Variable & Function Names
- **Descriptive and verbose**: Prefer `user_profile_data` over `upd` or `data`
- **snake_case**: All variables and functions use snake_case
- **Avoid abbreviations**: Write `category_id` not `cat_id`, `description` not `desc`
- **Boolean prefixes**: Use `is_`, `has_`, `should_`, `can_` (e.g., `is_active`, `has_permission`)

### Exceptions for Minimal Names
Use extremely short names only for:
- Loop indices: `i`, `j`, `k`
- Very common, central concepts that appear everywhere: `sb` (Supabase client), `e` (error in catch blocks)
- Temporary variables in small scopes (< 5 lines)

### Type Names
- **Camel_Snake_Case**: All types and interfaces (e.g., `User_Schema`, `Product_Data`)
- **Suffix with purpose**: `_Schema` for database schemas, `_Data` for computed data, `_Config` for configuration

### Constants
- **SCREAMING_SNAKE_CASE**: For true constants (e.g., `MAX_RETRIES`, `DEFAULT_TIMEOUT`)
- **Regular snake_case**: For configuration objects that might change

---

## Architecture Patterns

### Layer Separation
The codebase follows a strict 3-layer architecture:

1. **DAL (Database Access Layer)**
   - Direct database interactions only
   - No business logic
   - Throws `App_Error` on failure
   - Returns raw data or IDs

2. **SERVICE Layer**
   - Orchestrates multiple DAL calls
   - Contains business logic
   - Handles ID mapping after upserts
   - Catches DAL errors and adds context via `push_error_frame()`

3. **UTILS Layer**
   - Pure functions only
   - No database access
   - No side effects
   - Data transformation and validation

### Example Flow
```
UI/Route → SERVICE → DAL → Database
         ← SERVICE ← DAL ← Database
```

---

## Error Handling

### App_Error Pattern
All errors use the `App_Error` type with error frames that accumulate context as they bubble up:

```typescript
// In DAL
if (error) {
	throw create_app_error({
		layer: 'DAL',
		code: 'get_user_failed',
		context: { user_id },
		message: 'Failed to fetch user from database'
	}, error)
}

// In SERVICE
try {
	return await DAL_get_user(sb, user_id)
} catch (e) {
	if (is_app_error(e)) {
		throw push_error_frame(e, {
			layer: 'SERVICE',
			code: 'user_service_failed',
			context: { operation: 'get_user' },
			message: 'User service encountered an error'
		})
	}
	throw create_app_error({
		layer: 'SERVICE',
		code: 'unexpected_error',
		context: { operation: 'get_user' },
		message: (e as Error).message
	}, e)
}
```

### Error Layers
- `DAL`: Database operations
- `SERVICE`: Business logic
- `ENDPOINT`: API endpoints (`+server.ts`)
- `LOAD`: SvelteKit load functions
- `UI`: Client-side component errors
- `AI`: AI/LLM operations

---

## Database Patterns

### Upsert with Deduplication
Always deduplicate before upserting to avoid duplicate inserts:

```typescript
export async function DAL_upsert_products(sb: any, data_to_upsert: Partial<Product_Schema>[]): Promise<number[]> {
	const data = dupe(data_to_upsert)
	
	data.forEach((d) => {
		delete d.id
		delete d.created_at
	})
	
	const { items, map } = deduplicate_array(data, undefined, NONUNIQUE_product_props)
	
	const { data: inserted, error } = await sb
		.from("Products")
		.upsert(items, { onConflict: UNIQUE_product_props })
		.select("id")
	
	if (error) {
		throw create_app_error({
			layer: 'DAL',
			code: 'upsert_products_failed',
			context: { count: items.length },
			message: 'Failed to upsert products'
		}, error)
	}
	
	const recreated_ids = recreate_id_array(inserted, map)
	return recreated_ids
}
```

### ID Mapping Pattern
After upserting, map temporary negative IDs to real positive IDs:

```typescript
export async function PSERVICE_upsert_products(sb: any, products: Partial<Product_Schema>[]): Promise<number[]> {
	const ids = await DAL_upsert_products(sb, products)
	const id_map = map_from_id_to_id(products, ids)
	
	// Update all references with real IDs
	for (const product of products) {
		if (!product.id || product.id > 0) continue
		product.id = id_map[product.id]
	}
	
	return ids
}
```

### Schema Constants
Every schema has UNIQUE and NONUNIQUE property definitions:

```typescript
export interface Product_Schema {
	id?: number
	created_at?: string
	name: string
	sku: string
	price: number
	category_id: number
}

export const UNIQUE_product_props = "sku"
export const NONUNIQUE_product_props = ["name", "price", "category_id"]
```

---

## File Organization

### Domain Structure
Organize by domain/feature, not by file type:

```
src/lib/
├── CORE/              # Core utilities (errors, logging, validation)
├── EXAMPLE_DATA/      # Example domain showing architecture
│   ├── AGENTS.md      # Documentation for agents
│   ├── types.ts       # Type definitions
│   ├── dal.ts         # Database access
│   ├── service.ts     # Business logic
│   └── utils.ts       # Domain utilities
├── USER/              # User domain
├── PRODUCT/           # Product domain
└── ORDER/             # Order domain
```

### Route Structure
Keep components and endpoints close to the routes that use them:

```
src/routes/
├── products/
│   ├── +page.svelte           # Product list page
│   ├── +page.server.ts        # Server load function
│   ├── ProductCard.svelte     # Component used only here
│   ├── [id]/
│   │   ├── +page.svelte       # Product detail page
│   │   └── +page.server.ts
│   └── api/
│       └── +server.ts         # Product-specific API endpoint
└── _api/                      # Public API endpoints only
    └── public/
        └── +server.ts
```

### Avoid These Patterns
- ❌ Single `components/` folder for everything
- ❌ Single `_API/` folder for all endpoints
- ✅ Components live near the routes that use them
- ✅ Endpoints live near the routes that call them
- ✅ `_api/` only for truly public/external APIs

---

## Component Patterns

### Svelte 5 with Runes
Use Svelte 5 runes syntax:

```svelte
<script lang="ts">
	import type { Product_Schema } from '$lib/PRODUCT/types'
	
	interface Props {
		product: Product_Schema
		on_click?: () => void
	}
	
	let { product, on_click }: Props = $props()
	
	let is_expanded = $state(false)
	
	let formatted_price = $derived(
		new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(product.price)
	)
</script>

<div class="product-card">
	<h3>{product.name}</h3>
	<p>{formatted_price}</p>
	<button onclick={() => is_expanded = !is_expanded}>
		{is_expanded ? 'Hide' : 'Show'} Details
	</button>
</div>
```

### Styling
- **Tailwind utility classes**: Primary styling method
- **Component-scoped styles**: Only when Tailwind is insufficient
- **No global styles**: Except in `app.css` for resets/base styles

---

## Import Patterns

### Path Aliases
Use `$lib` for library imports:

```typescript
// ✅ Good
import { create_app_error } from '$lib/CORE/errors'
import type { Product_Schema } from '$lib/PRODUCT/types'

// ❌ Bad
import { create_app_error } from '../../lib/CORE/errors'
```

### Import Order
1. External packages
2. SvelteKit imports (`$app`, `$env`)
3. Type imports from `$lib`
4. Function imports from `$lib`
5. Relative imports

```typescript
import { json } from '@sveltejs/kit'
import { dev } from '$app/environment'
import type { Product_Schema } from '$lib/PRODUCT/types'
import { DAL_get_products } from '$lib/PRODUCT/dal'
import { calculate_total } from './utils'
```

---

## Comments & Documentation

### When to Comment
- **Complex algorithms**: Explain the "why", not the "what"
- **Non-obvious business logic**: Clarify domain-specific rules
- **Workarounds**: Explain why a hack exists and when it can be removed
- **TODOs**: Mark future improvements

### When NOT to Comment
- **Obvious code**: Don't state what the code already says
- **Function names**: If you need a comment, rename the function instead

```typescript
// ❌ Bad - obvious
// Get the user by ID
const user = await get_user(user_id)

// ✅ Good - explains non-obvious business rule
// Users with premium status get 2x points, but only on weekdays
const points = is_premium && is_weekday() ? base_points * 2 : base_points
```

### AGENTS.md Files
Every domain folder should have an `AGENTS.md` file explaining:
- Purpose of the domain
- Current status and priorities
- Key concepts and patterns
- When to modify this domain

---

## Testing & Verification

### Local Testing
- Run `npm run dev` after every feature
- Test in browser before committing
- Check console for errors

### Bug Documentation
- Document bugs in `PROGRESS.md`, don't auto-fix
- Let the user prioritize which issues to tackle
- Include reproduction steps

---

## Git Workflow

### Commit Messages
Use conventional commit format:
- `feat:` - New features
- `fix:` - Bug fixes
- `refactor:` - Code restructuring without behavior change
- `docs:` - Documentation only
- `style:` - Formatting, missing semicolons, etc.
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Commit Frequency
- One feature per commit
- Commit working code only
- Keep commits focused and atomic

---

## Code Style Preferences

### Explicit Over Clever
Prefer simple, explicit code over clever tricks:

```typescript
// ✅ Good - explicit and clear
function is_adult(age: number): boolean {
	return age >= 18
}

// ❌ Bad - too clever
const is_adult = (age: number) => !!(age >= 18)
```

### Verbose Over Terse
When in doubt, be more verbose:

```typescript
// ✅ Good
const user_profile_data = await fetch_user_profile(user_id)
const formatted_display_name = format_name(user_profile_data.first_name, user_profile_data.last_name)

// ❌ Bad
const upd = await fetch(uid)
const fdn = fmt(upd.fn, upd.ln)
```

### Consistency Over Personal Preference
Follow the existing patterns in the codebase, even if you prefer a different style.

---

## Safety Rules

### Never Auto-Execute
- Never delete files without explicit permission
- Never overwrite `.env`, `svelte.config.js`, or `vite.config.ts` without asking
- Ask before installing new npm packages
- Show diffs for large file changes (>100 lines) before applying

### File Size Limits
- Keep files under 300 lines
- Refactor into multiple files if longer
- Split by logical concerns (types, DAL, service, utils)

---

## Summary

**Core Principles:**
1. **Explicit layer naming** - DAL_, SERVICE_, UTIL_ prefixes
2. **Verbose, descriptive names** - Clarity over brevity
3. **Strict layer separation** - DAL → SERVICE → UI
4. **Error frames** - Context accumulates as errors bubble up
5. **Deduplication** - Always deduplicate before upserts
6. **ID mapping** - Handle temporary negative IDs properly
7. **Colocation** - Keep related files together
8. **Simple over clever** - Readable code wins

When building new features, reference `EXAMPLE_DATA/` and `EXAMPLE_CORE/` for patterns to follow.
