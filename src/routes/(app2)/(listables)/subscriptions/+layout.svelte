<script lang="ts">
	import { page } from '$app/stores';
	import Header from '$components/ui/Header.svelte';
	import { Button } from '$components/ui/button';
	import { tabList } from '$lib/components/ui/tabs/TabsList.svelte';
	import { tabTrigger } from '$lib/components/ui/tabs/TabsTrigger.svelte';
	import Tabs from '$lib/components/ui/tabs2/Tabs.svelte';
	import { H1 } from '$lib/components/ui/typography';
	import { showAddSubscriptionModal } from '$lib/stores/subscriptions';
	import { cn } from '$lib/utils/tailwind';
	import { PlusIcon } from 'lucide-svelte';

	const tabs = ['Subscriptions', 'Latest', 'Podcasts'];

	$: tab_param = $page.url.searchParams.get('tab') ?? tabs[0].toLowerCase();
</script>


<Header title="Subscriptions">
    <!-- <span slot="start">Subscriptions</span> -->

    <svelte:fragment slot="end">
        <Button on:click={() => {
            showAddSubscriptionModal.set(true);
        }} variant="outline" size="sm">
            <PlusIcon class="w-4 h-4 mr-1" />
            Add subscription
        </Button>
    </svelte:fragment>
</Header>

<!-- <div class="mt-4">
	<Tabs
		tabs={[
			{ name: 'Subscriptions', href: '/subscriptions' },
			{ name: 'Latest', href: '/subscriptions/latest' },
			{ name: 'Podcasts', href: '/subscriptions/podcasts' }
		]}
	/>
</div> -->

<slot />
