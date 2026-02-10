<script lang="ts">
	import type { PageData, ActionData } from './$types'

	interface Props {
		data: PageData
		form: ActionData
	}

	let { data, form }: Props = $props()
</script>

<div class="ticket-detail-container">
	<h1>Ticket Detail</h1>
	<p>Ticket editor - full implementation pending.</p>

	{#if data.ticket}
		<pre>{JSON.stringify(data.ticket, null, 2)}</pre>
	{/if}

	{#if form?.error}
		<div class="error-message">{form.error}</div>
	{/if}

	{#if form?.success}
		<div class="success-message">Ticket updated successfully.</div>
	{/if}
</div>
