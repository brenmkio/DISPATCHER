<script lang="ts">
	import { enhance } from '$app/forms'
	import type { PageData } from './$types'
	import StatusBadge from '$lib/components/StatusBadge.svelte'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()

	let filter_status = $state('all')

	const filtered_tickets = $derived(
		filter_status === 'all'
			? data.tickets || []
			: (data.tickets || []).filter(t => t.status === filter_status)
	)

	const status_counts = $derived(() => {
		const tickets = data.tickets || []
		return {
			all: tickets.length,
			pending: tickets.filter(t => t.status === 'pending').length,
			picked_up: tickets.filter(t => t.status === 'picked_up').length,
			in_transit: tickets.filter(t => t.status === 'in_transit').length,
			delivered: tickets.filter(t => t.status === 'delivered').length,
			cancelled: tickets.filter(t => t.status === 'cancelled').length
		}
	})

	function format_date(date_string: string | undefined): string {
		if (!date_string) return '-'
		try {
			return new Date(date_string).toLocaleDateString('en-US', {
				month: 'short',
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
		<div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
			<div>
				<h1 class="text-xl font-bold text-gray-900">Dispatcher</h1>
				<p class="text-xs text-gray-500">Shipment Dashboard</p>
			</div>
			<div class="flex items-center gap-3">
				<a
					href="/admin/tickets/new"
					class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
				>
					+ New Ticket
				</a>
				<form method="POST" action="?/logout" use:enhance>
					<button
						type="submit"
						class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
					>
						Logout
					</button>
				</form>
			</div>
		</div>
	</header>

	<main class="max-w-6xl mx-auto px-4 py-6">
		<div class="flex flex-wrap gap-2 mb-6">
			{#each ['all', 'pending', 'picked_up', 'in_transit', 'delivered', 'cancelled'] as status}
				<button
					onclick={() => filter_status = status}
					class="px-3 py-1.5 text-xs font-medium rounded-full transition-colors {filter_status === status ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}"
				>
					{status === 'all' ? 'All' : status.replace('_', ' ')} ({status_counts()[status as keyof ReturnType<typeof status_counts>]})
				</button>
			{/each}
		</div>

		{#if filtered_tickets.length === 0}
			<div class="bg-white rounded-lg border border-gray-200 p-12 text-center">
				<p class="text-gray-500 text-sm">
					{#if filter_status !== 'all'}
						No tickets with status "{filter_status.replace('_', ' ')}".
					{:else}
						No tickets yet. Create your first shipment ticket to get started.
					{/if}
				</p>
				{#if filter_status === 'all'}
					<a
						href="/admin/tickets/new"
						class="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
					>
						+ Create First Ticket
					</a>
				{/if}
			</div>
		{:else}
			<div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="bg-gray-50 border-b border-gray-200">
								<th class="text-left px-4 py-3 font-medium text-gray-600">Client</th>
								<th class="text-left px-4 py-3 font-medium text-gray-600">Status</th>
								<th class="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Pickup</th>
								<th class="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Delivery</th>
								<th class="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Est. Delivery</th>
								<th class="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Created</th>
								<th class="px-4 py-3"></th>
							</tr>
						</thead>
						<tbody>
							{#each filtered_tickets as ticket}
								<tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
									<td class="px-4 py-3">
										<div class="font-medium text-gray-900">{ticket.client_name}</div>
										<div class="text-xs text-gray-500">{ticket.client_email}</div>
									</td>
									<td class="px-4 py-3">
										<StatusBadge status={ticket.status} />
									</td>
									<td class="px-4 py-3 text-gray-600 hidden md:table-cell max-w-[200px] truncate">{ticket.pickup_location}</td>
									<td class="px-4 py-3 text-gray-600 hidden md:table-cell max-w-[200px] truncate">{ticket.delivery_location}</td>
									<td class="px-4 py-3 text-gray-600 hidden lg:table-cell">{format_date(ticket.estimated_delivery)}</td>
									<td class="px-4 py-3 text-gray-600 hidden lg:table-cell">{format_date(ticket.created_at)}</td>
									<td class="px-4 py-3 text-right">
										<a
											href="/admin/tickets/{ticket.id}"
											class="text-blue-600 hover:text-blue-800 text-sm font-medium"
										>
											Edit
										</a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	</main>
</div>
