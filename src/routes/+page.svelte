<script lang="ts">
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
	<div class="text-center">
		<h1 class="text-3xl font-bold text-gray-900 mb-2">Dispatcher</h1>
		<p class="text-gray-500 mb-8">Shipment tracking made simple.</p>
		<a
			href="/admin/login"
			class="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
		>
			Admin Login
		</a>
	</div>
</div>
