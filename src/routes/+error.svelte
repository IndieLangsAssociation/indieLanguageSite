<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} — indie langs</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="page">
	<div class="wrap">
		<h1>{page.status}</h1>
		<p>
			{page.status === 404
				? (page.error?.message ?? "That page isn't here.")
				: 'Something went wrong loading this page.'}
		</p>
		<p class="actions">
			<a href="/">Browse the languages</a>
			<a href="/submit">Add one</a>
		</p>
	</div>
</div>

<style>
	.wrap {
		padding-block: var(--space-6);
		max-width: var(--measure);
	}

	h1 {
		font-size: var(--step-display);
		font-variation-settings: 'wdth' 75, 'opsz' 48;
		color: var(--flare);
	}

	p {
		margin-top: var(--space-3);
		font-size: var(--step-lead);
		color: var(--dim);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		font-size: var(--step-body);
	}

	.actions a {
		color: var(--type);
		font-weight: 600;
		text-decoration: none;
		border-bottom: 2px solid var(--flare);
	}
</style>
