<script lang="ts">
	import { enhance } from '$app/forms'
	import type { ActionData, PageData } from './$types'
	
	interface Props {
		data: PageData
		form: ActionData
	}
	
	let { data }: Props = $props()
</script>

<div class="container">
	<h1>SvelteKit Template</h1>
	<p>{data.message}</p>
	
	<p>
		This is a minimal starting page. 
		See <a href="/example_route">/example_route</a> for a complete example with architecture documentation.
	</p>
</div>

<style>
	.container {
		max-width: 600px;
		margin: 2rem auto;
		padding: 0 1rem;
		font-family: 'Times New Roman', Times, serif;
	}
	
	h1 {
		font-size: 2rem;
		font-weight: normal;
		margin: 0 0 1rem 0;
	}
	
	p {
		line-height: 1.5;
		margin: 0 0 1rem 0;
	}
	
	a {
		color: blue;
		text-decoration: underline;
	}
</style>
