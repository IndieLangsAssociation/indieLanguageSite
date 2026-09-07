import { renderMarkdown } from './markdown';
import { parseLanguage } from './parse';
import { firstMeaningfulLine, highlight } from '$lib/highlight';
import type { Language, Logo, Picture, Highlight } from './types';
import type { Tag } from './schema';

const sources = import.meta.glob('/src/content/languages/*/index.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

// Rasters go through @sveltejs/enhanced-img, which emits responsive AVIF/WebP.
// A contributor can commit an oversized PNG and the build still ships something small.
const rasters = import.meta.glob('/src/content/languages/*/logo.{png,jpg,jpeg,webp,avif}', {
	query: { enhanced: true },
	import: 'default',
	eager: true
}) as Record<string, Picture>;

// SVG can't be processed by sharp, so it's served as-is.
const vectors = import.meta.glob('/src/content/languages/*/logo.svg', {
	query: '?url',
	import: 'default',
	eager: true
}) as Record<string, string>;

const SLUG_OF = /\/languages\/([^/]+)\//;

function slugOf(path: string): string {
	const match = SLUG_OF.exec(path);
	if (!match) throw new Error(`unexpected content path: ${path}`);
	return match[1];
}

function byslug<T>(entries: Record<string, T>): Map<string, T> {
	return new Map(Object.entries(entries).map(([path, value]) => [slugOf(path), value]));
}

function logoFor(slug: string, raster: Map<string, Picture>, vector: Map<string, string>): Logo {
	const picture = raster.get(slug);
	if (picture) return { kind: 'raster', picture };
	const src = vector.get(slug);
	if (src) return { kind: 'svg', src };
	// No logo is a supported state — the plate falls back to the initial.
	return null;
}

function build(): Language[] {
	const rasterMap = byslug(rasters);
	const vectorMap = byslug(vectors);
	const out: Language[] = [];

	for (const [path, raw] of Object.entries(sources)) {
		const slug = slugOf(path);

		if (!/^[a-z\d](?:[a-z\d-]*[a-z\d])?$/.test(slug)) {
			throw new Error(
				`${path}\n  the folder name "${slug}" is used as the URL, so it must be lowercase ` +
					`letters, digits and hyphens only`
			);
		}

		const result = parseLanguage(raw);
		if (!result.ok) {
			throw new Error(`${path}\n  ${result.errors.join('\n  ')}`);
		}

		const { data, body } = result;
		const sample = data.sample?.replace(/\s+$/, '') ?? null;

		out.push({
			...data,
			slug,
			href: `/language/${slug}`,
			body: renderMarkdown(body),
			sampleHtml: sample ? highlight(sample, data.highlight) : null,
			sampleLine: sample ? highlight(firstMeaningfulLine(sample), data.highlight) : null,
			logo: logoFor(slug, rasterMap, vectorMap)
		});
	}

	return out.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
}

export const languages: Language[] = build();

export const bySlug = new Map(languages.map((language) => [language.slug, language]));

/** Only tags that are actually used, most-used first, for the board filters. */
export function usedTags(): { tag: Tag; count: number }[] {
	const counts = new Map<Tag, number>();
	for (const language of languages) {
		for (const tag of language.tags ?? []) counts.set(tag, (counts.get(tag) ?? 0) + 1);
	}
	return [...counts]
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export type Maker = {
	name: string;
	github?: string;
	url?: string;
	languages: Language[];
};

/** The people behind the languages, from the optional `by` field. */
export function makers(): Maker[] {
	const found = new Map<string, Maker>();

	for (const language of languages) {
		if (!language.by) continue;
		const key = (language.by.github ?? language.by.name).toLowerCase();
		const maker = found.get(key) ?? { ...language.by, languages: [] };
		maker.languages.push(language);
		found.set(key, maker);
	}

	return [...found.values()].sort(
		(a, b) => b.languages.length - a.languages.length || a.name.localeCompare(b.name)
	);
}

export type { Language, Highlight };
