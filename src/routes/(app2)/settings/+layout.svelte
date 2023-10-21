<script>
	import { ArrowLeftCircle } from 'lucide-svelte';

	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { H1 } from '$lib/components/ui/typography';

	$: backHref =
		$page.url.pathname !== '/settings'
			? '/settings'
			: '/library/backlog';

	$: root = $page.url.pathname === '/settings';
</script>

<div class="container px-4">
	<div class="flex justify-center">
		<Button variant="secondary" size="sm" href={backHref}>
			<ArrowLeftCircle class="mr-2 h-4 w-4" />
			Back to {root ? 'library' : 'settings'}
		</Button>
	</div>
	<!-- <Card class="mt-4"> -->
		<!-- <CardHeader> -->
			<div class="max-w-prose mx-auto space-y-4">
                <div class="flex flex-col gap-1">
                    {#if $page.url.pathname === '/settings'}
                        <h1 class="text-3xl md:text-4xl tracking-tight font-bold">Settings</h1>
                    {:else}
                        <h1 class="text-3xl md:text-4xl tracking-tight font-bold">{$page.data.title}</h1>
                    {/if}
                    {#if $page.data.description}
                        <p class="text-muted-foreground text-lg">
                            {$page.data.description}
                        </p>
                    {/if}
                </div>
                        <!-- </CardHeader> -->
                        <!-- <CardContent> -->
                <slot />
            </div>
		<!-- </CardContent> -->
	<!-- </Card> -->
</div>
