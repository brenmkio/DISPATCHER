import { push_error_frame, is_app_error, create_app_error } from '$lib/EXAMPLE_CORE/errors'
import { DAL_get_one_ticket } from './dal'
import type { Dispatcher_Tickets_Schema } from './types'

export async function DISPATCHERSERVICE_test_connection(
	sb: any
): Promise<Dispatcher_Tickets_Schema> {
	try {
		console.log('SERVICE: Received sb client:', typeof sb, 'sb value:', sb)
		console.log('SERVICE: sb.from method:', typeof sb?.from)
		
		return await DAL_get_one_ticket(sb)
	} catch (e) {
		console.log('SERVICE: Caught error:', e)
		
		if (is_app_error(e)) {
			throw push_error_frame(e, {
				layer: 'SERVICE',
				code: 'connection_test_failed',
				context: { 
					operation: 'test_database_connection',
					sb_type: typeof sb,
					sb_from_method: typeof sb?.from,
					troubleshooting: [
						'Check that Supabase environment variables are set correctly',
						'Verify database is running and accessible',
						'Ensure DISPATCHER_Tickets table exists and has data',
						'Check Row Level Security (RLS) policies allow access'
					]
				},
				message: 'Database connection test failed in service layer'
			})
		}
		throw create_app_error({
			layer: 'SERVICE',
			code: 'unexpected_service_error',
			context: { 
				operation: 'test_database_connection',
				original_error: e,
				sb_type: typeof sb,
				troubleshooting: [
					'Check service layer implementation',
					'Verify DAL layer is properly imported and called',
					'Review error handling chain'
				]
			},
			message: `Unexpected service error: ${(e as Error).message}`
		}, e)
	}
}
