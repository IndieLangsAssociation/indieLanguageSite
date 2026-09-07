<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import Plate from '$lib/components/Plate.svelte';
	import Repl from '$lib/components/Repl.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const language = $derived(data.language);

	const links = $derived(
		[
			{ label: 'Website', href: language.links?.website },
			{ label: 'Repository', href: language.links?.github },
			{ label: 'Discord', href: language.links?.discord }
		].filter((link): link is { label: string; href: string } => Boolean(link.href))
	);

	const byHref = $derived(
		language.by?.url ?? (language.by?.github ? `https://github.com/${language.by.github}` : null)
	);
</script>

<Meta title={language.name} description={language.tagline} />

<div class="page">
	<article>
		<header>
			<Plate {language} large />
			<div>
				<h1>{language.name}</h1>
				<p class="tagline">{language.tagline}</p>
				{#if language.by}
					<p class="by">
						by {#if byHref}<a href={byHref} target="_blank" rel="noopener noreferrer"
								>{language.by.name}</a
							>{:else}{language.by.name}{/if}
					</p>
				{/if}
			</div>
		</header>

		{#if language.tags?.length}
			<ul class="tags">
				{#each language.tags as tag (tag)}
					<li>{tag}</li>
				{/each}
			</ul>
		{/if}

		<p class="description">{language.description}</p>

		{#if links.length}
			<nav class="links" aria-label="{language.name} links">
				{#each links as link (link.label)}
					<a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
				{/each}
			</nav>
		{/if}

		{#if language.sampleHtml}
			<pre class="code-block sample"><code>{@html language.sampleHtml}</code></pre>
		{/if}

		{#if language.body}
			<div class="prose body">{@html language.body}</div>
		{/if}

		{#if language.repl}
			<Repl
				endpoint={language.repl.endpoint}
				filename={language.repl.filename}
				starter={language.repl.starter ?? language.sample ?? ''}
				highlight={language.highlight}
				name={language.name}
			/>
		{/if}
	</article>

	<nav class="pager" aria-label="Other languages">
		{#if data.previous}
			<a href={data.previous.href} rel="prev">
				<span>Previous</span>
				{data.previous.name}
			</a>
		{:else}
			<span></span>
		{/if}
		{#if data.next}
			<a href={data.next.href} rel="next" class="next">
				<span>Next</span>
				{data.next.name}
			</a>
		{/if}
	</nav>
</div>

<style>
	article {
		padding-block: var(--space-5) var(--space-4);
	}

	header {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
	}

	h1 {
		font-size: var(--step-display);
		font-variation-settings: 'wdth' 75, 'opsz' 48;
		letter-spacing: -0.035em;
	}

	.tagline {
		margin: var(--space-2) 0 0;
		font-size: var(--step-lead);
		color: var(--dim);
	}

	.by {
		margin: var(--space-1) 0 0;
		font-size: var(--step-small);
		color: var(--dim);
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
		margin: var(--space-4) 0 0;
		padding: 0;
		list-style: none;
	}

	.tags li {
		padding: var(--space-1) var(--space-2);
		border: 1px solid var(--rule);
		border-radius: 100px;
		color: var(--dim);
		font-size: var(--step-small);
	}

	.description {
		margin-top: var(--space-3);
		font-size: var(--step-lead);
		max-width: var(--measure);
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-top: var(--space-4);
	}

	.links a {
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--rule);
		border-radius: var(--radius);
		text-decoration: none;
		font-size: var(--step-small);
		font-weight: 600;
	}

	.links a:hover {
		border-color: var(--flare);
		color: var(--flare);
	}

	.sample {
		margin-top: var(--space-4);
		max-width: var(--measure);
	}

	.body {
		margin-top: var(--space-4);
	}

	.pager {
		display: flex;
		justify-content: space-between;
		gap: var(--space-3);
		padding-top: var(--space-4);
		border-top: 1px solid var(--rule);
	}

	.pager a {
		text-decoration: none;
		font-weight: 600;
	}

	.pager .next {
		text-align: right;
	}

	.pager span {
		display: block;
		color: var(--dim);
		font-weight: 400;
		font-size: var(--step-small);
	}

	@media (max-width: 34rem) {
		header {
			flex-direction: column;
		}
	}
</style>
