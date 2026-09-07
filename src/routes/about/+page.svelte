<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import { languages, makers } from '$lib/content/languages';
	import { addLanguageIssue, site } from '$lib/site';

	const withRepl = languages.filter((language) => language.repl).length;
</script>

<Meta
	title="About"
	description="The Indie Language Association is a group of people who build programming languages for the fun of it. This is where they're listed."
/>

<div class="page">
	<div class="lede">
		<h1>Nobody needed another programming language.</h1>
		<p>They got made anyway. This is where they live.</p>
	</div>

	<div class="columns">
		<div class="prose">
			<p>
				The Indie Language Association is a loose group of people who build programming languages
				because they want to, not because anyone asked. Some are serious attempts at a better way
				to write code. Some are jokes that got out of hand. A few are both.
			</p>
			<p>
				This site is the directory. Every language here was added by the person who made it, and
				every page you see is a file in a public repository that they control. If a language's
				description sounds like its author wrote it, that's because they did.
			</p>
			<p>
				There's no bar to clear. If you built a language and it exists, it belongs on this list —
				finished or not, useful or not.
			</p>

			<h2>Join in</h2>
			<p>
				The Discord is where most of the conversation happens: people showing off parsers, asking
				how to handle operator precedence, and complaining about their own syntax decisions.
			</p>
			<div class="actions">
				<a class="primary" href={site.discord} target="_blank" rel="noopener noreferrer">
					Join the Discord
				</a>
				<a href="/submit">Add your language</a>
				<a href={addLanguageIssue} target="_blank" rel="noopener noreferrer">Suggest one</a>
			</div>
		</div>

		<dl class="facts">
			<div>
				<dt>Languages listed</dt>
				<dd>{languages.length}</dd>
			</div>
			<div>
				<dt>People behind them</dt>
				<dd>{makers().length}</dd>
			</div>
			<div>
				<dt>You can run in the browser</dt>
				<dd>{withRepl}</dd>
			</div>
			<div>
				<dt>Listing since</dt>
				<dd>2025</dd>
			</div>
		</dl>
	</div>
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
		max-width: 16ch;
	}

	.lede p {
		margin: var(--space-3) 0 0;
		font-size: var(--step-lead);
		color: var(--dim);
	}

	.columns {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 16rem);
		gap: var(--space-5);
		padding-block: var(--space-4);
		align-items: start;
	}

	h2 {
		font-size: var(--step-title);
		font-variation-settings: 'wdth' 85, 'opsz' 32;
		margin-top: var(--space-5);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
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

	.facts {
		margin: 0;
		border-top: 1px solid var(--rule);
	}

	.facts div {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-2);
		padding-block: var(--space-2);
		border-bottom: 1px solid var(--rule);
	}

	dt {
		color: var(--dim);
		font-size: var(--step-small);
	}

	dd {
		margin: 0;
		font-size: var(--step-lead);
		font-weight: 700;
		font-variation-settings: 'wdth' 85;
	}

	@media (max-width: 48rem) {
		.columns {
			grid-template-columns: 1fr;
			gap: var(--space-4);
		}
	}
</style>
