<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import { languages, makers } from '$lib/content/languages';

	const people = makers();
	const credited = people.reduce((total, maker) => total + maker.languages.length, 0);
	const uncredited = languages.length - credited;

	function profile(maker: { github?: string; url?: string }) {
		return maker.url ?? (maker.github ? `https://github.com/${maker.github}` : null);
	}
</script>

<Meta
	title="Makers"
	description="The people who built the languages listed on indielangs.org."
/>

<div class="page">
	<div class="lede">
		<h1>The people who made these</h1>
		<p>Someone sat down and built each of these on purpose. Here they are.</p>
	</div>

	<ul class="makers">
		{#each people as maker (maker.name)}
			{@const href = profile(maker)}
			<li>
				<h2>
					{#if href}
						<a {href} target="_blank" rel="noopener noreferrer">{maker.name}</a>
					{:else}
						{maker.name}
					{/if}
				</h2>
				<ul class="their-languages">
					{#each maker.languages as language (language.slug)}
						<li><a href={language.href}>{language.name}</a></li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>

	{#if uncredited > 0}
		<p class="note">
			{uncredited}
			{uncredited === 1 ? 'language on this site has' : 'languages on this site have'} no maker
			listed. If one of them is yours, <a href="/submit">add yourself</a>.
		</p>
	{/if}
</div>

<style>
	.lede {
		padding-block: var(--space-5) var(--space-4);
		border-bottom: 1px solid var(--rule);
	}

	h1 {
		font-size: var(--step-display);
		font-variation-settings: 'wdth' 75, 'opsz' 48;
		letter-spacing: -0.035em;
		max-width: 14ch;
	}

	.lede p {
		margin: var(--space-3) 0 0;
		font-size: var(--step-lead);
		color: var(--dim);
	}

	.makers {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.makers > li {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: baseline;
		gap: var(--space-3);
		padding-block: var(--space-3);
		border-bottom: 1px solid var(--rule);
	}

	h2 {
		font-size: var(--step-lead);
		font-variation-settings: 'wdth' 90;
	}

	h2 a {
		text-decoration: none;
	}

	.their-languages {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: var(--step-small);
		color: var(--dim);
	}

	.their-languages a {
		color: var(--dim);
		text-decoration: none;
		border-bottom: 1px solid var(--rule);
	}

	.their-languages a:hover {
		color: var(--flare);
		border-bottom-color: currentColor;
	}

	.note {
		margin-top: var(--space-4);
		color: var(--dim);
		font-size: var(--step-small);
	}
</style>
