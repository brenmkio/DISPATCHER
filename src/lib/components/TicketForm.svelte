<script lang="ts">
	import { enhance } from '$app/forms'
	import type { Dispatcher_Tickets_Schema, Ticket_Status } from '$lib/DISPATCHER/types'

	interface Props {
		ticket?: Dispatcher_Tickets_Schema
		action: string
		is_edit?: boolean
		error_message?: string
		form_data?: Record<string, string | undefined>
	}

	let { ticket, action, is_edit = false, error_message, form_data }: Props = $props()

	let is_submitting = $state(false)

	const statuses: Ticket_Status[] = ['pending', 'picked_up', 'in_transit', 'delivered', 'cancelled']

	function get_value(field: string): string {
		if (form_data?.[field] !== undefined) return form_data[field] || ''
		if (ticket && field in ticket) return (ticket as any)[field] || ''
		return ''
	}
</script>

<form
	method="POST"
	action={action}
	use:enhance={() => {
		is_submitting = true
		return async ({ update }) => {
			await update()
			is_submitting = false
		}
	}}
	class="space-y-5"
>
	{#if error_message}
		<div class="rounded-md bg-red-50 border border-red-200 p-4">
			<p class="text-sm text-red-700">{error_message}</p>
		</div>
	{/if}

	{#if is_edit}
		<div>
			<label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
			<select
				id="status"
				name="status"
				value={get_value('status')}
				class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
			>
				{#each statuses as s}
					<option value={s} selected={get_value('status') === s}>{s.replace('_', ' ')}</option>
				{/each}
			</select>
		</div>
	{/if}

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div>
			<label for="client_name" class="block text-sm font-medium text-gray-700 mb-1">Client Name <span class="text-red-500">*</span></label>
			<input
				type="text"
				id="client_name"
				name="client_name"
				value={get_value('client_name')}
				required
				class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
				placeholder="John Smith"
			/>
		</div>

		<div>
			<label for="client_email" class="block text-sm font-medium text-gray-700 mb-1">Client Email <span class="text-red-500">*</span></label>
			<input
				type="email"
				id="client_email"
				name="client_email"
				value={get_value('client_email')}
				required
				class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
				placeholder="john@example.com"
			/>
		</div>
	</div>

	<div>
		<label for="pickup_location" class="block text-sm font-medium text-gray-700 mb-1">Pickup Location <span class="text-red-500">*</span></label>
		<input
			type="text"
			id="pickup_location"
			name="pickup_location"
			value={get_value('pickup_location')}
			required
			class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
			placeholder="123 Warehouse Ave, City, State"
		/>
	</div>

	<div>
		<label for="delivery_location" class="block text-sm font-medium text-gray-700 mb-1">Delivery Location <span class="text-red-500">*</span></label>
		<input
			type="text"
			id="delivery_location"
			name="delivery_location"
			value={get_value('delivery_location')}
			required
			class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
			placeholder="456 Customer Rd, City, State"
		/>
	</div>

	<div>
		<label for="item_description" class="block text-sm font-medium text-gray-700 mb-1">Item Description <span class="text-red-500">*</span></label>
		<textarea
			id="item_description"
			name="item_description"
			required
			rows="3"
			class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y"
			placeholder="Describe the items being shipped..."
		>{get_value('item_description')}</textarea>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div>
			<label for="estimated_delivery" class="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery</label>
			<input
				type="date"
				id="estimated_delivery"
				name="estimated_delivery"
				value={get_value('estimated_delivery')}
				class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
			/>
		</div>
	</div>

	<div>
		<label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
		<textarea
			id="notes"
			name="notes"
			rows="2"
			class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y"
			placeholder="Additional notes or special instructions..."
		>{get_value('notes')}</textarea>
	</div>

	<div class="flex gap-3 pt-2">
		<button
			type="submit"
			disabled={is_submitting}
			class="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
		>
			{is_submitting ? 'Saving...' : is_edit ? 'Update Ticket' : 'Create Ticket'}
		</button>

		<a
			href={is_edit ? '/admin/dashboard' : '/admin/dashboard'}
			class="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
		>
			Cancel
		</a>
	</div>
</form>
