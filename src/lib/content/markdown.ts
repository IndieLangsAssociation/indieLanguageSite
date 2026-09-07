import { Marked, type Tokens } from 'marked';
import { escapeHtml, highlight } from '$lib/highlight';
import { HIGHLIGHTS } from './schema';
import type { Highlight } from './types';

/** Anything else — javascript:, data: — becomes an inert anchor. */
function safeHref(href: string): string | null {
	const value = href.trim();
	if (/^(https?:\/\/|mailto:|#|\/)/i.test(value)) return value;
	return null;
}

/**
 * Language files come in through pull requests from people we don't know, so the
 * body is treated as untrusted input: raw HTML is neutralised rather than passed
 * through, and link protocols are allow-listed.
 */
const md = new Marked({ gfm: true, breaks: false });

md.use({
	renderer: {
		// Show the markup as text instead of letting a PR inject nodes.
		html(token: Tokens.HTML | Tokens.Tag) {
			return escapeHtml(token.raw);
		},

		link(token: Tokens.Link) {
			const href = safeHref(token.href);
			const text = this.parser.parseInline(token.tokens);
			if (!href) return text;
			const external = /^https?:\/\//i.test(href);
			const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
			return `<a href="${escapeHtml(href)}"${attrs}>${text}</a>`;
		},

		image(token: Tokens.Image) {
			const href = safeHref(token.href);
			if (!href) return escapeHtml(token.text);
			return `<img src="${escapeHtml(href)}" alt="${escapeHtml(token.text)}" loading="lazy" />`;
		},

		// Slugged ids so in-page links like [the form](#no-git-no-problem) resolve.
		heading(token: Tokens.Heading) {
			const text = this.parser.parseInline(token.tokens);
			const id = token.text
				.toLowerCase()
				.replace(/[^\w\s-]/g, '')
				.trim()
				.replace(/\s+/g, '-');
			return `<h${token.depth} id="${escapeHtml(id)}">${text}</h${token.depth}>\n`;
		},

		code(token: Tokens.Code) {
			const lang = (token.lang ?? '').trim().split(/\s+/)[0];
			const known = (HIGHLIGHTS as readonly string[]).includes(lang)
				? (lang as Highlight)
				: undefined;
			return `<pre class="code-block"><code>${highlight(token.text, known)}</code></pre>`;
		}
	}
});

export function renderMarkdown(source: string): string {
	const trimmed = source.trim();
	return trimmed ? (md.parse(trimmed, { async: false }) as string) : '';
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n([\s\S]*))?$/;

export function splitFrontmatter(raw: string): { frontmatter: string; body: string } {
	const match = FRONTMATTER.exec(raw.replace(/^﻿/, ''));
	if (!match) {
		throw new Error(
			'no frontmatter found — the file must start with a line containing only `---`, ' +
				'then the fields, then another line containing only `---`'
		);
	}
	return { frontmatter: match[1], body: match[2] ?? '' };
}
