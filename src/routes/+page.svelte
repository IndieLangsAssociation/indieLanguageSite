<script lang="ts">
	import BoardRow from '$lib/components/BoardRow.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import { languages, usedTags } from '$lib/content/languages';
	import type { Tag } from '$lib/content/schema';

	const tags = usedTags();

	let active = $state<Tag | null>(null);

	const shown = $derived.by(() => {
		const tag = active;
		return tag ? languages.filter((language) => language.tags?.includes(tag)) : languages;
	});
</script>

<Meta />

<div class="page">
	<div class="lede">
		<h1>Programming languages people made because they wanted to.</h1>
		<p class="count">
			{languages.length} of them so far. <a href="/submit">Add yours</a>.
		</p>
	</div>

	{#if tags.length}
		<div class="filters">
			<span id="filter-label" class="visually-hidden">Filter by tag</span>
			<div role="group" aria-labelledby="filter-label">
				<button type="button" aria-pressed={active === null} onclick={() => (active = null)}>
					all
				</button>
				{#each tags as { tag, count } (tag)}
					<button
						type="button"
						aria-pressed={active === tag}
						onclick={() => (active = active === tag ? null : tag)}
					>
						{tag}<span class="count-badge">{count}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<ul class="board">
		{#each shown as language, index (language.slug)}
			<BoardRow {language} {index} />
		{/each}
	</ul>

	{#if shown.length === 0}
		<p class="empty">Nothing tagged {active} yet.</p>
	{/if}
</div>

<style>
	.lede {
		padding-block: var(--space-5) var(--space-4);
	}

	h1 {
		font-size: var(--step-display);
		font-variation-settings: 'wdth' 75, 'opsz' 48;
		letter-spacing: -0.035em;
		max-width: 16ch;
	}

	.count {
		margin: var(--space-3) 0 0;
		color: var(--dim);
		font-size: var(--step-lead);
	}

	.count a {
		color: var(--flare);
		text-decoration: none;
		border-bottom: 2px solid currentColor;
	}

	.filters {
		padding-bottom: var(--space-3);
		border-bottom: 1px solid var(--rule);
	}

	.filters div {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
	}

	button {
		display: inline-flex;
		align-items: baseline;
		gap: 0.4em;
		padding: var(--space-1) var(--space-2);
		border: 1px solid var(--rule);
		border-radius: 100px;
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

	button[aria-pressed='true'] {
		background: var(--type);
		border-color: var(--type);
		color: var(--paper);
	}

	.count-badge {
		font-size: 0.8em;
		opacity: 0.65;
	}

	.board {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.empty {
		padding-block: var(--space-5);
		color: var(--dim);
	}
</style>
