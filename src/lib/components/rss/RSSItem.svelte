<script lang="ts">
	import { disableGlobalKeyboardShortcuts } from '$lib/stores/keyboard';
	import { notifications } from '$lib/stores/notifications';
	import type { RssItemWithFeed } from '$lib/types/rss';
	import type { Load } from '@sveltejs/kit';
	import dayjs from 'dayjs';
	import H1 from '../atoms/H1.svelte';
	import Muted from '../atoms/Muted.svelte';
	import Button from '../Button.svelte';
	import Form from '../Form.svelte';
	import Icon from '../helpers/Icon.svelte';
	import ProseWrapper from '../ProseWrapper.svelte';

	export let item: RssItemWithFeed;
	$: console.log({ item });

	let container: HTMLElement;
	export let scrollIntoView = true;
	export let linkBack = false;
	$: item.link, container && scrollIntoView && container?.scrollIntoView();

	// function markAsRead() {
	// 	item.is_read = true;
	// 	fetch(`/api/mark_item_as_read`, {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify({
	// 			id: item.id
	// 		})
	// 	});
	// }
	// $: item.link, !item.is_read && markAsRead();

	let pending_add_item = false;
	let item_in_library = false;
</script>

<svelte:window
	on:keydown={(event) => {
		if ($disableGlobalKeyboardShortcuts) return;
		if (event.key === ' ') {
			console.log('space');
			container.focus();
		}
	}}
/>

<!-- todo: create component that onmount marks item as read -->
<article
	bind:this={container}
	class="m-3 flex flex-grow flex-col overflow-hidden rounded-2xl bg-gray-50 shadow-xl  ring-1 ring-black/5 dark:bg-gray-900 dark:shadow-2xl dark:ring-white/5"
>
	<!-- TODO: could this somehow hide on scroll? -->
	<div class="flex flex-row items-center justify-between border-b border-gray-200 p-3 text-sm">
		<slot name="header">
			{#if linkBack}
				<a
					sveltekit:prefetch
					class="flex items-center space-x-2 text-gray-500"
					href="/rss/{item.RssFeed.id}"><Icon name="chevronLeftSolid" />{item?.RssFeed.title}</a
				>
			{:else}
				<div class="text-gray-500">{item.RssFeed.title}</div>
			{/if}
			<div class="flex items-center justify-center">
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
							type: 'error'
						});
					}}
					done={async ({ response }) => {
						const json = await response.json();
						console.log({ json });
						pending_add_item = false;
						notifications.notify({
							message: `Saved to your library`
						});
						item_in_library = true;
					}}
				>
					<input type="hidden" name="text" value={item.link} />
					<Button
						type="submit"
						variant="ghost"
						className="flex items-center space-x-1"
						disabled={item_in_library || pending_add_item}
					>
						<Icon
							name={pending_add_item
								? 'loading'
								: item_in_library
								? 'checkCircleSolid'
								: 'plusCircleSolid'}
							className="h-4 w-4 fill-primary-700 {pending_add_item ? 'animate-spin' : ''}"
						/>
						<span>Save{item_in_library ? 'd' : ''}</span></Button
					>
				</Form>
			</div>
		</slot>
	</div>
	<div class="overflow-auto p-4">
		<ProseWrapper breakpoints={true} font="sans" class="space-y-6">
			<header class="not-prose mx-auto max-w-prose font-sans">
				<a href={item.link} target="_blank"
					><H1 lg={false}>
						{item.title}
					</H1>
				</a>
				{#if item.pubDate || item.author}
					<p class="meta text-gray-500">
						<a href={item.link} class="flex space-x-3" target="_blank">
							{#if item.pubDate}
								<Muted>
									<time datetime={dayjs(item.pubDate).toISOString()}
										>{dayjs(item.pubDate).format('MMM D, YYYY')}</time
									></Muted
								>
							{/if}
							{#if item.author}
								<Muted><span>{item.author}</span></Muted>
							{/if}
						</a>
					</p>
				{/if}
			</header>
			<div>
				{@html item.content || item.contentSnippet || item.summary || '[No content]'}
			</div>
		</ProseWrapper>
	</div>
</article>
