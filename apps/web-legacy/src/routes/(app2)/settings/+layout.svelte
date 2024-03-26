<script>
	import { ArrowLeftCircle } from 'lucide-svelte';

	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';

	$: backHref =
		$page.url.pathname !== '/settings' ? '/settings' : '/library/backlog';

	$: root = $page.url.pathname === '/settings';
</script>

<div class="container px-4">
	<div class="flex justify-center">
		<Button variant="secondary" size="sm" href={backHref}>
			<ArrowLeftCircle class="mr-2 h-4 w-4" />
			Back to {root ? 'library' : 'settings'}
		</Button>
	</div>
	<div class="mx-auto max-w-prose space-y-4">
		<div class="flex flex-col gap-1">
			{#if $page.url.pathname === '/settings'}
				<h1 class="text-3xl font-bold tracking-tight md:text-4xl">Settings</h1>
			{:else}
				<h1 class="text-3xl font-bold tracking-tight md:text-4xl">
					{$page.data.title}
				</h1>
			{/if}
			{#if $page.data.description}
				<p class="text-lg text-muted-foreground">
					{$page.data.description}
				</p>
			{/if}
		</div>
		<slot />
	</div>
</div>
