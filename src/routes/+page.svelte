<script lang="ts">
	import type { PageData } from './$types'
	import { DUTIL_format_error_for_display } from '$lib/DISPATCHER/utils'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()

	const error_details = $derived(
		data.error ? DUTIL_format_error_for_display(data.error) : null
	)
</script>

<div class="container">
	<h1>Dispatcher - Shipment Tracking</h1>
	<p>{data.message}</p>

	{#if error_details}
		<div class="error">
			<h3>Error Summary:</h3>
			<pre class="error-summary">{error_details.summary}</pre>

			<h4>Error Details:</h4>
			<pre class="error-details">{error_details.details}</pre>

			{#if error_details.troubleshooting.length > 0}
				<h4>Troubleshooting Steps:</h4>
				<ul class="troubleshooting">
					{#each error_details.troubleshooting as step}
						<li>{step}</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}

	{#if data.tickets && data.tickets.length > 0}
		<div class="success">
			<h3>Recent Tickets:</h3>
			<pre>{JSON.stringify(data.tickets, null, 2)}</pre>
		</div>
	{:else if !data.error}
		<div class="no-data">
			<p>No tickets found in DISPATCHER_Tickets table.</p>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 900px;
		margin: 2rem auto;
		padding: 0 1rem;
		font-family: system-ui, -apple-system, sans-serif;
	}

	h1 {
		font-size: 2rem;
		margin: 0 0 1rem 0;
		color: #333;
	}

	h3 {
		font-size: 1.2rem;
		margin: 1.5rem 0 0.5rem 0;
		color: #555;
	}

	h4 {
		font-size: 1.1rem;
		margin: 1rem 0 0.5rem 0;
		color: #666;
	}

	pre {
		background: #f5f5f5;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		font-size: 0.9rem;
		border: 1px solid #ddd;
	}

	.error-summary {
		background: #ffebee;
		border-color: #f44336;
		color: #c62828;
		font-weight: bold;
	}

	.error-details {
		background: #fff3e0;
		border-color: #ff9800;
		color: #e65100;
		font-size: 0.8rem;
	}

	.troubleshooting {
		background: #e3f2fd;
		border: 1px solid #2196f3;
		border-radius: 4px;
		padding: 1rem;
		margin: 1rem 0;
	}

	.troubleshooting li {
		margin: 0.5rem 0;
		color: #1565c0;
	}

	.success pre {
		background: #e8f5e8;
		border-color: #4caf50;
		color: #2e7d32;
	}

	.no-data {
		margin-top: 1rem;
		padding: 1rem;
		background: #fff3cd;
		border: 1px solid #ffc107;
		border-radius: 4px;
		color: #856404;
	}
</style>
