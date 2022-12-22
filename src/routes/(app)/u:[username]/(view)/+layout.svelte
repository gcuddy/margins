<script lang="ts">
	import { page } from '$app/stores';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import Button from '$lib/components/Button.svelte';
	import ColResizer from '$lib/components/ColResizer.svelte';
	import FeedModal from '$lib/components/FeedModal.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import { mainEl } from '$lib/stores/main';
	import { modals } from '$lib/stores/modals';
	import type { LayoutData } from './$types';
	import FeedListItem from './subscriptions/FeedListItem.svelte';
	import FeedTitleMenu from './subscriptions/FeedTitleMenu.svelte';

	export let data: LayoutData;
	$: currentList = data.currentList;
	let width = 240;
</script>

{#if false && ($page.route.id?.endsWith(`subscriptions/[id=integer]`) || $page.route.id?.endsWith(`entry/[id=integer]`)) && $currentList}
	<div class="flex h-full place-content-stretch items-stretch overflow-hidden">
		{#if $currentList?.type === 'rss'}
			<div class="max-w-sm overflow-auto border-r">
				<Header>
					<DefaultHeader>
						<div slot="start">
							<FeedTitleMenu subscription={$currentList.subscription} />
						</div>
						<div class="flex gap-2" slot="end">
							<!-- <Button
								variant="ghost"
								as="a"
								href="/u:{$page.params.username}/subscriptions/new"
								on:click={(e) => {
									e.preventDefault();
									modals.open(FeedModal, {}, 'feed-entry');
								}}
							>
								<Icon name="plusSmall" className="h-5 w-5 fill-current" />
								<span>Add Subscription</span></Button
							> -->
							<button
								on:click={async () => {
									const res = await fetch('/api/refresh', {
										method: 'POST',
									});
									const json = await res.json();
									console.log({ json });
								}}>refresh</button
							>
						</div>
					</DefaultHeader>
				</Header>
				<ul class="overflow-auto">
					{#each $currentList?.items || [] as entry}
						<li>
							<FeedListItem item={entry} feed={$currentList.feed} />
						</li>
					{/each}
				</ul>
			</div>
			<!-- <div class="relative">
				<ColResizer
					class="hidden absolute -right-1 top-0 ml-1 h-screen w-3 cursor-col-resize px-1 lg:block"
					min={200}
					bind:width
				/>
			</div> -->
		{/if}
		<div class="grow overflow-y-auto" bind:this={$mainEl}>
			{#if $page.route.id?.endsWith(`entry/[id=integer]`)}
				<slot />
			{/if}
		</div>
		<!-- <slot /> -->
	</div>
{:else}
	<div class="grow overflow-y-auto" bind:this={$mainEl}>
		<slot />
	</div>
{/if}
