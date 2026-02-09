import { create_app_error, is_app_error, push_error_frame } from "$lib/EXAMPLE_CORE/errors"
import { map_from_id_to_id } from "$lib/EXAMPLE_CORE/utils"
import { DAL_create_order, DAL_get_order_items_by_order_id, DAL_get_orders_by_user, DAL_get_product_by_id, DAL_get_products_by_category, DAL_insert_order_items, DAL_update_order_status, DAL_upsert_categories, DAL_upsert_products } from "./dal"
import type { Category_Schema, Order_Item_Schema, Order_Schema, Order_With_Items, Product_Schema } from "./types"

export async function ESERVICE_upsert_products(sb: any, products: Partial<Product_Schema>[]): Promise<number[]> {
	try {
		const ids = await DAL_upsert_products(sb, products)
		const id_map = map_from_id_to_id(products, ids)

		for (const product of products) {
			if (!product.id) continue
			if (product.id > 0) continue
			product.id = id_map[product.id]
		}

		return ids
	} catch (e) {
		if (is_app_error(e)) {
			throw push_error_frame(e, {
				layer: 'SERVICE',
				code: 'upsert_products_service_failed',
				context: { count: products.length },
				message: 'Product upsert service failed'
			})
		}

		throw create_app_error({
			layer: 'SERVICE',
			code: 'unexpected_error',
			context: { operation: 'upsert_products' },
			message: (e as Error).message
		}, e)
	}
}

export async function ESERVICE_get_products_by_category(sb: any, category_id: number, limit: number = 50): Promise<Product_Schema[]> {
	try {
		return await DAL_get_products_by_category(sb, category_id, limit)
	} catch (e) {
		if (is_app_error(e)) {
			throw push_error_frame(e, {
				layer: 'SERVICE',
				code: 'get_products_service_failed',
				context: { category_id },
				message: 'Failed to get products'
			})
		}

		throw create_app_error({
			layer: 'SERVICE',
			code: 'unexpected_error',
			context: { operation: 'get_products_by_category' },
			message: (e as Error).message
		}, e)
	}
}

export async function ESERVICE_upsert_categories(sb: any, categories: Partial<Category_Schema>[]): Promise<number[]> {
	try {
		const ids = await DAL_upsert_categories(sb, categories)
		const id_map = map_from_id_to_id(categories, ids)

		for (const category of categories) {
			if (!category.id) continue
			if (category.id > 0) continue
			category.id = id_map[category.id]
		}

		return ids
	} catch (e) {
		if (is_app_error(e)) {
			throw push_error_frame(e, {
				layer: 'SERVICE',
				code: 'upsert_categories_service_failed',
				context: { count: categories.length },
				message: 'Category upsert service failed'
			})
		}

		throw create_app_error({
			layer: 'SERVICE',
			code: 'unexpected_error',
			context: { operation: 'upsert_categories' },
			message: (e as Error).message
		}, e)
	}
}

export async function ESERVICE_create_order_with_items(
	sb: any,
	order: Partial<Order_Schema>,
	items: Partial<Order_Item_Schema>[]
): Promise<number> {
	try {
		const order_id = await DAL_create_order(sb, order)

		const items_with_order_id = items.map(item => ({
			...item,
			order_id
		}))

		await DAL_insert_order_items(sb, items_with_order_id)

		return order_id
	} catch (e) {
		if (is_app_error(e)) {
			throw push_error_frame(e, {
				layer: 'SERVICE',
				code: 'create_order_service_failed',
				context: { user_id: order.user_id, item_count: items.length },
				message: 'Failed to create order with items'
			})
		}

		throw create_app_error({
			layer: 'SERVICE',
			code: 'unexpected_error',
			context: { operation: 'create_order_with_items' },
			message: (e as Error).message
		}, e)
	}
}

export async function ESERVICE_get_orders_with_items_by_user(sb: any, user_id: string, limit: number = 20): Promise<Order_With_Items[]> {
	try {
		const orders = await DAL_get_orders_by_user(sb, user_id, limit)

		const orders_with_items: Order_With_Items[] = []

		for (const order of orders) {
			if (!order.id) continue

			const items = await DAL_get_order_items_by_order_id(sb, order.id)

			orders_with_items.push({
				order,
				items,
				total_items: items.length
			})
		}

		return orders_with_items
	} catch (e) {
		if (is_app_error(e)) {
			throw push_error_frame(e, {
				layer: 'SERVICE',
				code: 'get_orders_service_failed',
				context: { user_id },
				message: 'Failed to get orders with items'
			})
		}

		throw create_app_error({
			layer: 'SERVICE',
			code: 'unexpected_error',
			context: { operation: 'get_orders_with_items' },
			message: (e as Error).message
		}, e)
	}
}

export async function ESERVICE_update_order_status(sb: any, order_id: number, status: string): Promise<boolean> {
	try {
		return await DAL_update_order_status(sb, order_id, status)
	} catch (e) {
		if (is_app_error(e)) {
			throw push_error_frame(e, {
				layer: 'SERVICE',
				code: 'update_order_status_service_failed',
				context: { order_id, status },
				message: 'Failed to update order status'
			})
		}

		throw create_app_error({
			layer: 'SERVICE',
			code: 'unexpected_error',
			context: { operation: 'update_order_status' },
			message: (e as Error).message
		}, e)
	}
}

export async function ESERVICE_validate_and_create_order(
	sb: any,
	user_id: string,
	cart_items: { product_id: number, quantity: number }[]
): Promise<number> {
	try {
		const order_items: Partial<Order_Item_Schema>[] = []
		let total_amount = 0

		for (const cart_item of cart_items) {
			const product = await DAL_get_product_by_id(sb, cart_item.product_id)

			if (!product) {
				throw create_app_error({
					layer: 'SERVICE',
					code: 'product_not_found',
					context: { product_id: cart_item.product_id },
					message: `Product ${cart_item.product_id} not found`
				})
			}

			if (!product.is_active) {
				throw create_app_error({
					layer: 'SERVICE',
					code: 'product_not_available',
					context: { product_id: cart_item.product_id },
					message: `Product ${product.name} is not available`
				})
			}

			if (product.stock_quantity !== undefined && product.stock_quantity < cart_item.quantity) {
				throw create_app_error({
					layer: 'SERVICE',
					code: 'insufficient_stock',
					context: { product_id: cart_item.product_id, requested: cart_item.quantity, available: product.stock_quantity },
					message: `Insufficient stock for ${product.name}`
				})
			}

			const item_total = product.price * cart_item.quantity

			order_items.push({
				product_id: cart_item.product_id,
				quantity: cart_item.quantity,
				unit_price: product.price,
				total_price: item_total,
				product_name: product.name
			})

			total_amount += item_total
		}

		const order: Partial<Order_Schema> = {
			user_id,
			status: 'pending',
			total_amount,
			currency: 'USD'
		}

		return await ESERVICE_create_order_with_items(sb, order, order_items)
	} catch (e) {
		if (is_app_error(e)) {
			throw push_error_frame(e, {
				layer: 'SERVICE',
				code: 'validate_and_create_order_failed',
				context: { user_id, item_count: cart_items.length },
				message: 'Order validation and creation failed'
			})
		}

		throw create_app_error({
			layer: 'SERVICE',
			code: 'unexpected_error',
			context: { operation: 'validate_and_create_order' },
			message: (e as Error).message
		}, e)
	}
}
