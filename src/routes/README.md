# Routes Directory

This directory contains all the pages and API endpoints for your application.

## Structure

```
routes/
├── +layout.svelte           # Root layout (wraps all pages)
├── +layout.server.ts        # Root server layout (auth, session)
├── +layout.ts               # Root universal layout (Supabase client)
├── +page.svelte             # Homepage (minimal starting point)
├── +page.server.ts          # Homepage server logic
└── example_route/           # Complete example with all patterns
    ├── +page.svelte         # Example page component
    ├── +page.server.ts      # Load function and form actions
    ├── +server.ts           # API endpoint (GET/POST)
    ├── Example_Form.svelte  # Form component with use:enhance
    └── README.md            # Documentation

```

## Key Files

### Root Layout Files
- **+layout.svelte** - Wraps all pages, contains `<slot />`
- **+layout.server.ts** - Runs on server, provides session/auth data
- **+layout.ts** - Runs universally, creates Supabase client

### Homepage (Starting Point)
- **+page.svelte** - Minimal homepage, good starting point for new projects
- **+page.server.ts** - Simple server load function

### Example Route (Reference)
- **example_route/** - Complete example showing all patterns
- **example_route/+page.svelte** - Page with API call example
- **example_route/+page.server.ts** - Load function and form actions
- **example_route/+server.ts** - API endpoint with GET/POST handlers
- **example_route/Example_Form.svelte** - Form component with use:enhance
- See `example_route/README.md` for detailed documentation

## Patterns Demonstrated

### 1. Form Handling
See `example_route/+page.server.ts` and `example_route/Example_Form.svelte`:
- Named actions (`?/submit_example`)
- Progressive enhancement with `use:enhance`
- Validation and error messages
- Loading states

### 2. API Endpoints
See `example_route/+server.ts`:
- GET and POST handlers
- Request validation
- Error handling with App_Error
- Consistent response format
- Colocated with the route that uses it

### 3. Error Handling
All files demonstrate proper error handling:
- Try-catch blocks
- `handle_error()` for layer attribution
- User-friendly error messages
- Dev-mode debugging info

### 4. Components
See `example_route/Example_Form.svelte`:
- Svelte 5 runes (`$props()`, `$state()`)
- TypeScript props interface
- Scoped styles
- Reactive state management
- Colocated with the route that uses it

## Creating New Routes

### Page Route
```
routes/my-page/
├── +page.svelte        # UI
├── +page.server.ts     # Server logic (optional)
└── MyComponent.svelte  # Components used by this page
```

### API Route
```
routes/api/my-endpoint/
└── +server.ts          # GET, POST, PUT, DELETE handlers
```

## Best Practices

1. **Colocation** - Keep components near the routes that use them
2. **Error handling** - Always wrap in try-catch with proper layer attribution
3. **Type safety** - Use TypeScript and import types from `./$types`
4. **Loading states** - Show feedback during async operations
5. **Validation** - Validate on both client and server
6. **Progressive enhancement** - Forms work without JavaScript

## Reference Documentation

- SvelteKit Routing: https://svelte.dev/docs/kit/routing
- Form Actions: https://svelte.dev/docs/kit/form-actions
- API Routes: https://svelte.dev/docs/kit/routing#server
- See `CODING_PATTERNS.md` for template-specific patterns
