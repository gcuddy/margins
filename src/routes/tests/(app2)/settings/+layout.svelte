<script>
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/Button.svelte';
import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { H1 } from '$lib/components/ui/typography';
	import { ArrowLeftCircle } from 'lucide-svelte';

</script>

{#if $page.url.pathname !== '/tests/settings'}
<div class="flex justify-center">
<Button variant='secondary' size='sm' as="a" href="/tests/settings">
    <ArrowLeftCircle class="mr-2 h-4 w-4" />
    Back to settings
</Button>
</div>
{/if}
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
