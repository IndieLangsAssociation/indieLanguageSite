import yaml from 'js-yaml';
import { TAGS, languageSchema, type LanguageFrontmatter } from './schema.ts';

/**
 * Kept free of `$lib` aliases and Vite-only APIs on purpose: the CI validator
 * (scripts/validate.ts) runs this in plain Node, and the site runs it through
 * Vite. One parser, so a file that passes CI cannot fail the build.
 */

export type ParseResult =
	| { ok: true; data: LanguageFrontmatter; body: string }
	| { ok: false; errors: string[] };

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n([\s\S]*))?$/;

function distance(a: string, b: string): number {
	const rows = Array.from({ length: b.length + 1 }, (_, i) => i);
	for (let i = 1; i <= a.length; i++) {
		let prev = rows[0]++;
		for (let j = 1; j <= b.length; j++) {
			const next = Math.min(rows[j] + 1, rows[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
			prev = rows[j];
			rows[j] = next;
		}
	}
	return rows[b.length];
}

/** "esolangs" -> "did you mean esolang?" */
export function suggest(value: string, options: readonly string[]): string | null {
	const needle = value.toLowerCase().replace(/[\s_]+/g, '-');
	let best: string | null = null;
	let bestScore = Infinity;
	for (const option of options) {
		const score = distance(needle, option);
		if (score < bestScore) {
			bestScore = score;
			best = option;
		}
	}
	return best && bestScore <= Math.max(2, Math.floor(best.length / 3)) ? best : null;
}

export function parseLanguage(raw: string): ParseResult {
	const match = FRONTMATTER.exec(raw.replace(/^﻿/, ''));
	if (!match) {
		return {
			ok: false,
			errors: [
				'no frontmatter found — the file must open with a line containing only `---`, ' +
					'then the fields, then another line containing only `---`'
			]
		};
	}

	let loaded: unknown;
	try {
		loaded = yaml.load(match[1]);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return { ok: false, errors: [`the frontmatter isn't valid YAML — ${message}`] };
	}

	if (loaded === null || typeof loaded !== 'object' || Array.isArray(loaded)) {
		return { ok: false, errors: ['the frontmatter is empty — it needs at least name, tagline and description'] };
	}

	const result = languageSchema.safeParse(loaded);
	if (!result.success) {
		return { ok: false, errors: result.error.issues.map(describeIssue) };
	}

	return { ok: true, data: result.data, body: match[2] ?? '' };
}

function describeIssue(issue: { path: (string | number)[]; message: string; code: string; received?: unknown }): string {
	const field = issue.path.join('.') || '(top level)';

	if (issue.code === 'unrecognized_keys') {
		const keys = (issue as unknown as { keys: string[] }).keys;
		const known = Object.keys(languageSchema.shape);
		const hints = keys.map((key) => {
			const near = suggest(key, known);
			return near ? `${key} (did you mean ${near}?)` : key;
		});
		return `unknown field${keys.length > 1 ? 's' : ''}: ${hints.join(', ')}`;
	}

	if (issue.code === 'invalid_enum_value' && field.startsWith('tags')) {
		const received = String((issue as { received?: unknown }).received ?? '');
		const near = suggest(received, TAGS);
		return near
			? `tags: "${received}" isn't a known tag — did you mean "${near}"?`
			: `tags: "${received}" isn't a known tag. Valid tags: ${TAGS.join(', ')}`;
	}

	return `${field}: ${issue.message}`;
}
