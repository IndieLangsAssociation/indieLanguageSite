export const site = {
	name: 'indie langs',
	url: 'https://indielangs.org',
	title: 'indie langs — programming languages people made because they wanted to',
	description:
		'A directory of indie programming languages, each one built by hand by someone who wanted to build a language. Browse them, try a few, add your own.',
	discord: 'https://discord.gg/UvMZrQaMZ2',
	repo: 'https://github.com/IndieLangsAssociation/indieLanguageSite'
} as const;

export const addLanguageIssue = `${site.repo}/issues/new?template=add-language.yml`;
