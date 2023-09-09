<script>
	import { ArrowLeftCircle } from 'lucide-svelte';

	import { page } from '$app/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { H1 } from '$lib/components/ui/typography';

	$: backHref =
		$page.url.pathname !== '/tests/settings'
			? '/tests/settings'
			: '/tests/library/backlog';

	$: root = $page.url.pathname === '/tests/settings';
</script>

<div class="container px-4">
	<div class="flex justify-center">
		<Button variant="secondary" size="sm" href={backHref}>
			<ArrowLeftCircle class="mr-2 h-4 w-4" />
			Back to {root ? 'library' : 'settings'}
		</Button>
	</div>
	<Card class="mt-4">
		<CardHeader>
			{#if $page.url.pathname === '/tests/settings'}
				<H1>Settings</H1>
			{:else}
				<H1>{$page.data.title}</H1>
			{/if}
		</CardHeader>
		<CardContent>
			<slot />
		</CardContent>
	</Card>
</div>
