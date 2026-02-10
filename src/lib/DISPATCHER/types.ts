export interface Dispatcher_Tickets_Schema {
	id?: number
	created_at?: string
	status: string
	client_name: string
	client_email: string
	client_phone?: string
	pickup_address: string
	delivery_address: string
	product_description: string
	weight_kg?: number
	estimated_pickup_date?: string
	actual_pickup_date?: string
	estimated_delivery_date?: string
	actual_delivery_date?: string
	trucking_company?: string
	notes?: string
}

export const DISPATCHER_TICKETS_UNIQUE = ['id'] as const
export const DISPATCHER_TICKETS_NONUNIQUE = [
	'created_at',
	'status',
	'client_name',
	'client_email',
	'client_phone',
	'pickup_address',
	'delivery_address',
	'product_description',
	'weight_kg',
	'estimated_pickup_date',
	'actual_pickup_date',
	'estimated_delivery_date',
	'actual_delivery_date',
	'trucking_company',
	'notes'
] as const
