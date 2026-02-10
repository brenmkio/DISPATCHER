<script lang="ts">
	import type { Dispatcher_Tickets_Schema } from '$lib/DISPATCHER/types'

	interface Props {
		tickets: Dispatcher_Tickets_Schema[]
	}

	let { tickets }: Props = $props()
</script>

<div class="ticket-list">
	<p>Ticket list - full implementation pending.</p>
	<p>Showing {tickets.length} ticket(s).</p>
</div>
