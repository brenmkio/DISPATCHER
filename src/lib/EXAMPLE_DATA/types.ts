export interface Product_Schema {
	id?: number
	created_at?: string
	name: string
	description: string
	price: number
	category_id: number
	sku: string
	stock_quantity?: number
	is_active?: boolean
	image_url?: string
	metadata?: Record<string, any>
}
export const UNIQUE_product_props = "sku"
export const NONUNIQUE_product_props = ["name", "description", "price", "category_id", "stock_quantity", "is_active", "image_url", "metadata"]

export interface Category_Schema {
	id?: number
	created_at?: string
	name: string
	slug: string
	parent_id?: number
	description?: string
	sort_order?: number
}
export const UNIQUE_category_props = "slug"
export const NONUNIQUE_category_props = ["name", "parent_id", "description", "sort_order"]

export interface Order_Schema {
	id?: number
	created_at?: string
	user_id: string
	status: Order_Status
	total_amount: number
	currency: string
	shipping_address?: string
	billing_address?: string
	notes?: string
	completed_at?: string
}
export const UNIQUE_order_props = ""
export const NONUNIQUE_order_props = ["user_id", "status", "total_amount", "currency", "shipping_address", "billing_address", "notes", "completed_at"]

export interface Order_Item_Schema {
	id?: number
	created_at?: string
	order_id: number
	product_id: number
	quantity: number
	unit_price: number
	total_price: number
	product_name: string
}
export const UNIQUE_order_item_props = "order_id, product_id"
export const NONUNIQUE_order_item_props = ["quantity", "unit_price", "total_price", "product_name"]

export type Order_Status = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export interface Product_With_Category {
	product: Product_Schema
	category: Category_Schema
}

export interface Order_With_Items {
	order: Order_Schema
	items: Order_Item_Schema[]
	total_items: number
}
