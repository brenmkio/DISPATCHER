export interface Dispatcher_Tickets_Schema {
	id?: string
	created_at?: string
	status: string
	client_name: string
	client_email: string
	pickup_location: string
	delivery_location: string
	item_description: string
	estimated_delivery?: string
	notes?: string
}

export const DISPATCHER_TICKETS_UNIQUE = ['id'] as const
export const DISPATCHER_TICKETS_NONUNIQUE = [
	'created_at',
	'status',
	'client_name',
	'client_email',
	'pickup_location',
	'delivery_location',
	'item_description',
	'estimated_delivery',
	'notes'
] as const

export type Ticket_Status = 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled'
