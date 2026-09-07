<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/site';

	let {
		title,
		description = site.description,
		/** Appends " — indie langs" unless this is the home page. */
		bare = false
	}: { title?: string; description?: string; bare?: boolean } = $props();

	const fullTitle = $derived(!title ? site.title : bare ? title : `${title} — ${site.name}`);
	const canonical = $derived(new URL(page.url.pathname, site.url).href);
	const image = $derived(`${site.url}/meta/og.png`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={image} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
</svelte:head>
