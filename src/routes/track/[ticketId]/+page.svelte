<script lang="ts">
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<div class="tracking-container">
	<h1>Shipment Tracking</h1>
	<p>Public tracking page - full implementation pending.</p>

	{#if data.ticket}
		<div class="tracking-info">
			<p><strong>Status:</strong> {data.ticket.status}</p>
			<p><strong>Pickup:</strong> {data.ticket.pickup_location}</p>
			<p><strong>Delivery:</strong> {data.ticket.delivery_location}</p>
			<p><strong>Item:</strong> {data.ticket.item_description}</p>
			{#if data.ticket.estimated_delivery}
				<p><strong>Estimated Delivery:</strong> {data.ticket.estimated_delivery}</p>
			{/if}
		</div>
	{/if}
</div>
