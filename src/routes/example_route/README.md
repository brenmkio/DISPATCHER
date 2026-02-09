# Example Route

This directory contains a comprehensive example demonstrating all the key patterns and best practices for this template.

## What's Demonstrated

### 1. Page Load Function (`+page.server.ts`)
- Server-side data loading
- Error handling with `handle_error()` from EXAMPLE_CORE
- Proper use of SvelteKit's `error()` helper
- Try-catch pattern for LOAD layer

### 2. Page Component (`+page.svelte`)
- Svelte 5 runes (`$props()`, `$state()`)
- Proper TypeScript typing with `PageData`
- API calls using `fetch_json()` from EXAMPLE_CORE
- Client-side error handling
- UI1 styling (Times New Roman, black/white, functional)

### 3. Error Handling Patterns

#### In Load Functions
```typescript
try {
	// Load data
	return { data }
} catch (e) {
	const app_error = handle_error(e, 'LOAD', 'load_failed')
	throw error(500, { message: 'Failed to load data' })
}
```

#### In API Endpoints
```typescript
try {
	// Process request
	return create_response(data)
} catch (e) {
	const app_error = handle_error(e, 'ENDPOINT', 'endpoint_failed')
	return create_error_response(app_error, 400)
}
```

#### In Client-Side Code
```typescript
const { res_data, res_error } = await fetch_json('/api/endpoint')

if (res_error) {
	// Handle error
	console.error(res_error.message)
	return
}

// Use res_data
```

## Files in This Example

- `+page.server.ts` - Server load function with error handling
- `+page.svelte` - Main page component with API call example
- `README.md` - This file

## Related Examples

- `/+page.svelte` - Minimal homepage
- `/+page.server.ts` - Minimal homepage server logic
- `/example_route/Example_Form.svelte` - Form component with use:enhance
- `/example_route/+page.server.ts` - Form actions with validation
- `/example_route/+server.ts` - API endpoint with GET/POST handlers

## Key Takeaways

1. **Always wrap in try-catch** - Every load function, action, and endpoint
2. **Use handle_error()** - Converts any error to App_Error with proper layer
3. **Layer attribution** - LOAD, ENDPOINT, SERVICE, DAL, UI
4. **Client-side fetch** - Use `fetch_json()` for type-safe API calls
5. **Error display** - Show user-friendly messages, log details in dev mode
