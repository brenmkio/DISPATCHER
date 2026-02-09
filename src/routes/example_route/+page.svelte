<script lang="ts">
	import { fetch_json } from '$lib/EXAMPLE_CORE/response'
	import type { ActionData, PageData } from './$types'
	import Example_Form from './Example_Form.svelte'
	
	interface Props {
		data: PageData
		form: ActionData
	}
	
	let { data, form }: Props = $props()
	
	const { example_data } = $derived(data)
	
	let api_result = $state<string>('')
	let api_error = $state<string>('')
	let is_loading = $state(false)
	
	async function test_api_endpoint() {
		is_loading = true
		api_error = ''
		api_result = ''
		
		const { res_data, res_error } = await fetch_json<{ greeting: string; timestamp: string }>('/example_route?name=Developer')
		
		if (res_error) {
			api_error = res_error.message
		} else if (res_data) {
			api_result = `${res_data.greeting} (${res_data.timestamp})`
		}
		
		is_loading = false
	}
</script>

<div class="page-container">
	<header class="page-header">
		<h1>{example_data.title}</h1>
		<p class="subtitle">{example_data.description}</p>
	</header>

	<main class="page-main">
		<section class="section">
			<h2>Key Features</h2>
			<ul class="feature-list">
				{#each example_data.features as feature}
					<li>{feature}</li>
				{/each}
			</ul>
		</section>

		<section class="section">
			<h2>Template Statistics</h2>
			<div class="stats-grid">
				<div class="stat-card">
					<div class="stat-value">{example_data.stats.domains}</div>
					<div class="stat-label">Example Domains</div>
				</div>
				<div class="stat-card">
					<div class="stat-value">{example_data.stats.utilities}</div>
					<div class="stat-label">Core Utilities</div>
				</div>
				<div class="stat-card">
					<div class="stat-value">{example_data.stats.patterns}</div>
					<div class="stat-label">Established Patterns</div>
				</div>
			</div>
		</section>

		<section class="section">
			<h2>Getting Started</h2>
			<ol class="steps-list">
				<li>Read <code>CODING_PATTERNS.md</code> to understand the architecture</li>
				<li>Review <code>EXAMPLE_DATA/</code> for domain structure patterns</li>
				<li>Check <code>EXAMPLE_CORE/</code> for utility implementations</li>
				<li>Follow <code>PROJECT_GUIDE.md</code> when working with AI agents</li>
				<li>Start building your features using the established patterns</li>
			</ol>
		</section>

		<section class="section">
			<h2>Architecture Layers</h2>
			<div class="layers">
				<div class="layer">
					<h3>DAL (Database Access Layer)</h3>
					<p>Direct database operations only. No business logic.</p>
					<code>DAL_get_products()</code>
				</div>
				<div class="layer">
					<h3>SERVICE (Business Logic)</h3>
					<p>Orchestrates DAL calls, handles ID mapping and transactions.</p>
					<code>ESERVICE_create_order()</code>
				</div>
				<div class="layer">
					<h3>UTILS (Pure Functions)</h3>
					<p>Data transformation and validation. No side effects.</p>
					<code>EUTIL_format_price()</code>
				</div>
			</div>
		</section>
	</main>
    
	
	<Example_Form {form} />

	<footer class="page-footer">
		<section class="section">
			<h2>API Endpoint Example</h2>
			<p>Test the example API endpoint with error handling:</p>
			<button onclick={test_api_endpoint} disabled={is_loading}>
				{is_loading ? 'Loading...' : 'Test API Endpoint'}
			</button>
			
			{#if api_result}
				<div class="api-result success">
					<strong>Success:</strong> {api_result}
				</div>
			{/if}
			
			{#if api_error}
				<div class="api-result error">
					<strong>Error:</strong> {api_error}
				</div>
			{/if}
			
			<p class="note">
				See <code>/example_route/+server.ts</code> for the endpoint implementation with proper error handling.
			</p>
		</section>
		
		<p class="footer-note">This is UI1: functional, unstyled, ready for your design system.</p>
	</footer>
</div>

<style>
	.page-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
		font-family: 'Times New Roman', Times, serif;
		background: white;
		color: black;
	}

	.page-header {
		margin-bottom: 3rem;
		border-bottom: 1px solid black;
		padding-bottom: 1rem;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: normal;
		margin: 0 0 0.5rem 0;
	}

	.subtitle {
		font-size: 1.125rem;
		margin: 0;
		font-style: italic;
	}

	h2 {
		font-size: 1.75rem;
		font-weight: normal;
		margin: 0 0 1rem 0;
		border-bottom: 1px solid black;
		padding-bottom: 0.25rem;
	}

	h3 {
		font-size: 1.25rem;
		font-weight: normal;
		margin: 0 0 0.5rem 0;
	}

	.page-main {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.feature-list {
		list-style-type: disc;
		padding-left: 2rem;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.feature-list li {
		line-height: 1.5;
	}

	.stats-grid {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.stat-card {
		flex: 1;
		min-width: 150px;
		border: 1px solid black;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.stat-value {
		font-size: 3rem;
		line-height: 1;
	}

	.stat-label {
		font-size: 0.875rem;
		text-align: center;
	}

	.steps-list {
		list-style-type: decimal;
		padding-left: 2rem;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.steps-list li {
		line-height: 1.5;
	}

	code {
		font-family: 'Courier New', Courier, monospace;
		background: #f5f5f5;
		padding: 0.125rem 0.25rem;
		border: 1px solid #ddd;
	}

	.layers {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.layer {
		border: 1px solid black;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.layer p {
		margin: 0;
		line-height: 1.5;
	}

	.page-footer {
		margin-top: 3rem;
		padding-top: 1rem;
		border-top: 1px solid black;
		text-align: center;
		font-style: italic;
	}

	.page-footer p {
		margin: 0;
	}
	
	.footer-note {
		margin-top: 2rem;
		font-style: italic;
	}
	
	button {
		padding: 0.75rem 1.5rem;
		border: 1px solid black;
		background: white;
		font-family: 'Times New Roman', Times, serif;
		font-size: 1rem;
		cursor: pointer;
		margin-bottom: 1rem;
	}
	
	button:hover:not(:disabled) {
		background: black;
		color: white;
	}
	
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.api-result {
		padding: 1rem;
		border: 1px solid black;
		margin-bottom: 1rem;
	}
	
	.api-result.success {
		background: #e0ffe0;
		color: #060;
	}
	
	.api-result.error {
		background: #ffe0e0;
		color: #c00;
	}
	
	.note {
		font-size: 0.875rem;
		font-style: italic;
	}

	@media (max-width: 640px) {
		.page-container {
			padding: 1rem 0.75rem;
		}

		h1 {
			font-size: 2rem;
		}

		h2 {
			font-size: 1.5rem;
		}

		.stats-grid {
			flex-direction: column;
		}

		.stat-card {
			min-width: 100%;
		}
	}
</style>
