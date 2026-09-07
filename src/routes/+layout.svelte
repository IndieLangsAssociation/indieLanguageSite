<script lang="ts">
	import '$lib/styles/app.css';
	import { page } from '$app/state';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { site } from '$lib/site';

	let { children } = $props();

	const nav = [
		{ href: '/', label: 'browse' },
		{ href: '/makers', label: 'makers' },
		{ href: '/about', label: 'about' },
		{ href: '/submit', label: 'add yours' }
	];

	const current = $derived(page.url.pathname);
</script>

<a class="skip-link" href="#main">Skip to content</a>

<header>
	<div class="page bar">
		<a class="wordmark" href="/">{site.name}</a>

		<nav aria-label="Main">
			<ul>
				{#each nav as item (item.href)}
					<li>
						<a
							href={item.href}
							aria-current={item.href === '/'
								? current === '/'
									? 'page'
									: undefined
								: current.startsWith(item.href)
									? 'page'
									: undefined}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<ThemeToggle />
	</div>
</header>

<main id="main">
	{@render children?.()}
</main>

<footer>
	<div class="page">
		<p>
			Made by the people whose languages are on this page.
			<a href={site.repo} target="_blank" rel="noopener noreferrer">Source</a> ·
			<a href={site.discord} target="_blank" rel="noopener noreferrer">Discord</a>
		</p>
	</div>
</footer>

<style>
	header {
		border-bottom: 1px solid var(--rule);
	}

	.bar {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding-block: var(--space-2);
	}

	.wordmark {
		font-weight: 800;
		font-size: var(--step-lead);
		font-variation-settings: 'wdth' 75, 'opsz' 24;
		letter-spacing: -0.03em;
		text-decoration: none;
		margin-right: auto;
	}

	nav ul {
		display: flex;
		gap: var(--space-3);
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: var(--step-small);
	}

	nav a {
		color: var(--dim);
		text-decoration: none;
		padding-block: var(--space-1);
		border-bottom: 2px solid transparent;
	}

	nav a:hover {
		color: var(--type);
	}

	nav a[aria-current='page'] {
		color: var(--type);
		border-bottom-color: var(--flare);
	}

	footer {
		margin-top: var(--space-6);
		padding-block: var(--space-4);
		border-top: 1px solid var(--rule);
		color: var(--dim);
		font-size: var(--step-small);
	}

	@media (max-width: 34rem) {
		.bar {
			flex-wrap: wrap;
		}

		.wordmark {
			margin-right: 0;
			flex: 1;
		}

		nav {
			order: 3;
			width: 100%;
			border-top: 1px solid var(--rule);
			padding-top: var(--space-2);
		}
	}
</style>
