# EXAMPLE_CORE

## Purpose
This directory contains foundational utilities that are used across all domains in the application. These are the building blocks that every other part of the codebase relies on.

## Current Status
✅ **Production Ready** - These utilities are stable and well-tested patterns.

## Files Overview

### `types.ts`
Core type definitions used throughout the application:
- **Error_Frame**: Individual error context with layer, code, message, context, and timestamp
- **App_Error**: Structured error with accumulated frames and dev information
- **App_Error_Client**: Client-safe error format (no sensitive data)
- **API_Response<T>**: Standardized API response format (success/error union type)

### `errors.ts`
Error handling utilities that implement the "Error Frames" pattern:
- **create_app_error()**: Create a new App_Error with initial frame
- **push_error_frame()**: Add context as errors bubble up through layers
- **is_app_error()**: Type guard to check if error is App_Error
- **handle_error()**: Catch-all handler for ENDPOINT and LOAD layers
- **get_user_friendly_message()**: Extract user-facing message
- **get_error_code()**: Extract error code from latest frame

### `utils.ts`
General-purpose utility functions:
- **Debugging**: `debug_data()`, `console_log()`
- **Data manipulation**: `dupe()`, `deduplicate_array()`, `recreate_id_array()`, `map_from_id_to_id()`
- **Array operations**: `chunk_array()`, `unique_by()`, `group_by()`, `sort_by()`, `shuffle()`
- **String operations**: `truncate()`, `capitalize()`, `title_case()`, `parse_json_safe()`
- **Date/time**: `format_date()`, `time_ago()`
- **Validation**: `is_empty()`
- **Math**: `clamp()`, `random_int()`, `random_item()`

### `log.ts`
Development logging utilities that only output in dev mode:
- **dev_log()**: Standard logging
- **dev_warn()**: Warning messages
- **dev_error()**: Error messages
- **dev_table()**: Tabular data display
- **dev_time()** / **dev_time_end()**: Performance timing

### `response.ts`
API response helpers for consistent endpoint patterns:
- **create_response()**: Create success response
- **create_error_response()**: Create error response (dev info only in dev mode)
- **fetch_json()**: Client-side fetch wrapper with error handling
- **handle_fetch_error()**: Throw errors from fetch responses

### `validation.ts`
Input validation utilities:
- **Type validators**: `is_valid_email()`, `is_valid_url()`, `is_valid_uuid()`, `is_valid_phone()`
- **Field validators**: `validate_required()`, `validate_min_length()`, `validate_max_length()`, `validate_range()`, `validate_pattern()`
- **Helpers**: `sanitize_html()`, `collect_validation_errors()`

## Key Patterns

### Error Frames Pattern
Errors accumulate context as they bubble up through architectural layers:

```typescript
// In DAL layer
throw create_app_error({
	layer: 'DAL',
	code: 'database_query_failed',
	context: { table: 'users', user_id },
	message: 'Failed to fetch user'
}, original_error)

// In SERVICE layer
catch (e) {
	if (is_app_error(e)) {
		throw push_error_frame(e, {
			layer: 'SERVICE',
			code: 'user_service_failed',
			context: { operation: 'get_user' },
			message: 'User service error'
		})
	}
	// Handle non-App_Error cases
}

// In ENDPOINT layer
catch (e) {
	const app_error = handle_error(e, 'ENDPOINT', 'api_error')
	return create_error_response(app_error, 500)
}
```

**Supported Layers:**
- `DAL` - Database Access Layer
- `SERVICE` - Business logic layer
- `ENDPOINT` - API endpoints (+server.ts files)
- `LOAD` - SvelteKit load functions
- `UI` - Client-side component errors
- `AI` - AI/LLM operations

### Deduplication Pattern
Used in DAL upserts to avoid inserting duplicates:

```typescript
const { items, map } = deduplicate_array(
	data_array,
	undefined,  // exclusion criteria function
	NONUNIQUE_props  // properties to exclude from comparison
)

// Upsert deduplicated items
const { data: inserted } = await sb.from('table').upsert(items).select('id')

// Recreate original array structure with real IDs
const ids = recreate_id_array(inserted, map)
```

### ID Mapping Pattern
Handle temporary negative IDs and map them to real database IDs:

```typescript
// After upsert, map old IDs to new IDs
const id_map = map_from_id_to_id(original_array, returned_ids)

// Update all references
for (const item of original_array) {
	if (!item.id || item.id > 0) continue
	item.id = id_map[item.id]  // Replace negative ID with real ID
}
```

### API Response Pattern
Consistent response format for all endpoints:

```typescript
// Success
return create_response({ user, orders }, 200)
// Returns: { success: true, data: { user, orders }, error: null }

// Error
return create_error_response(app_error, 500)
// Returns: { success: false, data: null, error: { code, message, stack?, frames? } }
```

### Client Fetch Pattern
Type-safe API calls with error handling:

```typescript
const { res_data, res_error } = await fetch_json<User>('/api/user')

if (res_error) {
	// Handle error (show toast, etc.)
	console.error(res_error.message)
	return
}

// res_data is typed as User
console.log(res_data.name)
```

## When to Touch This

### Add to EXAMPLE_CORE when:
- Creating a utility that will be used across multiple domains
- Adding a new error layer type (e.g., 'TRANSLATION', 'CACHE')
- Implementing a pattern that should be consistent everywhere
- Building infrastructure that other code depends on

### Don't add to EXAMPLE_CORE when:
- The utility is specific to one domain (put it in that domain's utils.ts)
- The function contains business logic (belongs in SERVICE layer)
- The code directly accesses the database (belongs in DAL layer)

## Usage Examples

### Error Handling in Endpoints
```typescript
// src/routes/api/users/+server.ts
import { create_response, create_error_response } from '$lib/EXAMPLE_CORE/response'
import { handle_error } from '$lib/EXAMPLE_CORE/errors'

export async function GET({ locals }) {
	try {
		const users = await USERVICE_get_all_users(locals.sb)
		return create_response(users)
	} catch (e) {
		const app_error = handle_error(e, 'ENDPOINT', 'get_users_failed')
		return create_error_response(app_error, 500)
	}
}
```

### Validation in Forms
```typescript
import { validate_required, validate_email, collect_validation_errors } from '$lib/EXAMPLE_CORE/validation'

function validate_form(email: string, name: string) {
	const errors = collect_validation_errors([
		() => validate_required(email, 'Email'),
		() => validate_email(email, 'Email'),
		() => validate_required(name, 'Name'),
		() => validate_min_length(name, 2, 'Name')
	])
	
	return { valid: errors.length === 0, errors }
}
```

### Array Utilities
```typescript
import { group_by, sort_by, unique_by } from '$lib/EXAMPLE_CORE/utils'

// Group products by category
const by_category = group_by(products, p => p.category_id)

// Sort by price descending
const sorted = sort_by(products, p => p.price, 'desc')

// Remove duplicates by SKU
const unique = unique_by(products, p => p.sku)
```

## Philosophy

These utilities embody the core principles:
- **Explicit over implicit** - Clear function names and parameters
- **Simple over clever** - Straightforward implementations
- **Type-safe** - Full TypeScript support with proper generics
- **Composable** - Small functions that work well together
- **Debuggable** - Dev-mode logging and error context

## Future Enhancements

Potential additions (add when needed, not speculatively):
- Rate limiting utilities
- Caching helpers
- Retry logic with exponential backoff
- Batch processing utilities
- WebSocket helpers
- File upload/download utilities
