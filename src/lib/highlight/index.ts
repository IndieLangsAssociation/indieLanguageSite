import { StringStream, type StreamParser } from '@codemirror/language';
import { modeFor } from './modes';
import type { Highlight } from '$lib/content/types';

export function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/** Legacy modes emit things like "variableName.special" or "string number". */
function tokenClass(token: string): string {
	const first = token.split(/[ .]/)[0];
	return first.replace(/[^a-zA-Z\d-]/g, '');
}

/**
 * Runs a CodeMirror StreamParser over a string and emits spans.
 *
 * The point is parity: the sample block on a language page and the REPL editor
 * below it are highlighted by the same grammar, so they can't disagree.
 */
export function highlight(code: string, name: Highlight | undefined): string {
	const mode = modeFor(name);
	if (!mode) return escapeHtml(code);
	return highlightWith(code, mode);
}

export function highlightWith(code: string, mode: StreamParser<never>): string {
	const state = mode.startState ? mode.startState(2) : ({} as never);
	const out: string[] = [];

	for (const line of code.split('\n')) {
		if (line === '') {
			mode.blankLine?.(state, 2);
			out.push('');
			continue;
		}

		const stream = new StringStream(line, 2, 2);
		let html = '';

		while (!stream.eol()) {
			const token = mode.token(stream, state);
			// A mode that consumes nothing would spin forever; force progress.
			if (stream.pos === stream.start) stream.pos++;
			const text = line.slice(stream.start, stream.pos);
			const cls = token ? tokenClass(token) : '';
			html += cls ? `<span class="tok-${cls}">${escapeHtml(text)}</span>` : escapeHtml(text);
			stream.start = stream.pos;
		}

		out.push(html);
	}

	return out.join('\n');
}

/** The single most representative line of a sample, for the board row. */
export function firstMeaningfulLine(sample: string): string {
	for (const line of sample.split('\n')) {
		const trimmed = line.trim();
		if (trimmed && !/^(#|\/\/|--)/.test(trimmed)) return trimmed;
	}
	return sample.trim().split('\n')[0] ?? '';
}
