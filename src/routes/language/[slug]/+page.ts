import { error } from '@sveltejs/kit';
import { bySlug, languages } from '$lib/content/languages';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => languages.map(({ slug }) => ({ slug }));

export const load: PageLoad = ({ params }) => {
	const language = bySlug.get(params.slug);
	if (!language) error(404, `There's no language called "${params.slug}" here.`);

	const index = languages.indexOf(language);
	return {
		language,
		previous: languages[index - 1] ?? null,
		next: languages[index + 1] ?? null
	};
};
