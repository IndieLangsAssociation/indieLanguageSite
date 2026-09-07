<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import { addLanguageIssue, site } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Meta
	title="Add your language"
	description="How to add your programming language to indielangs.org — one folder, one file, one pull request."
/>

<div class="page">
	<div class="lede">
		<h1>Add your language</h1>
		<p>
			One folder, two files, one pull request. Or fill in a form and let someone else do the git
			part.
		</p>
		<div class="actions">
			<a class="primary" href={site.repo} target="_blank" rel="noopener noreferrer">
				Open the repository
			</a>
			<a href={addLanguageIssue} target="_blank" rel="noopener noreferrer">Use the form instead</a>
		</div>
	</div>

	<div class="prose guide">{@html data.guide}</div>
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
	}

	.lede p {
		margin: var(--space-3) 0 0;
		font-size: var(--step-lead);
		color: var(--dim);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-top: var(--space-4);
	}

	.actions a {
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--rule);
		border-radius: var(--radius);
		text-decoration: none;
		font-size: var(--step-small);
		font-weight: 600;
	}

	.actions a:hover {
		border-color: var(--flare);
		color: var(--flare);
	}

	.actions .primary {
		background: var(--flare);
		border-color: var(--flare);
		color: var(--paper);
	}

	.actions .primary:hover {
		filter: brightness(1.1);
		color: var(--paper);
	}

	.guide {
		padding-block: var(--space-4) 0;
	}

	.guide :global(h2) {
		font-size: var(--step-title);
		font-variation-settings: 'wdth' 85, 'opsz' 32;
		margin-top: var(--space-5);
		padding-top: var(--space-3);
		border-top: 1px solid var(--rule);
	}
</style>
