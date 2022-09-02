<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	import Form from '$lib/components/Form.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';

	import Header from '$lib/components/layout/Header.svelte';
	import { notifications } from '$lib/stores/notifications';

	let pending_add_item = false;

	// todo: check against library
	let saved = false;

	import RssItem from './RSSItem.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { currentFeedList } from '../../+page.svelte';
	import { goto, invalidate, prefetch, prefetchRoutes } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import MarkAsReadButton from './MarkAsReadButton.svelte';
	export let data: PageData;
	$: ({ user, item } = data);
	// $user.feeds.find(f => f.id === Number($page.params.id))
	$: console.log({ data });
	$: if (!$currentFeedList) {
		// fetch feed and put it in there
	}
	let currentIndex = -1;
	$: {
		currentIndex = $currentFeedList?.items.findIndex(($item) => $item.id === item.id);
		if ($currentFeedList) {
			$currentFeedList.activeItem = item;
		}
	}
	$: nextItem = $currentFeedList?.items[currentIndex + 1]
		? $currentFeedList.items[currentIndex + 1]
		: null;
	$: previousItem = $currentFeedList?.items[currentIndex - 1]
		? $currentFeedList.items[currentIndex - 1]
		: null;
	$: previousRoute = `/rss/${previousItem?.rssFeedId}/${previousItem?.id}`;
	$: nextRoute = `/rss/${nextItem?.rssFeedId}/${nextItem?.id}`;
	$: console.log({ currentIndex, nextItem, previousItem, $currentFeedList });

	// TODO: look at prefetch vs prefetchRoutes https://kit.svelte.dev/docs/modules#$app-navigation-prefetch
	$: if (browser && previousItem && nextItem)
		Promise.all([prefetch(nextRoute), prefetch(previousRoute)]).then(() =>
			console.log('!!prefetched!!')
		);
	// $: prefetchRoutes([previousRoute, nextRoute]).then(() => console.log('prefetched'));

	let content: HTMLElement;
	onMount(() => {
		content.focus();
	});
</script>

<!-- listen for j and k to navigate forward and back -->
<svelte:window
	on:keydown={(e) => {
		if (e.key === 'j') {
			// wish these were instantaneous
			if (nextItem) {
				goto(nextRoute, {
					keepfocus: true,
					noscroll: false,
				});
			}
		} else if (e.key === 'k') {
			if (previousItem) {
				goto(previousRoute, {
					keepfocus: true,
					noscroll: false,
				});
			}
		} else if (e.key === 'Escape') {
			if ($currentFeedList.href) {
				goto($currentFeedList.href);
			}
		}
	}}
/>

<!-- We turn off prefetch for the links because we're going to automatically prefetch those items -->

<div
	class=" flex flex-col overflow-y-auto ring-gray-500/50 dark:ring-gray-700/50 lg:m-3 lg:rounded-md lg:shadow-2xl lg:ring-1"
>
	<!-- fix having to do this padding by instead using a different layout -->
	<div
		class="flex items-center justify-between border-b p-2 pl-12 dark:border-gray-700 dark:bg-gray-800 lg:pl-2"
	>
		<div class="flex items-center space-x-2">
			{#if $currentFeedList}
				<Button
					as="a"
					href={$currentFeedList.href}
					variant="link"
					className="flex items-center !px-1"
					tooltip={{
						text: `Back to ${$currentFeedList.title}`,
					}}
				>
					<Icon name="xSolid" className="h-4 w-4 fill-current" />
				</Button>
				<Button
					as={previousItem ? 'a' : 'button'}
					href={previousItem ? `/rss/${previousItem.rssFeedId}/${previousItem.id}` : undefined}
					variant="ghost"
					className="flex items-center !px-1"
					tooltip={{
						text: 'Previous item',
					}}
					disabled={!previousItem}
				>
					<Icon name="chevronUpSolid" />
				</Button>
				<!-- TODO: Why is this not working? -->
				<Button
					as={nextItem ? 'a' : 'button'}
					href={nextItem ? `/rss/${nextItem.rssFeedId}/${nextItem.id}` : undefined}
					variant="ghost"
					className="flex items-center !px-1"
					tooltip={{
						text: 'Next item',
					}}
					disabled={!nextItem}
				>
					<Icon name="chevronDownSolid" />
				</Button>
			{/if}
			<MarkAsReadButton bind:item />
		</div>
		<Form
			action="/add"
			method="post"
			classOverride=""
			pending={() => {
				pending_add_item = true;
			}}
			error={({ response }) => {
				pending_add_item = false;
				notifications.notify({
					message: 'Error saving',
					type: 'error',
				});
			}}
			done={async ({ response }) => {
				pending_add_item = false;
				saved = true;
				notifications.notify({
					message: `Saved to your library`,
				});
			}}
		>
			<input type="hidden" name="url" value={item.link} />
			<Button
				type="submit"
				variant="ghost"
				className="flex items-center space-x-1"
				tooltip={{
					text: 'Save to your library',
				}}
				disabled={saved}
			>
				<Icon
					name={pending_add_item ? 'loading' : saved ? 'checkCircleSolid' : 'plusCircleSolid'}
					className="h-4 w-4 fill-gray-300 {pending_add_item ? 'animate-spin' : ''}"
				/>
			</Button>
		</Form>
	</div>

	<div class="flex flex-col overflow-hidden">
		<!-- {#key item} -->
		<RssItem bind:el={content} bind:item scrollIntoView={false} linkBack={true} />
		<!-- {/key} -->
	</div>
</div>
