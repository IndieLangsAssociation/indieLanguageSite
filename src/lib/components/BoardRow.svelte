<script lang="ts">
	import type { Language } from '$lib/content/types';
	import Plate from './Plate.svelte';

	let { language, index }: { language: Language; index: number } = $props();

	const links = $derived(
		[
			{ label: 'site', href: language.links?.website },
			{ label: 'repo', href: language.links?.github },
			{ label: 'chat', href: language.links?.discord }
		].filter((link): link is { label: string; href: string } => Boolean(link.href))
	);
</script>

<li class="row" style="--i: {index}">
	<Plate {language} />

	<div class="body">
		<h2 class="name"><a href={language.href}>{language.name}</a></h2>
		<p class="tagline">{language.tagline}</p>

		<div class="foot">
			{#if language.sampleLine}
				<code class="sample">{@html language.sampleLine}</code>
			{:else}
				<span></span>
			{/if}

			{#if links.length}
				<ul class="links">
					{#each links as link (link.label)}
						<li>
							<a href={link.href} target="_blank" rel="noopener noreferrer">
								{link.label}<span class="visually-hidden"> for {language.name}</span>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</li>

<style>
	.row {
		position: relative;
		display: flex;
		gap: var(--space-3);
		padding: var(--space-4) var(--space-3);
		border-radius: var(--radius);
	}

	/* The rule is drawn as a pseudo-element so it can animate in on load. */
	.row::before {
		content: '';
		position: absolute;
		inset-inline: var(--space-3);
		bottom: 0;
		height: 1px;
		background: var(--rule);
		transform-origin: left;
		animation: rule-in 420ms cubic-bezier(0.2, 0.7, 0.3, 1) backwards;
		animation-delay: calc(var(--i) * 45ms);
	}

	.row:last-child::before {
		display: none;
	}

	.row:hover {
		background: var(--surface);
	}

	.body {
		min-width: 0;
		flex: 1;
	}

	.name {
		font-size: var(--step-title);
		font-variation-settings: 'wdth' 85, 'opsz' 40;
	}

	.name a {
		text-decoration: none;
	}

	/* One focusable target for the whole row; the outbound links sit above it. */
	.name a::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: var(--radius);
	}

	.tagline {
		margin: var(--space-1) 0 0;
		color: var(--dim);
		max-width: 52ch;
	}

	.foot {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-3);
		margin-top: var(--space-2);
		min-height: 1.5em;
	}

	.sample {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: var(--step-tiny);
		color: var(--dim);
	}

	.links {
		position: relative;
		z-index: 1;
		display: flex;
		gap: var(--space-3);
		margin: 0;
		padding: 0;
		list-style: none;
		flex: none;
		font-size: var(--step-small);
	}

	.links a {
		color: var(--dim);
		text-decoration: none;
		border-bottom: 1px solid transparent;
	}

	.links a:hover {
		color: var(--flare);
		border-bottom-color: currentColor;
	}

	@keyframes rule-in {
		from {
			transform: scaleX(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.row::before {
			animation: none;
		}
	}

	@media (max-width: 34rem) {
		.row {
			padding-block: var(--space-3);
		}

		.foot {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-2);
		}

		.sample {
			max-width: 100%;
		}
	}
</style>
