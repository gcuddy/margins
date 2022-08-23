<!-- Based off Saved.SvelteElement -->
<script lang="ts">
	import type { Annotation, Article } from '@prisma/client';
	export let items: ListWithItems[];
	import SelectActions from './SelectActions.svelte';
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME, type DndEvent } from 'svelte-dnd-action';
	import { patch } from '../utils';
	import debounce from 'lodash.debounce';
	import { notifications } from '../stores/notifications';
	import { writable } from 'svelte/store';
	import dayjs from 'dayjs';
	import localizedFormat from 'dayjs/plugin/localizedFormat.js';
	import Spacer from './helpers/Spacer.svelte';
	import type { ArticleInList, ArticleWithTags, ListWithItems } from '$lib/types';
	import { dev } from '$lib/stores/developer';
	import KeyboardNav from './helpers/KeyboardNav/KeyboardNav.svelte';
	import KeyboardNavItem from './helpers/KeyboardNav/KeyboardNavItem.svelte';
	import { currentItems, filteredItems, filterInputActive, filterTerm } from '$lib/stores/filter';
	import { fade } from 'svelte/transition';
	import DotMenu from './DotMenu.svelte';
	import Muted from './atoms/Muted.svelte';
	import type { ComponentProperties } from '$lib/stores/types';
	import type { ViewOptions } from '$lib/types/schemas/View';
	import SavedPillWrapper from './SavedPillWrapper.svelte';
	import { flip } from 'svelte/animate';
	dayjs.extend(localizedFormat);
	let dragDisabled = false;

	function isAnnotation(item: ArticleInList | Annotation): item is Annotation {
		return item !== undefined;
	}

	const handleConsider = (e: CustomEvent<DndEvent>) => {
		//optimistic update
		console.log('considering', e.detail);
		items = e.detail.items;
	};
	const debouncedPatch = debounce(patch, 300);
	const saveArticleOrder = () =>
		debouncedPatch(
			'/',
			items.map((article, index) => ({
				id: article.id,
				position: index
			}))
		);
	// const startDrag = () => (dragDisabled = false);
	// const stopDrag = () => (dragDisabled = true);

	const handleFinalize = (e: CustomEvent<DndEvent>) => {
		//optimistic update
		items = e.detail.items;
		// dragDisabled = true;
		// now save to database
		// TODO: debounce
		saveArticleOrder();
	};
	let flipDurationMs = 200;
	$: $filterInputActive ? (flipDurationMs = 0) : (flipDurationMs = 200);
	let hovering = false;

	let selected_articles: typeof items = [];
	// $: selected_articles,
	// 	articles.forEach((article) => {
	// 		if (selected_articles.includes(article)) {
	// 			article = selected_articles.find((a) => a.id === article.id);
	// 		}
	// 	});
	$: console.log({ selected_articles });
	$: console.log({ articles: items });

	export let actions: ComponentProperties<SelectActions>['actions'] | undefined = undefined;

	const view_options: ViewOptions = {
		sort: 'manual',
		properties: {
			author: true,
			site: true,
			description: true,
			tags: true,
			annotationCount: true,
			date: false,
			wordCount: false
		}
	};

	export let viewOptions: ViewOptions = view_options;

	$: dragDisabled = viewOptions.sort != 'manual';
</script>

<!-- <svelte:window on:keydown={handleKeydown} /> -->

<!-- <SelectActions {actions} bind:selected_articles on:update /> -->

<KeyboardNav>
	<!-- filteR? -->
	<div
		class="mx-auto w-full space-y-0 overflow-auto"
		use:dndzone={{
			items: items,
			flipDurationMs,
			dragDisabled,
			dropTargetStyle: {},
			zoneTabIndex: -1
		}}
		on:consider={handleConsider}
		on:finalize={handleFinalize}
	>
		{#each items as item, index (item.id)}
			{@const annotation = isAnnotation(item)}

			<!-- {index} -->
			<!-- by doing this can't do animate:flip. hm! trying out auto-animate. let's see... -->
			<KeyboardNavItem
				let:active
				let:followTabIndex
				{index}
				as="a"
				href="/{item.id}"
				class="group !cursor-default"
				on:select={() => {
					if (selected_articles.includes(item)) {
						selected_articles = selected_articles.filter(({ id }) => id !== item.id);
					} else {
						selected_articles = [...selected_articles, item];
					}
				}}
			>
				<div in:fade class="h-20  md:h-24">
					<div
						class="dark: flex h-full flex-col justify-center border-b border-gray-100 px-6 ring-inset  focus:!outline-none focus-visible:!outline-none group-focus-visible:bg-gray-50 group-focus-visible:ring-1 dark:border-gray-700 dark:group-focus-visible:bg-gray-800  {selected_articles.some(
							(a) => a.id === item.id
						)
							? '!bg-gray-100 dark:!bg-blue-800/30'
							: 'dark:bg-gray-900 bg-transparent '}"
						on:mouseenter={() => (hovering = true)}
						on:mouseleave={() => (hovering = false)}
					>
						<div class="item relative flex flex-initial flex-row items-center gap-3 transition">
							{#if annotation}
								{item.body}
							{:else}
								<div
									class="flex-inital relative flex h-8 w-8 shrink-0 cursor-pointer flex-row items-center overflow-hidden rounded-md transition hover:ring"
									on:click|stopPropagation
								>
									{#if $dev.disableListImgs}
										<div
											class="group h-8 w-8 shrink-0 cursor-pointer rounded-md border border-black/30 bg-red-100 object-cover shadow-sm hover:ring-1"
										/>
									{:else}
										<img
											class="h-8 w-8 shrink-0 cursor-pointer rounded-md border border-black/30 object-cover shadow-sm hover:ring-1"
											src={item.image || `https://icon.horse/icon/?uri=${item.url}`}
											alt=""
										/>
									{/if}
									<input
										bind:group={selected_articles}
										value={item}
										type="checkbox"
										aria-hidden={true}
										tabindex={-1}
										class=" absolute inset-0 z-10 h-full w-full cursor-pointer rounded-md border-0 bg-transparent  ring-0"
									/>
								</div>

								<div class="relative flex shrink flex-col justify-center truncate  text-left">
									<span class="cursor-pointer text-base font-semibold leading-tight line-clamp-2">
										item.title
									</span>
									<!-- url and author around 74,74,74, description around 126,126,126 -->
									<div class="flex gap-4 text-xs text-stone-700 dark:text-gray-300 md:text-sm">
										{#if item.author && viewOptions.properties.author}
											<span>{item.author}</span>
										{/if}
										{#if viewOptions.properties.site}
											<Muted>{item.siteName || new URL(item.url).hostname}</Muted>
										{/if}
										{#if item.date && viewOptions.properties.date}
											<Muted>{dayjs(item.date).format('ll')}</Muted>
										{/if}
										{#if item.wordCount && viewOptions.properties.wordCount}
											<Muted>{item.wordCount} words</Muted>
										{/if}
										<!-- <span><a href={item.url}>{item.url}</a></span> -->
									</div>
									<div class="flex truncate">
										{#if viewOptions.properties.description}
											<p
												class="hidden truncate text-xs text-stone-500 dark:text-gray-400 md:block md:text-sm {quoted &&
													'before:content-[""] before:border-l-2 before:mr-4'}"
											>
												{#if html}{@html item.description}{:else}{item.description}{/if}
											</p>
										{/if}
									</div>
								</div>
								<!-- is this necessary? -->
								<Spacer />

								<SavedPillWrapper {item} {viewOptions} />

								<div class="flex shrink-0 basis-auto items-center gap-4">
									<!-- turning this off for now -->
									{#if true}
										<div class="flex items-center">
											<DotMenu
												actions={[followTabIndex]}
												icons="outline"
												items={[
													[
														{
															label: 'Archive',
															icon: 'archive'
														},
														{
															label: 'Delete',
															icon: 'trash',
															perform: async () => {
																if (!window.confirm(`Really delete "${item.title}"?`)) return;
																const form = new FormData();
																form.set('id', item.id.toString());
																const res = await fetch('/', {
																	method: 'DELETE',
																	body: form
																});
																console.log({ res });
																if (res.ok) {
																	notifications.notify({
																		message: 'Article deleted'
																	});
																	await invalidate('/');
																}
															}
														},
														{
															label: 'Tag',
															icon: 'tag'
														},
														{
															label: 'Bump to top',
															icon: 'trendingUp',
															perform: () => dispatch('bump')
														}
													],
													[
														{
															label: 'View Original',
															icon: 'globe',
															perform: () => {
																window.open(item.url, '_blank');
															}
														}
													]
												]}
											/>
											<!-- <Menu
									align="right"
									menuItems={[
										[
											{
												display: 'Archive',
												icon: 'archive'
											},
											{
												display: 'Delete',
												icon: 'trash',
												perform: async () => {
													if (!window.confirm(`Really delete "${item.title}"?`)) return;
													const form = new FormData();
													form.set('id', item.id.toString());
													const res = await fetch('/', {
														method: 'DELETE',
														body: form
													});
													console.log({ res });
													if (res.ok) {
														notifications.notify({
															message: 'Article deleted'
														});
														await invalidate('/');
													}
												}
											},
											{
												display: 'Tag',
												icon: 'tag'
											},
											{
												display: 'Bump to top',
												icon: 'trendingUp',
												perform: () => dispatch('bump')
											}
										],
										[
											{
												display: 'View Original',
												icon: 'globe',
												perform: () => {
													window.open(item.url, '_blank');
												}
											}
										]
									]}
									buttonAriaLabel="More options"
								>
									<Icon name="options" className="h-6 w-6 stroke-1 stroke-current" />
									<span class="sr-only">More</span>
								</Menu> -->
										</div>
										<!-- TODO: make entire thing draggable -->
										<!-- <div
								on:mousedown={startDrag}
								on:touchstart={startDrag}
								on:mouseup={stopDrag}
								on:touchend={stopDrag}
								class="drag-handle  flex items-center"
							>
								<Icon name="dragHandle2" className="w-4 h-4 stroke-current stroke-0" />
							</div> -->
									{:else}
										<div
											class="flex flex-col items-end text-xs tabular-nums text-gray-600 dark:text-gray-400 lg:text-sm"
										>
											<div>
												{dayjs(item.date).format('ll')}
											</div>
											<div>
												{item.wordCount} words
											</div>
											<div>
												{Math.round(item.readProgress * 100)}% read
											</div>
										</div>
									{/if}
								</div>
							{/if}
							<slot />
						</div>
					</div>
				</div>
			</KeyboardNavItem>
		{/each}
	</div>
</KeyboardNav>

<style>
	ul {
		padding: 0;
		width: 100%;
	}
	.custom-shadow-item {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: gray;
	}
	input[type='checkbox']:focus {
		box-shadow: none !important;
	}
</style>
