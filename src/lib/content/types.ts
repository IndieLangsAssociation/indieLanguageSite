import type { HIGHLIGHTS, LanguageFrontmatter } from './schema';

export type Highlight = (typeof HIGHLIGHTS)[number];

/** What `import.meta.glob(..., { query: { enhanced: true } })` hands back. */
export type Picture = {
	img: { src: string; w: number; h: number };
	sources: Record<string, string>;
};

export type Logo = { kind: 'raster'; picture: Picture } | { kind: 'svg'; src: string } | null;

export type Language = LanguageFrontmatter & {
	/** The folder name. Not a field anyone can typo. */
	slug: string;
	href: string;
	/** Rendered Markdown body, or '' when the file is frontmatter-only. */
	body: string;
	sampleHtml: string | null;
	/** One line of syntax for the board row. */
	sampleLine: string | null;
	logo: Logo;
};
