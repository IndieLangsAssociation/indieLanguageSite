import guide from '../../../CONTRIBUTING.md?raw';
import { renderMarkdown } from '$lib/content/markdown';
import type { PageLoad } from './$types';

/*
 * The page renders CONTRIBUTING.md rather than restating it. The old site kept the
 * same instructions in a React component and a README, and the two disagreed about
 * which repository to clone.
 */
export const load: PageLoad = () => {
	// Drop the leading H1; the page supplies its own.
	const body = guide.replace(/^#\s.*\r?\n+/, '');
	return { guide: renderMarkdown(body) };
};
