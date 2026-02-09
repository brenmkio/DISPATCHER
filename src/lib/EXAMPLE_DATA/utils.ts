import type { Order_Schema, Product_Schema } from "./types"

export function EUTIL_format_price(price: number, currency: string = 'USD'): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency
	}).format(price)
}

export function EUTIL_calculate_order_total(items: { unit_price: number, quantity: number }[]): number {
	return items.reduce((total, item) => total + (item.unit_price * item.quantity), 0)
}

export function EUTIL_generate_sku(category_code: string, product_name: string): string {
	const sanitized_name = product_name
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '-')
		.replace(/-+/g, '-')
		.substring(0, 20)
	
	const timestamp = Date.now().toString(36)
	
	return `${category_code}-${sanitized_name}-${timestamp}`.toUpperCase()
}

export function EUTIL_is_order_editable(order: Order_Schema): boolean {
	return order.status === 'pending' || order.status === 'processing'
}

export function EUTIL_is_product_in_stock(product: Product_Schema, requested_quantity: number = 1): boolean {
	if (product.stock_quantity === undefined) return true
	return product.stock_quantity >= requested_quantity
}

export function EUTIL_calculate_discount(original_price: number, discount_percent: number): number {
	return original_price * (1 - discount_percent / 100)
}

export function EUTIL_slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

export function EUTIL_validate_product_data(product: Partial<Product_Schema>): { valid: boolean, errors: string[] } {
	const errors: string[] = []

	if (!product.name || product.name.trim().length === 0) {
		errors.push('Product name is required')
	}

	if (!product.sku || product.sku.trim().length === 0) {
		errors.push('Product SKU is required')
	}

	if (product.price === undefined || product.price < 0) {
		errors.push('Product price must be a positive number')
	}

	if (!product.category_id) {
		errors.push('Product category is required')
	}

	if (product.stock_quantity !== undefined && product.stock_quantity < 0) {
		errors.push('Stock quantity cannot be negative')
	}

	return {
		valid: errors.length === 0,
		errors
	}
}

export function EUTIL_get_order_status_display(status: string): string {
	const status_map: Record<string, string> = {
		'pending': 'Pending',
		'processing': 'Processing',
		'shipped': 'Shipped',
		'delivered': 'Delivered',
		'cancelled': 'Cancelled'
	}

	return status_map[status] || status
}
