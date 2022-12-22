<script lang="ts">
	/// Take in a list of Bookmarks ~~*or* a list of Entries and display them~~
	export let items: ExtendedBookmark[];
	$: console.log({ items });
	/** Should we render the title and description as safe html or not? */
	export let html = false;

	/** Should we render the description as a "quote"? */
	export let quoted = false;

	export let externalLink = false;
	export let actions: ComponentProperties<SelectActions>['actions'] | undefined = undefined;
	export let font: 'newsreader' | 'sans' = 'newsreader';
	export let alwaysShowDescription = false;

	import SelectActions from './SelectActions.svelte';
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME, type DndEvent } from 'svelte-dnd-action';
	import { notifications } from '../stores/notifications';
	import dayjs from 'dayjs';
	import localizedFormat from 'dayjs/plugin/localizedFormat.js';
	import Spacer from './helpers/Spacer.svelte';
	import { dev } from '$lib/stores/developer';
	import KeyboardNav from './helpers/KeyboardNav/KeyboardNav.svelte';
	import KeyboardNavItem from './helpers/KeyboardNav/KeyboardNavItem.svelte';
	import { createItemStores } from '$lib/stores/filter';
	import DotMenu from './DotMenu.svelte';
	import Muted from './atoms/Muted.svelte';
	import type { ComponentProperties } from '$lib/stores/types';
	import type { ViewOptions } from '$lib/types/schemas/View';
	import SavedPillWrapper from './SavedPillWrapper.svelte';
	import { page } from '$app/stores';
	import { selectedItems } from '$lib/stores/selectedItems';
	import type { ExtendedBookmark } from '$lib/bookmark';
	import type { Prisma } from '@prisma/client';
	import { entryData } from '$lib/entry';
	import { invalidateAll } from '$app/navigation';
	dayjs.extend(localizedFormat);

	const { items: currentItems, filteredItems, filterTerm } = createItemStores<ExtendedBookmark>();
	$: currentItems.set(items);

	let dragDisabled = false;

	const handleConsider = (e: CustomEvent<DndEvent<ExtendedBookmark>>) => {
		//optimistic update
		console.log('considering', e.detail);
		items = e.detail.items;
	};

	const handleFinalize = (e: CustomEvent<DndEvent<ExtendedBookmark>>) => {
		//optimistic update
		items = e.detail.items;
		// dragDisabled = true;
		// now save to database
		// saveArticleOrder();
	};
	let flipDurationMs = 200;
	let hovering = false;
	const view_options: ViewOptions = {
		view: 'list',
		sort: 'manual',
		properties: {
			author: true,
			site: true,
			description: true,
			tags: true,
			annotationCount: true,
			date: false,
			wordCount: false,
			image: true,
			readProgress: true,
			location: true,
			url: true,
			pageNote: true,
		},
	};
	export let viewOptions: Partial<ViewOptions> = view_options;
	$: viewOptions = { ...view_options, ...viewOptions };
	$: dragDisabled = viewOptions.sort != 'manual';

	const determineData = (data: Prisma.JsonValue | null) => {
		const parsed = entryData.safeParse(data);
		if (parsed.success) {
			return parsed.data;
		} else {
			console.error(`failed on data:`, data);
			console.error(parsed.error);
		}
		if (typeof data === 'object') {
			const dataObject = data as Prisma.JsonObject;
		}
		throw Error('Unknown data type');
	};
</script>

<!-- TODO: get this type working -->
<SelectActions {actions} bind:selected_items={$selectedItems} on:update />

<!-- todo: virtual list -->
<KeyboardNav class="h-full {viewOptions.view === 'grid' ? 'TODO:customized-color-here' : ''} ">
	<div
		class="mx-auto h-fit {viewOptions.view === 'grid'
			? 'p-4'
			: ''} w-full space-y-0 overflow-auto {viewOptions.view === 'grid'
			? 'grid grid-cols-12 gap-4 container pb-10'
			: ''}"
		use:dndzone={{
			items: items,
			flipDurationMs,
			dragDisabled,
			dropTargetStyle: {},
			zoneTabIndex: -1,
		}}
		on:consider={handleConsider}
		on:finalize={handleFinalize}
	>
		{#each $filteredItems || [] as item, index (item.id)}
			{@const data = determineData(item.data)}
			{@const pageNotes = item.annotations.filter((a) => a.type === 'note')}
			<!-- {index} -->
			<!-- by doing this can't do animate:flip. hm! trying out auto-animate. let's see... -->
			<KeyboardNavItem
				let:active
				let:followTabIndex
				{index}
				as="a"
				href={externalLink && item.uri
					? item.uri
					: `/u:${$page.params.username}/entry/${item.entryId}`}
				class="group col-span-12 h-min md:col-span-3 2xl:col-span-3 {viewOptions.view === 'list'
					? '!cursor-default'
					: ''}"
				on:select={() => {
					if ($selectedItems.includes(item)) {
						$selectedItems = $selectedItems.filter(({ id }) => id !== item.id);
					} else {
						$selectedItems = [...$selectedItems, item];
					}
				}}
			>
				<div class={viewOptions.view === 'list' ? 'h-24 md:h-32' : 'h-44 md:h-72'}>
					{#if viewOptions.view}
						<div
							class="flex h-full flex-col overflow-hidden  border-gray-100 ring-inset focus:!outline-none focus-visible:!outline-none group-focus-visible:bg-gray-50 group-focus-visible:ring-1 dark:border-gray-800 dark:group-focus-visible:bg-gray-800 {viewOptions.view ===
							'list'
								? 'border-b  justify-center px-6 '
								: 'border rounded-lg shadow-lg bg-white/50 dark:bg-stone-800'} {$selectedItems.some(
								(a) => a.id === item.id
							)
								? '!bg-gray-100 dark:!bg-blue-800/30'
								: ''}"
							on:mouseenter={() => (hovering = true)}
							on:mouseleave={() => (hovering = false)}
						>
							<div
								class="item relative h-full  flex-initial  items-center  transition {viewOptions.view ===
								'list'
									? 'flex flex-row gap-3'
									: 'grid grid-cols-12 md:flex md:flex-col gap-2 grow'}"
							>
								{#if viewOptions.properties?.image}
									<div
										class="flex-inital relative flex shrink-0 cursor-pointer flex-row items-center overflow-hidden  transition  {viewOptions.view ===
										'list'
											? 'h-8 w-8 rounded-md hover:ring'
											: 'h-full col-span-4 md:w-full md:h-28'}"
										on:click|stopPropagation
										on:keydown
									>
										{#if $dev.disableListImgs}
											<div
												class="group h-8 w-8 shrink-0 cursor-pointer rounded-md border border-black/30 bg-red-100 object-cover shadow-sm hover:ring-1"
											/>
										{:else}
											<img
												class=" shrink-0 cursor-pointer  border border-black/30 object-cover   {viewOptions.view ===
												'list'
													? 'h-8 w-8 rounded-md shadow-sm hover:ring-1'
													: ' w-full h-40 rounded-t-md'}"
												src={data?.image || `https://icon.horse/icon/?uri=${data?.url}`}
												alt=""
											/>
										{/if}
										<input
											bind:group={$selectedItems}
											value={item}
											type="checkbox"
											aria-hidden={true}
											tabindex={-1}
											class="absolute inset-0 z-10 h-full w-full cursor-pointer rounded-md border-0 bg-transparent  ring-0 {viewOptions.view ===
											'grid'
												? 'hidden'
												: ''}"
										/>
									</div>
								{/if}
								<div
									class="relative flex w-full shrink grow flex-col {viewOptions.view === 'list'
										? 'truncate justify-center'
										: 'gap-1 col-span-8 px-3'} text-left"
								>
									<span
										class="cursor-pointer {font === 'newsreader'
											? 'font-newsreader sm:text-lg'
											: 'font-sans'}  text-base font-semibold !leading-tight line-clamp-2  {viewOptions.view ===
										'grid'
											? 'text-lg'
											: ''}"
									>
										{#if html}{@html data.title}{:else}{data?.title}{/if}
									</span>
									<!-- url and author around 74,74,74, description around 126,126,126 -->
									<div
										class="flex flex-wrap gap-x-4 text-xs text-stone-700 dark:text-gray-300 {viewOptions.view ===
										'list'
											? 'md:text-sm'
											: ''} "
									>
										{#if item.uri && viewOptions.properties?.url}
											<span>{item.uri}</span>
										{/if}
										{#if data.author && viewOptions.properties?.author}
											<span>{data.author}</span>
										{/if}
										{#if viewOptions.properties?.site}
											<Muted>{data.siteName || item.uri}</Muted>
										{/if}
										{#if data.published && viewOptions.properties?.date && viewOptions.view === 'list'}
											<Muted>{dayjs(data.published).format('ll')}</Muted>
										{/if}
										{#if data.wordCount && viewOptions.properties?.wordCount && viewOptions.view === 'list'}
											<Muted>{data.wordCount} words</Muted>
										{/if}
										<!-- <span><a href={item.url}>{item.url}</a></span> -->
									</div>
									<div class="flex {viewOptions.view === 'list' ? 'truncate' : 'line-clamp-2'}">
										{#if viewOptions.properties?.description}
											<p
												class="{alwaysShowDescription
													? ''
													: 'hidden'}  text-xs text-stone-500 dark:text-gray-400 md:block {viewOptions.view ===
												'list'
													? 'md:text-sm truncate'
													: ''} {quoted && 'before:content-[""] before:border-l-2 before:mr-4'}"
											>
												{#if html}{@html data.summary}{:else}{data.summary}{/if}
											</p>
										{/if}
									</div>
									{#if viewOptions.properties?.pageNote && pageNotes.length}
										<div class="flex pt-1">
											{#each pageNotes as note}
												<div
													class="flex rounded-md bg-amber-400 py-1 px-1.5 text-xs text-amber-900"
												>
													{note.body}
												</div>
											{/each}
										</div>
									{/if}
								</div>
								<!-- is this necessary? -->
								{#if viewOptions.view === 'list'}
									<Spacer />
								{/if}

								<SavedPillWrapper {item} {viewOptions} />

								<div
									class=" shrink-0 basis-auto items-center text-xs {viewOptions.view === 'list'
										? 'flex'
										: 'col-start-12 flex md:place-self-start mt-auto flex-initial justify-between w-full'}"
								>
									<!-- turning this off for now -->
									<div class="flex items-center space-x-2">
										{#if data.published && viewOptions.properties?.date && viewOptions.view === 'grid'}
											<Muted>{dayjs(data.published).format('ll')}</Muted>
										{/if}
										{#if data.wordCount && viewOptions.properties?.wordCount && viewOptions.view === 'grid'}
											<Muted>{data.wordCount} words</Muted>
										{/if}
									</div>
									{#if true}
										<div class="flex items-center">
											<DotMenu
												actions={[followTabIndex]}
												icons="outline"
												items={[
													[
														{
															label: 'Archive',
															icon: 'archive',
														},
														{
															label: 'Delete',
															icon: 'trash',
															perform: async () => {
																if (!window.confirm(`Really delete "${data.title}"?`)) return;
																const form = new FormData();
																form.set('id', item.id.toString());
																const res = await fetch('/', {
																	method: 'DELETE',
																	body: form,
																});
																console.log({ res });
																if (res.ok) {
																	notifications.notify({
																		message: 'Article deleted',
																	});
																	await invalidateAll();
																}
															},
														},
														{
															label: 'Tag',
															icon: 'tag',
														},
														{
															label: 'Bump to top',
															icon: 'trendingUp',
															perform: () => dispatch('bump'),
														},
													],
													[
														{
															label: 'View Original',
															icon: 'globe',
															perform: () => {
																window.open(item.uri, '_blank');
															},
														},
													],
												]}
											/>
										</div>
									{:else}
										<div
											class="flex flex-col items-end text-xs tabular-nums text-gray-600 dark:text-gray-400 lg:text-sm"
										>
											<div>
												{dayjs(data.published).format('ll')}
											</div>
											<div>
												{data.wordCount} words
											</div>
											<div>
												<!-- TODO: implement read progress (interaction — is it on entry or bookmark?) -->
												<!-- {Math.round(item.readProgress * 100)}% read -->
											</div>
										</div>
									{/if}
								</div>
								<slot />
							</div>
						</div>
					{:else if viewOptions.view === 'grid'}{/if}
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
