import { push_error_frame, is_app_error, create_app_error } from '$lib/EXAMPLE_CORE/errors'
import { DAL_get_all_tickets, DAL_get_ticket_by_id, DAL_create_ticket, DAL_update_ticket, DAL_delete_ticket } from './dal'
import type { Dispatcher_Tickets_Schema } from './types'

export async function DSERVICE_get_all_tickets(
	sb: any,
	limit: number = 50
): Promise<Dispatcher_Tickets_Schema[]> {
	try {
		return await DAL_get_all_tickets(sb, limit)
	} catch (e) {
		if (is_app_error(e)) {
			throw push_error_frame(e, {
				layer: 'SERVICE',
				code: 'get_all_tickets_service_failed',
				context: { limit },
				message: 'Failed to get tickets'
			})
		}
		throw create_app_error({
			layer: 'SERVICE',
			code: 'unexpected_error',
			context: { operation: 'get_all_tickets' },
			message: (e as Error).message
		}, e)
	}
}

export async function DSERVICE_get_ticket_by_id(
	sb: any,
	ticket_id: string
): Promise<Dispatcher_Tickets_Schema | null> {
	try {
		return await DAL_get_ticket_by_id(sb, ticket_id)
	} catch (e) {
		if (is_app_error(e)) {
			throw push_error_frame(e, {
				layer: 'SERVICE',
				code: 'get_ticket_service_failed',
				context: { ticket_id },
				message: 'Failed to get ticket'
			})
		}
		throw create_app_error({
			layer: 'SERVICE',
			code: 'unexpected_error',
			context: { operation: 'get_ticket_by_id' },
			message: (e as Error).message
		}, e)
	}
}

export async function DSERVICE_create_ticket(
	sb: any,
	ticket: Omit<Dispatcher_Tickets_Schema, 'id' | 'created_at'>
): Promise<Dispatcher_Tickets_Schema> {
	try {
		return await DAL_create_ticket(sb, ticket)
	} catch (e) {
		if (is_app_error(e)) {
			throw push_error_frame(e, {
				layer: 'SERVICE',
				code: 'create_ticket_service_failed',
				context: { client_name: ticket.client_name },
				message: 'Failed to create ticket'
			})
		}
		throw create_app_error({
			layer: 'SERVICE',
			code: 'unexpected_error',
			context: { operation: 'create_ticket' },
			message: (e as Error).message
		}, e)
	}
}

export async function DSERVICE_update_ticket(
	sb: any,
	ticket_id: string,
	updates: Partial<Dispatcher_Tickets_Schema>
): Promise<Dispatcher_Tickets_Schema> {
	try {
		return await DAL_update_ticket(sb, ticket_id, updates)
	} catch (e) {
		if (is_app_error(e)) {
			throw push_error_frame(e, {
				layer: 'SERVICE',
				code: 'update_ticket_service_failed',
				context: { ticket_id },
				message: 'Failed to update ticket'
			})
		}
		throw create_app_error({
			layer: 'SERVICE',
			code: 'unexpected_error',
			context: { operation: 'update_ticket' },
			message: (e as Error).message
		}, e)
	}
}

export async function DSERVICE_delete_ticket(
	sb: any,
	ticket_id: string
): Promise<boolean> {
	try {
		return await DAL_delete_ticket(sb, ticket_id)
	} catch (e) {
		if (is_app_error(e)) {
			throw push_error_frame(e, {
				layer: 'SERVICE',
				code: 'delete_ticket_service_failed',
				context: { ticket_id },
				message: 'Failed to delete ticket'
			})
		}
		throw create_app_error({
			layer: 'SERVICE',
			code: 'unexpected_error',
			context: { operation: 'delete_ticket' },
			message: (e as Error).message
		}, e)
	}
}
