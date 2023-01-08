<script lang="ts">
	import { page } from '$app/stores';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import Button from '$lib/components/Button.svelte';
	import FeedModal from '$lib/components/FeedModal.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import List from '$lib/components/layout/List.svelte';
	import ListItem from '$lib/components/layout/ListItem.svelte';
	import { modals } from '$lib/stores/modals';
	import { getHostname } from '$lib/utils';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

{#if data.subscriptions?.length}
	<!-- TODO: virtual list -->
	{#each data.subscriptions as item}
		<a href="/u:{$page.data.user?.username}/subscriptions/{item.feedId}">
			<ListItem>
				<div>
					<img
						class="h-6 w-6 rounded"
						src={item.feed.imageUrl ||
							`https://icon.horse/icon/${item.feed.link || new URL(item.feed.feedUrl).hostname}`}
						alt=""
					/>
				</div>
				<div class="flex"><SmallPlus>{item.title}</SmallPlus></div>
			</ListItem>
		</a>
	{/each}
{:else}
	<section class="px-2">
		<div class="mx-auto flex max-w-prose flex-col items-center gap-4 pb-20 pt-32 text-center">
			<h2 class="text-2xl font-medium">You don't have any subscriptions yet!</h2>
			<!-- TODO: add explainer: (Newlsetter, RSS, Twitter, etc.) -->
			<div>
				<Button
					on:click={(e) => {
						e.preventDefault();
						modals.open(FeedModal, {}, 'feed-entry');
					}}
					as="a"
					href="/u:{$page.data.user?.username}/subscriptions/new"
					className=" text-white p-5"
					variant="gradient"
					scaleOnHover={true}
					squishy={true}
					size="lg"
				>
					<Icon name="plusSmSolid" className="h-6 w-6 fill-current" />
					<span class="text-lg ">Add a subscription</span></Button
				>
			</div>
			<a href="/features/subscriptions" class="text-sm font-medium italic" target="_blank"
				>What are subscriptions?</a
			>
		</div>
	</section>
{/if}
