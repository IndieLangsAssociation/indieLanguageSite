<script lang="ts">
	import type { Language } from '$lib/content/types';
	import { initialOf, plateAccent } from '$lib/plate';

	let { language, large = false }: { language: Language; large?: boolean } = $props();

	const accent = $derived(plateAccent(language.slug));
	const fit = $derived(language.logoFit ?? 'contain');
</script>

<div class="plate" class:large data-accent={accent} data-fit={fit}>
	{#if language.logo?.kind === 'raster'}
		<enhanced:img src={language.logo.picture} alt="" />
	{:else if language.logo?.kind === 'svg'}
		<img src={language.logo.src} alt="" />
	{:else}
		<!-- No logo is a designed state, not a broken image. -->
		<span class="initial" aria-hidden="true">{initialOf(language.name)}</span>
	{/if}
</div>

<style>
	.plate {
		position: relative;
		flex: none;
		width: var(--plate-size);
		height: var(--plate-size);
		display: grid;
		place-items: center;
		overflow: hidden;
		background: var(--plate);
		border: 2px solid var(--accent);
		border-radius: var(--radius);
		--accent: var(--flare);
	}

	.plate[data-accent='signal'] {
		--accent: var(--signal);
	}

	.plate.large {
		--plate-size: clamp(5rem, 14vw, 7rem);
	}

	.plate :global(img),
	.plate :global(picture) {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: block;
	}

	.plate[data-fit='fill'] :global(img) {
		object-fit: cover;
	}

	.plate :global(picture img) {
		width: 100%;
		height: 100%;
	}

	.initial {
		font-size: calc(var(--plate-size) * 0.5);
		font-weight: 800;
		line-height: 1;
		color: var(--accent);
		font-variation-settings: 'wdth' 75;
	}
</style>
