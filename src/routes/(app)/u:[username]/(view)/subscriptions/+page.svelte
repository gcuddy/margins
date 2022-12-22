<script lang="ts">
	import { page } from '$app/stores';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import List from '$lib/components/layout/List.svelte';
	import ListItem from '$lib/components/layout/ListItem.svelte';
	import { getHostname } from '$lib/utils';
	import type { PageData } from './$types';
	export let data: PageData;
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
	<ListItem>
		<div>
			<img
				class="h-6 h-6 rounded"
				src={item.feed.imageUrl ||
					`https://icon.horse/icon/${item.feed.link || new URL(item.feed.feedUrl).hostname}`}
				alt=""
			/>
		</div>
		<div class="flex"><SmallPlus>{item.title}</SmallPlus></div>
	</ListItem>
</List>

<!-- //todo: get basics of slot prop working, get components working, write documentation -->
