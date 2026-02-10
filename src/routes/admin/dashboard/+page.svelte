<script lang="ts">
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<div class="dashboard-container">
	<h1>Admin Dashboard</h1>
	<p>Ticket management dashboard - implementation pending.</p>
	<p>Total tickets: {data.tickets?.length || 0}</p>
</div>
