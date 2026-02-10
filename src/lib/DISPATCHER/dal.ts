import { create_app_error } from '$lib/EXAMPLE_CORE/errors'
import type { Dispatcher_Tickets_Schema } from './types'

export async function DAL_get_all_tickets(
	sb: any,
	limit: number = 50
): Promise<Dispatcher_Tickets_Schema[]> {
	const { data, error } = await sb
		.from('DISPATCHER_Tickets')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(limit)

	if (error) {
		throw create_app_error({
			layer: 'DAL',
			code: 'get_all_tickets_failed',
			context: { table: 'DISPATCHER_Tickets', limit },
			message: 'Failed to fetch tickets'
		}, error)
	}

	return data as Dispatcher_Tickets_Schema[]
}

export async function DAL_get_ticket_by_id(
	sb: any,
	ticket_id: string
): Promise<Dispatcher_Tickets_Schema | null> {
	const { data, error } = await sb
		.from('DISPATCHER_Tickets')
		.select('*')
		.eq('id', ticket_id)
		.single()

	if (error) {
		if (error.code === 'PGRST116') {
			return null
		}
		throw create_app_error({
			layer: 'DAL',
			code: 'get_ticket_by_id_failed',
			context: { table: 'DISPATCHER_Tickets', ticket_id },
			message: 'Failed to fetch ticket'
		}, error)
	}

	return data as Dispatcher_Tickets_Schema
}

export async function DAL_create_ticket(
	sb: any,
	ticket: Omit<Dispatcher_Tickets_Schema, 'id' | 'created_at'>
): Promise<Dispatcher_Tickets_Schema> {
	const { data, error } = await sb
		.from('DISPATCHER_Tickets')
		.insert(ticket)
		.select('*')
		.single()

	if (error) {
		throw create_app_error({
			layer: 'DAL',
			code: 'create_ticket_failed',
			context: { table: 'DISPATCHER_Tickets', client_name: ticket.client_name },
			message: 'Failed to create ticket'
		}, error)
	}

	return data as Dispatcher_Tickets_Schema
}

export async function DAL_update_ticket(
	sb: any,
	ticket_id: string,
	updates: Partial<Dispatcher_Tickets_Schema>
): Promise<Dispatcher_Tickets_Schema> {
	const { data, error } = await sb
		.from('DISPATCHER_Tickets')
		.update(updates)
		.eq('id', ticket_id)
		.select('*')
		.single()

	if (error) {
		throw create_app_error({
			layer: 'DAL',
			code: 'update_ticket_failed',
			context: { table: 'DISPATCHER_Tickets', ticket_id },
			message: 'Failed to update ticket'
		}, error)
	}

	return data as Dispatcher_Tickets_Schema
}

export async function DAL_delete_ticket(
	sb: any,
	ticket_id: string
): Promise<boolean> {
	const { error } = await sb
		.from('DISPATCHER_Tickets')
		.delete()
		.eq('id', ticket_id)

	if (error) {
		throw create_app_error({
			layer: 'DAL',
			code: 'delete_ticket_failed',
			context: { table: 'DISPATCHER_Tickets', ticket_id },
			message: 'Failed to delete ticket'
		}, error)
	}

	return true
}
