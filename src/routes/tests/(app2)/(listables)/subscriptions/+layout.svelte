<script lang="ts">
	import { page } from '$app/stores';
	import { tabList } from '$lib/components/ui/tabs/TabsList.svelte';
	import { tabTrigger } from '$lib/components/ui/tabs/TabsTrigger.svelte';
	import Tabs from '$lib/components/ui/tabs2/Tabs.svelte';
	import { H1 } from '$lib/components/ui/typography';
	import { cn } from '$lib/utils/tailwind';

	const tabs = ['Subscriptions', 'Latest', 'Podcasts'];

	$: tab_param = $page.url.searchParams.get('tab') ?? tabs[0].toLowerCase();
</script>

<H1>Subscriptions</H1>

<div class="mt-4">
	<Tabs
		tabs={[
			{ name: 'Subscriptions', href: '/tests/subscriptions' },
			{ name: 'Latest', href: '/tests/subscriptions/latest' },
			{ name: 'Podcasts', href: '/tests/subscriptions/podcasts' }
		]}
	/>
</div>

<slot />
