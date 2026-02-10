import { create_app_error } from '$lib/EXAMPLE_CORE/errors'
import type { Dispatcher_Tickets_Schema } from './types'

export async function DAL_get_one_ticket(
	sb: any
): Promise<Dispatcher_Tickets_Schema> {
	try {
		// Verify Supabase client is available and properly structured
		if (!sb) {
			throw create_app_error({
				layer: 'DAL',
				code: 'supabase_client_missing',
				context: { table: 'DISPATCHER_Tickets', debug_info: 'sb is undefined or null' },
				message: 'Supabase client not available - check environment configuration'
			})
		}

		// Check if sb has the expected methods
		if (typeof sb.from !== 'function') {
			throw create_app_error({
				layer: 'DAL',
				code: 'supabase_client_invalid',
				context: { table: 'DISPATCHER_Tickets', debug_info: 'sb.from is not a function', sb_type: typeof sb },
				message: 'Supabase client is invalid - missing required methods'
			})
		}

		console.log('DAL: Attempting database query with sb client:', typeof sb, 'from method:', typeof sb.from)

		const { data, error } = await sb
			.from('DISPATCHER_Tickets')
			.select('*')
			.limit(1)
			.single()

		console.log('DAL: Query result - data:', data, 'error:', error)

		if (error) {
			// Provide detailed error context for different error types
			let error_message = 'Failed to fetch ticket from database'
			let error_context: Record<string, any> = { table: 'DISPATCHER_Tickets', error_details: error }

			if (error.code === 'PGRST116') {
				error_message = 'No tickets found in DISPATCHER_Tickets table - table may be empty'
				error_context = { ...error_context, suggestion: 'Insert a test ticket into the table' }
			} else if (error.code === '42P01') {
				error_message = 'DISPATCHER_Tickets table does not exist - run database migrations'
				error_context = { ...error_context, suggestion: 'Check database schema and run migrations' }
			} else if (error.code === '42501') {
				error_message = 'Permission denied accessing DISPATCHER_Tickets table - check RLS policies'
				error_context = { ...error_context, suggestion: 'Review Row Level Security policies' }
			}

			throw create_app_error({
				layer: 'DAL',
				code: 'get_ticket_failed',
				context: error_context,
				message: error_message
			}, error)
		}

		if (!data) {
			throw create_app_error({
				layer: 'DAL',
				code: 'no_ticket_found',
				context: { table: 'DISPATCHER_Tickets', suggestion: 'Insert a test ticket to verify connection' },
				message: 'Query succeeded but no ticket data returned - table may be empty'
			})
		}

		return data
	} catch (e) {
		console.log('DAL: Caught error:', e)
		
		if (e && typeof e === 'object' && 'layer' in e) {
			throw e
		}
		throw create_app_error({
			layer: 'DAL',
			code: 'unexpected_error',
			context: { table: 'DISPATCHER_Tickets', error: e, error_type: typeof e, error_message: (e as Error)?.message },
			message: `Unexpected database error: ${(e as Error)?.message || 'Unknown error'}`
		}, e)
	}
}
