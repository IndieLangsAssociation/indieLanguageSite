import { z } from 'zod';

/**
 * The tag vocabulary is fixed on purpose. Free-form tags fragment
 * ("esolang" / "Esolang" / "eso-lang") and the filters stop working.
 * To add a tag, add it here — validation and the JSON Schema follow.
 */
export const TAGS = [
	'esolang',
	'toy',
	'beginner-friendly',
	'scripting',
	'systems',
	'interpreted',
	'compiled',
	'transpiled',
	'jit',
	'stack-based',
	'concatenative',
	'functional',
	'object-oriented',
	'visual',
	'golfing',
	'self-hosting',
	'experimental'
] as const;

export type Tag = (typeof TAGS)[number];

/** Syntax highlighting for `sample` and the REPL editor. `plain` renders unstyled. */
export const HIGHLIGHTS = ['plain', 'x3', 'ruby', 'clike', 'python', 'wsharp'] as const;

const url = z
	.string()
	.trim()
	.url('must be a full URL starting with https://')
	.max(300);

export const languageSchema = z
	.object({
		/** Display name, e.g. "X3". Shown at the top of the board row. */
		name: z.string().trim().min(1).max(40),

		/** One line, shown under the name. Keep it short — it wraps badly past ~100 chars. */
		tagline: z.string().trim().min(1).max(120),

		/** A paragraph. Shown on the language page. */
		description: z.string().trim().min(20).max(700),

		tags: z.array(z.enum(TAGS)).max(5).optional(),

		/** Who made it. */
		by: z
			.object({
				name: z.string().trim().min(1).max(60),
				github: z
					.string()
					.trim()
					.regex(/^[A-Za-z\d](?:[A-Za-z\d]|-(?=[A-Za-z\d])){0,38}$/, 'GitHub username only, not a URL')
					.optional(),
				url: url.optional()
			})
			.strict()
			.optional(),

		links: z
			.object({
				website: url.optional(),
				github: url.optional(),
				discord: url.optional()
			})
			.strict()
			.optional(),

		/** A few lines of real code. One line of it appears on the board. */
		sample: z.string().max(2000).optional(),

		highlight: z.enum(HIGHLIGHTS).optional(),

		/** How the logo sits in its plate. Use `fill` for logos that are already square. */
		logoFit: z.enum(['contain', 'fill']).optional(),

		/** A "run it" panel on the language page. Needs a backend that accepts {code} and returns {output}. */
		repl: z
			.object({
				endpoint: url,
				filename: z
					.string()
					.trim()
					.regex(/^[\w.-]+$/, 'a filename, e.g. main.x3')
					.max(40),
				starter: z.string().max(2000).optional()
			})
			.strict()
			.optional()
	})
	.strict();

export type LanguageFrontmatter = z.infer<typeof languageSchema>;
