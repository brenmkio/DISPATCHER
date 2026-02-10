

import { handle_error } from '$lib/EXAMPLE_CORE/errors'
import { DISPATCHERSERVICE_test_connection } from '$lib/DISPATCHER/service'
import { DISPATCHERUTIL_format_ticket_for_display } from '$lib/DISPATCHER/utils'

export const load = async ({ locals }) => {
	try {
		console.log('LOAD: locals object:', typeof locals, locals)
		console.log('LOAD: locals.sb:', typeof locals?.sb, locals?.sb)
		
		// Verify locals object structure
		if (!locals) {
			const app_error = handle_error(new Error('Missing locals object'), 'LOAD', 'missing_locals', {
				troubleshooting: [
					'Check SvelteKit hooks configuration',
					'Verify hooks.server.ts is properly set up',
					'Review SvelteKit middleware chain'
				]
			})
			
			return {
				message: 'Server configuration error',
				error: app_error,
				ticket: null,
				formatted_ticket: null
			}
		}

		if (!locals.sb) {
			const app_error = handle_error(new Error('Missing locals.sb'), 'LOAD', 'missing_locals_sb', {
				locals_keys: Object.keys(locals),
				locals_type: typeof locals,
				troubleshooting: [
					'Check hooks.server.ts Supabase client setup',
					'Verify createServerClient is properly called',
					'Check environment variables: PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY'
				]
			})
			
			return {
				message: 'Supabase client not initialized',
				error: app_error,
				ticket: null,
				formatted_ticket: null
			}
		}

		console.log('LOAD: Calling SERVICE with locals.sb')
		const ticket = await DISPATCHERSERVICE_test_connection(locals.sb)
		const formatted_ticket = DISPATCHERUTIL_format_ticket_for_display(ticket)

		return {
			message: 'Database connected successfully!',
			ticket,
			formatted_ticket,
			error: null
		}
	} catch (e) {
		console.log('LOAD: Caught error:', e)
		
		const app_error = handle_error(e, 'LOAD', 'database_connection_test', {
			operation: 'page_load',
			locals_available: !!locals,
			locals_sb_available: !!locals?.sb,
			troubleshooting: [
				'Check environment variables: PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY',
				'Verify Supabase project is active and accessible',
				'Ensure database has DISPATCHER_Tickets table with at least one record',
				'Check Row Level Security policies allow public access',
				'Review server logs for detailed error information'
			]
		})
		
		return {
			message: 'Database connection failed',
			error: app_error,
			ticket: null,
			formatted_ticket: null
		}
	}
}
