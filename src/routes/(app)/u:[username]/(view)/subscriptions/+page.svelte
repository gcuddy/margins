<script lang="ts">
	import { page } from '$app/stores';
	import List from '$lib/components/layout/List.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: console.log({ data });
</script>

Here is a list of your subscriptions:

<!-- <ul>
    {#each data.subscriptions as subscription}
        <li>
            <a href="/u:{$page.params.username}/subscriptions/{subscription.feed.id}"
                >{subscription.title}</a
            >
        </li>
    {/each}
</ul> -->
<List
	items={data.subscriptions}
	href={(item) => `/u:${$page.data.user?.username}/subscriptions/${item.feedId}`}
	let:item
>
	{item.title}
</List>

<!-- //todo: get basics of slot prop working, get components working, write documentation -->
