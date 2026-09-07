import { languages } from '$lib/content/languages';
import { site } from '$lib/site';

export const prerender = true;

const paths = ['/', '/makers', '/about', '/submit'];

export function GET() {
	const urls = [...paths, ...languages.map((language) => language.href)]
		.map((path) => `\t<url><loc>${site.url}${path === '/' ? '' : path}</loc></url>`)
		.join('\n');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
		{ headers: { 'Content-Type': 'application/xml' } }
	);
}
