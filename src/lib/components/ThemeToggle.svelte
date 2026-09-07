<script lang="ts">
	import { onMount } from 'svelte';

	let theme = $state<'light' | 'dark'>('dark');

	// The real value is set by the inline script in app.html before first paint;
	// read it back rather than assuming, so the button never lies.
	onMount(() => {
		const current = document.documentElement.dataset.theme;
		theme = current === 'light' ? 'light' : 'dark';
	});

	function toggle() {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem('theme', theme);
		} catch {
			// Private browsing — the choice just won't survive a reload.
		}
	}
</script>

<button type="button" onclick={toggle}>
	{#if theme === 'dark'}
		<svg viewBox="0 0 20 20" aria-hidden="true" width="18" height="18">
			<path
				d="M16 12.5A7 7 0 0 1 7.5 4a7 7 0 1 0 8.5 8.5Z"
				fill="none"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linejoin="round"
			/>
		</svg>
		Light
	{:else}
		<svg viewBox="0 0 20 20" aria-hidden="true" width="18" height="18">
			<circle cx="10" cy="10" r="3.6" fill="none" stroke="currentColor" stroke-width="1.6" />
			<g stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
				<path d="M10 1.6v2M10 16.4v2M1.6 10h2M16.4 10h2M4 4l1.4 1.4M14.6 14.6 16 16M16 4l-1.4 1.4M5.4 14.6 4 16" />
			</g>
		</svg>
		Dark
	{/if}
	<span class="visually-hidden">theme</span>
</button>

<style>
	button {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		border: 1px solid var(--rule);
		border-radius: var(--radius);
		background: none;
		color: var(--dim);
		font: inherit;
		font-size: var(--step-small);
		cursor: pointer;
	}

	button:hover {
		color: var(--type);
		border-color: var(--dim);
	}
</style>
