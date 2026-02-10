<script lang="ts">
	import type { PageData } from './$types'
	import StatusBadge from '$lib/components/StatusBadge.svelte'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()

	function format_date(date_string: string | undefined): string {
		if (!date_string) return ''
		try {
			return new Date(date_string).toLocaleDateString('en-US', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
				year: 'numeric'
			})
		} catch {
			return date_string
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<header class="bg-white border-b border-gray-200">
		<div class="max-w-2xl mx-auto px-4 py-4">
			<h1 class="text-xl font-bold text-gray-900">Shipment Tracking</h1>
		</div>
	</header>

	<main class="max-w-2xl mx-auto px-4 py-6">
		{#if data.ticket}
			<div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
				<div class="p-6 border-b border-gray-200 flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-500">Current Status</p>
						<div class="mt-1">
							<StatusBadge status={data.ticket.status} />
						</div>
					</div>
					{#if data.ticket.estimated_delivery}
						<div class="text-right">
							<p class="text-sm text-gray-500">Estimated Delivery</p>
							<p class="text-sm font-medium text-gray-900 mt-1">{format_date(data.ticket.estimated_delivery)}</p>
						</div>
					{/if}
				</div>

				<div class="p-6 space-y-4">
					<div>
						<p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Client</p>
						<p class="text-sm text-gray-900 mt-1">{data.ticket.client_name}</p>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Pickup Location</p>
							<p class="text-sm text-gray-900 mt-1">{data.ticket.pickup_location}</p>
						</div>
						<div>
							<p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Delivery Location</p>
							<p class="text-sm text-gray-900 mt-1">{data.ticket.delivery_location}</p>
						</div>
					</div>

					<div>
						<p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Item Description</p>
						<p class="text-sm text-gray-900 mt-1">{data.ticket.item_description}</p>
					</div>

					{#if data.ticket.notes}
						<div>
							<p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes</p>
							<p class="text-sm text-gray-900 mt-1">{data.ticket.notes}</p>
						</div>
					{/if}
				</div>
			</div>

			<p class="text-center text-xs text-gray-400 mt-6">
				Powered by Dispatcher
			</p>
		{/if}
	</main>
</div>
