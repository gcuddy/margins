<script context="module" lang="ts">
	export const selectedArticleIds = writable<Article['id'][]>([]);
	export const currentSavedView = writable();
</script>

<script lang="ts">
	import type { Article } from '@prisma/client';
	import { flip } from 'svelte/animate';
	export let articles: ArticleWithTags[];
	filterTerm.set('');
	$: articles, currentItems.setCurrentItems(articles, 'title');

	/** Should we render the title and description as safe html or not? */
	export let html = false;

	/** Should we render the description as a "quote"? */
	export let quoted = false;

	import SelectActions from './SelectActions.svelte';
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME, type DndEvent } from 'svelte-dnd-action';
	import { patch } from '../utils';
	import debounce from 'lodash.debounce';
	import { notifications } from '../stores/notifications';
	import { writable } from 'svelte/store';
	import dayjs from 'dayjs';
	import localizedFormat from 'dayjs/plugin/localizedFormat.js';
	import Spacer from './helpers/Spacer.svelte';
	import TagCloud from './TagCloud.svelte';
	import type { ArticleWithTags } from '$lib/types';
	import Menu from './Menu/Menu.svelte';
	import Icon from './helpers/Icon.svelte';
	import { dev } from '$lib/stores/developer';
	import KeyboardNav from './helpers/KeyboardNav/KeyboardNav.svelte';
	import KeyboardNavItem from './helpers/KeyboardNav/KeyboardNavItem.svelte';
	import { currentItems, filteredItems, filterInputActive, filterTerm } from '$lib/stores/filter';
	import AnnotationCount from './AnnotationCount.svelte';
	import { fade } from 'svelte/transition';
	dayjs.extend(localizedFormat);
	let focused = -1;
	let dragDisabled = true;

	const handleConsider = (e: CustomEvent<DndEvent>) => {
		//optimistic update
		console.log('considering', e.detail);
		articles = e.detail.items;
	};
	const debouncedPatch = debounce(patch, 300);
	const saveArticleOrder = () =>
		debouncedPatch(
			'/',
			articles.map((article, index) => ({
				id: article.id,
				position: index
			}))
		);
	const startDrag = () => (dragDisabled = false);
	const stopDrag = () => (dragDisabled = true);

	const handleFinalize = (e: CustomEvent<DndEvent>) => {
		//optimistic update
		articles = e.detail.items;
		dragDisabled = true;
		// now save to database
		// TODO: debounce
		saveArticleOrder();
	};
	let flipDurationMs = 200;
	$: $filterInputActive ? (flipDurationMs = 0) : (flipDurationMs = 200);
	let hovering = false;

	$: console.log({ $selectedArticleIds });
</script>

<!-- <svelte:window on:keydown={handleKeydown} /> -->

<SelectActions bind:articles />

<!-- filteR? -->
<ul
	class="mx-auto w-full space-y-0 overflow-auto"
	use:dndzone={{
		items: articles,
		dragDisabled,
		flipDurationMs,
		dropTargetStyle: {},
		zoneTabIndex: -1
	}}
	on:consider={handleConsider}
	on:finalize={handleFinalize}
>
	{#each $filteredItems as item, index (item.id)}
		<li in:fade class="h-20  md:h-24">
			<!-- <SavedItem
				{item}
				bind:dragDisabled
				on:bump={() => {
					const newIndex = 0;
					articles.splice(index, 1);
					articles.splice(newIndex, 0, item);
					articles = articles;
					window.scrollTo(0, 0);
					saveArticleOrder();
				}}
			/> -->

			<div
				class="flex h-full flex-col justify-center border-b border-gray-100 px-6 transition dark:border-gray-700  {$selectedArticleIds.includes(
					item.id
				)
					? 'bg-gray-200 dark:bg-gray-900'
					: 'dark:bg-gray-800 bg-transparent '}"
				on:mouseenter={() => (hovering = true)}
				on:mouseleave={() => (hovering = false)}
			>
				<div class="item relative flex flex-initial flex-row items-center gap-3 transition">
					<div
						class="flex-inital relative flex h-8 w-8 shrink-0 cursor-pointer flex-row items-center overflow-hidden rounded-md transition hover:ring-1"
					>
						{#if $dev.disableListImgs}
							<div
								class="h-8 w-8 shrink-0 cursor-pointer rounded-md border border-black/30 bg-red-100 object-cover shadow-sm hover:ring-1"
							/>
						{:else}
							<img
								class="h-8 w-8 shrink-0 cursor-pointer rounded-md border border-black/30 object-cover shadow-sm hover:ring-1"
								src={item.image || `https://icon.horse/icon/?uri=${item.url}`}
								alt=""
							/>
						{/if}
						<input
							bind:group={$selectedArticleIds}
							value={item.id}
							type="checkbox"
							aria-hidden={true}
							tabindex={-1}
							class=" absolute inset-0 h-full w-full cursor-pointer rounded-md border-0 bg-transparent text-gray-600/95 ring-0"
						/>
					</div>

					<div class="relative flex shrink flex-col justify-center  truncate text-left">
						<span class="truncate text-base font-semibold leading-tight">
							<a tabindex="-1" sveltekit:prefetch href="/{item.id}"
								>{#if html}{@html item.title}{:else}{item.title}{/if}</a
							>
						</span>
						<!-- url and author around 74,74,74, description around 126,126,126 -->
						<div class="flex gap-4 text-xs text-stone-700 dark:text-gray-300 md:text-sm">
							{#if item.author}
								<span>{item.author}</span>
							{/if}
							<span><a href={item.url}>{item.url}</a></span>
						</div>
						<p
							class="hidden truncate text-xs text-stone-500 dark:text-gray-400 md:block md:text-sm {quoted &&
								'before:content-[""] before:border-l-2 before:mr-4'}"
						>
							{#if html}{@html item.description}{:else}{item.description}{/if}
						</p>
					</div>
					<!-- is this necessary? -->
					<Spacer />

					<!-- TODO: add type -->
					{#if item['_count']?.annotations}
						<AnnotationCount count={item['_count'].annotations} />
					{/if}

					{#if item.tags?.length}
						<div class="hidden sm:flex">
							<TagCloud tags={item.tags} />
						</div>
					{/if}

					<div class="flex shrink-0 basis-auto items-center gap-4">
						<!-- turning this off for now -->
						{#if true}
							<div class="flex items-center">
								<Menu
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
								</Menu>
							</div>
							<!-- TODO: make entire thing draggable -->
							<div
								on:mousedown={startDrag}
								on:touchstart={startDrag}
								on:mouseup={stopDrag}
								on:touchend={stopDrag}
								class="drag-handle  flex items-center"
							>
								<Icon name="dragHandle2" className="w-4 h-4 stroke-current stroke-0" />
							</div>
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
					<slot />
				</div>
			</div>
		</li>
	{/each}
</ul>

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
