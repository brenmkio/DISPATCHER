import { create_app_error } from "$lib/EXAMPLE_CORE/errors"
import { deduplicate_array, dupe, recreate_id_array } from "$lib/EXAMPLE_CORE/utils"
import type { Category_Schema, Order_Item_Schema, Order_Schema, Product_Schema } from "./types"
import { NONUNIQUE_category_props, NONUNIQUE_order_item_props, NONUNIQUE_product_props, UNIQUE_category_props, UNIQUE_order_item_props, UNIQUE_product_props } from "./types"

export async function DAL_upsert_products(sb: any, data_to_upsert: Partial<Product_Schema>[]): Promise<number[]> {
	const data = dupe(data_to_upsert) as Partial<Product_Schema>[]

	data.forEach((d) => {
		delete d.id
		delete d.created_at
	})

	const { items, map } = deduplicate_array(data, undefined, NONUNIQUE_product_props)

	const { data: inserted, error } = await sb
		.from("Products")
		.upsert(items, { onConflict: UNIQUE_product_props })
		.select("id")

	if (error) {
		throw create_app_error({
			layer: 'DAL',
			code: 'upsert_products_failed',
			context: { count: items.length },
			message: 'Failed to upsert products',
		}, error)
	}

	const recreated_ids = recreate_id_array(inserted, map)

	return recreated_ids
}

export async function DAL_get_products_by_category(sb: any, category_id: number, limit: number = 50): Promise<Product_Schema[]> {
	const { data, error } = await sb
		.from('Products')
		.select('*')
		.eq('category_id', category_id)
		.eq('is_active', true)
		.order('name', { ascending: true })
		.limit(limit)

	if (error) {
		throw create_app_error({
			layer: 'DAL',
			code: 'get_products_by_category_failed',
			context: { category_id, limit },
			message: 'Failed to fetch products by category',
		}, error)
	}

	return data as Product_Schema[]
}

export async function DAL_get_product_by_id(sb: any, product_id: number): Promise<Product_Schema | null> {
	const { data, error } = await sb
		.from('Products')
		.select('*')
		.eq('id', product_id)
		.single()

	if (error) {
		if (error.code === 'PGRST116') {
			return null
		}
		throw create_app_error({
			layer: 'DAL',
			code: 'get_product_by_id_failed',
			context: { product_id },
			message: 'Failed to fetch product',
		}, error)
	}

	return data as Product_Schema
}

export async function DAL_upsert_categories(sb: any, data_to_upsert: Partial<Category_Schema>[]): Promise<number[]> {
	const data = dupe(data_to_upsert) as Partial<Category_Schema>[]

	data.forEach((d) => {
		delete d.id
		delete d.created_at
	})

	const { items, map } = deduplicate_array(data, undefined, NONUNIQUE_category_props)

	const { data: inserted, error } = await sb
		.from("Categories")
		.upsert(items, { onConflict: UNIQUE_category_props })
		.select("id")

	if (error) {
		throw create_app_error({
			layer: 'DAL',
			code: 'upsert_categories_failed',
			context: { count: items.length },
			message: 'Failed to upsert categories',
		}, error)
	}

	const recreated_ids = recreate_id_array(inserted, map)

	return recreated_ids
}

export async function DAL_get_all_categories(sb: any): Promise<Category_Schema[]> {
	const { data, error } = await sb
		.from('Categories')
		.select('*')
		.order('sort_order', { ascending: true })

	if (error) {
		throw create_app_error({
			layer: 'DAL',
			code: 'get_all_categories_failed',
			context: {},
			message: 'Failed to fetch categories',
		}, error)
	}

	return data as Category_Schema[]
}

export async function DAL_create_order(sb: any, order: Partial<Order_Schema>): Promise<number> {
	const { data, error } = await sb
		.from('Orders')
		.insert(order)
		.select('id')
		.single()

	if (error) {
		throw create_app_error({
			layer: 'DAL',
			code: 'create_order_failed',
			context: { user_id: order.user_id },
			message: 'Failed to create order',
		}, error)
	}

	return data.id
}

export async function DAL_insert_order_items(sb: any, items: Partial<Order_Item_Schema>[]): Promise<boolean> {
	const { error } = await sb
		.from('Order_Items')
		.insert(items)

	if (error) {
		throw create_app_error({
			layer: 'DAL',
			code: 'insert_order_items_failed',
			context: { count: items.length },
			message: 'Failed to insert order items',
		}, error)
	}

	return true
}

export async function DAL_get_orders_by_user(sb: any, user_id: string, limit: number = 20): Promise<Order_Schema[]> {
	const { data, error } = await sb
		.from('Orders')
		.select('*')
		.eq('user_id', user_id)
		.order('created_at', { ascending: false })
		.limit(limit)

	if (error) {
		throw create_app_error({
			layer: 'DAL',
			code: 'get_orders_by_user_failed',
			context: { user_id, limit },
			message: 'Failed to fetch user orders',
		}, error)
	}

	return data as Order_Schema[]
}

export async function DAL_get_order_items_by_order_id(sb: any, order_id: number): Promise<Order_Item_Schema[]> {
	const { data, error } = await sb
		.from('Order_Items')
		.select('*')
		.eq('order_id', order_id)

	if (error) {
		throw create_app_error({
			layer: 'DAL',
			code: 'get_order_items_failed',
			context: { order_id },
			message: 'Failed to fetch order items',
		}, error)
	}

	return data as Order_Item_Schema[]
}

export async function DAL_update_order_status(sb: any, order_id: number, status: string): Promise<boolean> {
	const { error } = await sb
		.from('Orders')
		.update({ status })
		.eq('id', order_id)

	if (error) {
		throw create_app_error({
			layer: 'DAL',
			code: 'update_order_status_failed',
			context: { order_id, status },
			message: 'Failed to update order status',
		}, error)
	}

	return true
}
