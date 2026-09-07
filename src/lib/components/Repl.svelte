<script lang="ts">
	import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
	import { EditorState } from '@codemirror/state';
	import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
	import {
		HighlightStyle,
		StreamLanguage,
		bracketMatching,
		indentUnit,
		syntaxHighlighting
	} from '@codemirror/language';
	import { tags } from '@lezer/highlight';
	import { modeFor } from '$lib/highlight/modes';
	import type { Highlight } from '$lib/content/types';

	let {
		endpoint,
		filename,
		starter = '',
		highlight,
		name
	}: {
		endpoint: string;
		filename: string;
		starter?: string;
		highlight?: Highlight;
		name: string;
	} = $props();

	type Status = 'idle' | 'running' | 'done' | 'error';

	let host = $state<HTMLDivElement>();
	let view: EditorView | null = null;
	let status = $state<Status>('idle');
	let output = $state('');
	let elapsed = $state(0);
	let warmed = false;

	const TIMEOUT_MS = 90_000;
	/* Past this, a free-tier backend is almost certainly cold-starting rather than busy. */
	const COLD_AFTER_MS = 4_000;

	const cold = $derived(status === 'running' && elapsed >= COLD_AFTER_MS);

	const editorTheme = EditorView.theme({
		'&': { backgroundColor: 'transparent', color: 'var(--type)' },
		'&.cm-focused': { outline: 'none' },
		'.cm-scroller': {
			fontFamily: 'var(--font-mono)',
			fontVariationSettings: "'wdth' 75",
			fontSize: 'var(--step-tiny)',
			lineHeight: '1.7'
		},
		'.cm-gutters': {
			backgroundColor: 'transparent',
			color: 'var(--dim)',
			border: 'none',
			opacity: '0.6'
		},
		'.cm-activeLine': { backgroundColor: 'color-mix(in oklab, var(--type) 4%, transparent)' },
		'.cm-activeLineGutter': { backgroundColor: 'transparent' },
		'.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--flare)', borderLeftWidth: '2px' },
		'.cm-selectionBackground, .cm-content ::selection': {
			backgroundColor: 'color-mix(in oklab, var(--signal) 30%, transparent)'
		},
		'&.cm-focused .cm-selectionBackground': {
			backgroundColor: 'color-mix(in oklab, var(--signal) 30%, transparent)'
		},
		'.cm-matchingBracket': { color: 'var(--flare)', backgroundColor: 'transparent' }
	});

	const syntax = syntaxHighlighting(
		HighlightStyle.define([
			{ tag: tags.keyword, color: 'var(--flare)' },
			{ tag: [tags.controlKeyword, tags.moduleKeyword], color: 'var(--flare)' },
			{ tag: [tags.string, tags.special(tags.string)], color: 'var(--signal)' },
			{ tag: [tags.number, tags.atom, tags.bool], color: 'var(--signal)' },
			{ tag: [tags.comment, tags.lineComment, tags.blockComment], color: 'var(--dim)', fontStyle: 'italic' },
			{ tag: [tags.operator, tags.punctuation, tags.bracket], color: 'var(--dim)' },
			{ tag: [tags.typeName, tags.definition(tags.variableName)], fontWeight: '600' }
		])
	);

	$effect(() => {
		if (!host) return;

		const mode = modeFor(highlight);
		view = new EditorView({
			parent: host,
			state: EditorState.create({
				doc: starter,
				extensions: [
					lineNumbers(),
					history(),
					bracketMatching(),
					highlightActiveLine(),
					indentUnit.of('    '),
					keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
					editorTheme,
					syntax,
					EditorView.lineWrapping,
					...(mode ? [StreamLanguage.define(mode)] : [])
				]
			})
		});

		return () => {
			view?.destroy();
			view = null;
		};
	});

	/*
	 * These backends sleep after inactivity and take the better part of a minute to
	 * wake. Poking the host when the panel scrolls into view means the wait usually
	 * happens while someone is still reading, not after they press Run.
	 */
	$effect(() => {
		if (!host || warmed) return;

		const observer = new IntersectionObserver((entries) => {
			if (!entries.some((entry) => entry.isIntersecting) || warmed) return;
			warmed = true;
			observer.disconnect();
			fetch(new URL(endpoint).origin, { mode: 'no-cors', cache: 'no-store' }).catch(() => {
				// Opaque by design; we only care that the request was made.
			});
		});

		observer.observe(host);
		return () => observer.disconnect();
	});

	async function run() {
		if (!view || status === 'running') return;

		status = 'running';
		output = '';
		elapsed = 0;

		const started = performance.now();
		const ticker = setInterval(() => (elapsed = performance.now() - started), 250);
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code: view.state.doc.toString(), sources: {} }),
				signal: controller.signal
			});

			if (!response.ok) {
				status = 'error';
				output = `The ${name} server answered with ${response.status} ${response.statusText}.`;
				return;
			}

			const data = await response.json();
			output = data.output || data.error || 'Ran, but printed nothing.';
			status = data.error && !data.output ? 'error' : 'done';
		} catch (error) {
			status = 'error';
			output =
				error instanceof DOMException && error.name === 'AbortError'
					? `Gave up after ${TIMEOUT_MS / 1000} seconds. The ${name} server may be down.`
					: `Couldn't reach the ${name} server. It's hosted by ${name}'s maintainer, not by this site.`;
		} finally {
			clearInterval(ticker);
			clearTimeout(timeout);
		}
	}
</script>

<section class="repl" aria-label="Run {name} code">
	<div class="bar">
		<span class="filename">{filename}</span>
		<button type="button" onclick={run} disabled={status === 'running'}>
			{status === 'running' ? 'Running' : 'Run'}
		</button>
	</div>

	<div class="split">
		<div class="editor" bind:this={host}></div>

		<div class="output">
			<div class="output-head">output</div>
			<div class="output-body" aria-live="polite">
				{#if status === 'running'}
					<p class="waiting">
						{#if cold}
							Waking the {name} server. The first run after a quiet period takes about a minute.
						{:else}
							Running.
						{/if}
						<span class="elapsed">{(elapsed / 1000).toFixed(0)}s</span>
					</p>
				{:else if status === 'idle'}
					<p class="hint">Press Run to send this to {name}'s server.</p>
				{:else}
					<pre class:failed={status === 'error'}>{output}</pre>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.repl {
		margin-top: var(--space-4);
		border: 1px solid var(--rule);
		border-radius: var(--radius);
		overflow: hidden;
		background: var(--surface);
	}

	.bar {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-3);
		border-bottom: 1px solid var(--rule);
	}

	.filename {
		font-family: var(--font-mono);
		font-size: var(--step-tiny);
		font-variation-settings: 'wdth' 75;
		color: var(--dim);
		margin-right: auto;
	}

	button {
		padding: var(--space-1) var(--space-3);
		border: 1px solid transparent;
		border-radius: 6px;
		background: var(--flare);
		color: var(--paper);
		font: inherit;
		font-size: var(--step-small);
		font-weight: 600;
		cursor: pointer;
	}

	button:hover:not(:disabled) {
		filter: brightness(1.1);
	}

	button:disabled {
		background: none;
		border-color: var(--rule);
		color: var(--dim);
		cursor: default;
	}

	.split {
		display: grid;
		grid-template-columns: 1fr minmax(14rem, 0.6fr);
		min-height: 15rem;
	}

	.editor {
		overflow: auto;
		border-right: 1px solid var(--rule);
	}

	.editor :global(.cm-editor) {
		height: 100%;
	}

	.output {
		display: flex;
		flex-direction: column;
		background: var(--surface-sunk);
		min-width: 0;
	}

	.output-head {
		padding: var(--space-1) var(--space-3);
		border-bottom: 1px solid var(--rule);
		color: var(--dim);
		font-size: var(--step-tiny);
	}

	.output-body {
		flex: 1;
		overflow: auto;
		padding: var(--space-2) var(--space-3);
	}

	pre {
		margin: 0;
		font-size: var(--step-tiny);
		line-height: 1.7;
		white-space: pre-wrap;
		word-break: break-word;
	}

	pre.failed {
		color: var(--flare);
	}

	.hint,
	.waiting {
		margin: 0;
		color: var(--dim);
		font-size: var(--step-small);
	}

	.elapsed {
		display: block;
		margin-top: var(--space-1);
		font-family: var(--font-mono);
		font-variation-settings: 'wdth' 75;
		font-size: var(--step-tiny);
	}

	@media (max-width: 44rem) {
		.split {
			grid-template-columns: 1fr;
		}

		.editor {
			border-right: none;
			border-bottom: 1px solid var(--rule);
			min-height: 12rem;
		}
	}
</style>
