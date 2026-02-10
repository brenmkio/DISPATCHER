<script lang="ts">
	import type { Ticket_Status } from '$lib/DISPATCHER/types'

	interface Props {
		status: Ticket_Status | string
	}

	let { status }: Props = $props()

	const status_colors: Record<string, string> = {
		pending: '#ffc107',
		picked_up: '#17a2b8',
		in_transit: '#007bff',
		delivered: '#28a745',
		cancelled: '#dc3545'
	}

	const background_color = $derived(status_colors[status] || '#6c757d')
</script>

<span class="status-badge" style="background-color: {background_color}">
	{status}
</span>

<style>
	.status-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
		color: white;
		font-size: 0.875rem;
		font-weight: 500;
		text-transform: capitalize;
	}
</style>
