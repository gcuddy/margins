<script lang="ts">
	/// Take in a list of Bookmarks ~~*or* a list of Entries and display them~~

	type ExtendableEntry = Entry | EntryWithBookmark;

	export let items: ExtendableEntry[];
	$: console.log({ items });
	/** Should we render the title and description as safe html or not? */
	export let html = false;

	/** Should we render the description as a "quote"? */
	export let quoted = false;

	export let externalLink = false;
	export let font: 'newsreader' | 'sans' = 'newsreader';
	export let alwaysShowDescription = false;

	import SelectActions from './SelectActions.svelte';
	import {
		dndzone,
		SHADOW_ITEM_MARKER_PROPERTY_NAME,
		SHADOW_PLACEHOLDER_ITEM_ID,
		SOURCES,
		TRIGGERS,
		type DndEvent,
	} from 'svelte-dnd-action';
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
	import { selectedItems, selectedIds } from '$lib/stores/selectedItems';
	import type { ExtendedBookmark } from '$lib/bookmark';
	import type { Entry, Prisma } from '@prisma/client';
	import { entryData } from '$lib/entry';
	import { invalidateAll } from '$app/navigation';
	import type { EntryWithBookmark } from '$lib/entry.server';
	import { flip } from 'svelte/animate';
	import { derived } from 'svelte/store';
	import { match } from 'ts-pattern';
	import { tick } from 'svelte';
	dayjs.extend(localizedFormat);
	// const selectedItems = createSelectedItemStore<ExtendableEntry>();
	const {
		items: currentItems,
		filteredItems,
		filterTerm,
	} = createItemStores<ExtendableEntry>(items);

	$: items, currentItems.set(items);
	$: console.log({ filteredItems });

	// clear selecteditems on url change
	$: $page.url.pathname, ($selectedItems = []);

	let dragDisabled = false;

	const handleConsider = (e: CustomEvent<DndEvent<ExtendableEntry>>) => {
		//optimistic update
		const {
			items: newItems,
			info: { trigger, source, id },
		} = e.detail;

		// if only one or less item selected, just do what we normally do
		if ($selectedItems.length < 2) {
			items = newItems;
			return;
		}

		// handle multiple drag and drop
		// if ()

		if (
			trigger === TRIGGERS.DRAG_STARTED &&
			source !== SOURCES.KEYBOARD &&
			$selectedIds.includes(+id)
		) {
			console.log(e.detail);
			items = newItems.filter((item) => !$selectedIds.includes(item.id));
			return;
		}
		items = newItems;
	};

	const handleFinalize = (e: CustomEvent<DndEvent<ExtendableEntry>>) => {
		let {
			items: newItems,
			info: { trigger, source, id },
		} = e.detail;

		if ($selectedItems.length > 1) {
			const idx = newItems.findIndex((item) => item.id === +id);
			console.log({ idx });
			newItems = newItems.filter((item) => !$selectedIds.includes(item.id));
			newItems.splice(idx, 0, ...$selectedItems);
		}
		items = newItems;
		if ($selectedItems.length) {
			tick().then(() => {
				// re-calculate checkboxes - these get bungled for some reason. not the best way to do this!
				//humph
				$selectedItems = [...$selectedItems];
				$selectedItems.forEach((item) => {
					// noooo
					const checkbox = document.querySelector(`#entry-input-${item.id}`);
					if (checkbox instanceof HTMLInputElement) {
						checkbox.checked = true;
					}
				});
			});
		}
		// dragDisabled = true;
		// now save to database
		// saveArticleOrder();
	};

	function transformDraggedElement(el: HTMLElement | undefined) {
		if (!el?.getAttribute('data-selected-items-count') && $selectedItems.length) {
			el?.setAttribute('data-selected-items-count', $selectedItems.length.toString());
		}
	}

	let previousAnchorPoint: Entry | undefined = undefined;
	const anchorPoint = derived<typeof selectedItems, Entry | undefined>(
		selectedItems,
		($s, set) => {
			if ($s.length === 1) {
				previousAnchorPoint = $s[0];
			}
			set(previousAnchorPoint);
		},
		undefined
	);
	const anchorPointIndex = derived(
		anchorPoint,
		($a) => items.findIndex((i) => i.id === $a?.id),
		-1
	);
	$: console.log({ $anchorPointIndex });
	// const anchorPointIndex = derived([selectedItems, anchorPoint], ([s, a]) =>
	// 	s.findIndex((s) => s.id === a?.id)
	// );

	const handleShiftClick = (index: number) => {
		const itemIds = items.map(({ id }) => id);
		const sortedSelected = [...$selectedItems].sort(
			(a, b) => itemIds.indexOf(a.id) - itemIds.indexOf(b.id)
		);
		// if index less than anchor point, go up. otherwise, go down
		// e.g. a is 1, selected index is 4 -> selecteditems should be [1,2,3,4]
		if ($anchorPointIndex < index) {
			// evrything from anchor to index is now new selected items
			const newSelectedItems = items.slice(
				$anchorPointIndex > 0 ? $anchorPointIndex : 0,
				index + 1
			);
			$selectedItems = [...newSelectedItems];
		} else {
			// if index is less than anchor point
			// e.g. si currently is [3,4,5], anchor point is 3. selected index is 1. new si should be [1,2,3]
			// new selectedItems will be everything from index to Anchor Point
			const newSelectedItems = items.slice(index, $anchorPointIndex + 1);
			$selectedItems = [...newSelectedItems];
		}
	};

	let flipDurationMs = 125;
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
</script>

<!-- TODO: get this type working -->
<SelectActions bind:selected_items={$selectedItems} on:update>TODO: entry actions</SelectActions>

{#if items.length}
	<!-- todo: virtual list -->
	<KeyboardNav
		class="h-full overflow-auto will-change-transform {viewOptions.view === 'grid'
			? 'TODO:customized-color-here'
			: ''} "
	>
		<div
			class="mx-auto h-fit {viewOptions.view === 'grid'
				? 'p-4'
				: ''} w-full space-y-0 overflow-auto {viewOptions.view === 'grid'
				? 'container grid grid-cols-12 gap-4 pb-10'
				: ''}"
			use:dndzone={{
				items: items,
				flipDurationMs,
				dragDisabled,
				transformDraggedElement,
				dropTargetStyle: {},
				zoneTabIndex: -1,
			}}
			on:consider={handleConsider}
			on:finalize={handleFinalize}
		>
			{#each items || [] as item, index (item.id)}
				{@const data = item}
				{@const pageNotes =
					'annotations' in item ? item.annotations?.filter((a) => a.type === 'note') : null}
				<!-- {index} -->
				<!-- by doing this can't do animate:flip. hm! trying out auto-animate. let's see... -->
				<div
					animate:flip={{ duration: flipDurationMs }}
					on:click={(e) => {
						if (e.shiftKey) {
							e.preventDefault();
							if (!$selectedItems.length) {
								$selectedItems = [item];
							} else {
								handleShiftClick(index);
							}
						}
					}}
					on:keydown
				>
					<KeyboardNavItem
						let:active
						let:followTabIndex
						{index}
						as="a"
						href={externalLink && item.uri
							? item.uri
							: `/u:${$page.params.username}/entry/${item.id}`}
						class="group col-span-12 h-min md:col-span-3 2xl:col-span-3 {viewOptions.view === 'list'
							? '!cursor-default'
							: ''}"
						on:select={({ detail: shift }) => {
							if (shift) {
								// then handle this with a shift click
								handleShiftClick(index);
								return;
							}
							if ($selectedItems.includes(item)) {
								$selectedItems = $selectedItems.filter(({ id }) => id !== item.id);
							} else {
								$selectedItems = [...$selectedItems, item];
							}
						}}
					>
						<div class={viewOptions.view === 'list' ? 'max-h-24 md:max-h-32' : 'h-44 md:h-72'}>
							{#if viewOptions.view}
								<div
									class="item relative flex h-full flex-col overflow-hidden border-gray-100 ring-inset  focus:!outline-none focus-visible:!outline-none group-focus-visible:bg-gray-50 group-focus-visible:ring-1 dark:border-gray-800  dark:group-focus-visible:bg-gray-800 {viewOptions.view ===
									'list'
										? 'justify-center  border-b px-6 '
										: 'rounded-lg border bg-white/50 shadow-lg dark:bg-stone-800'} {$selectedItems.some(
										(a) => a.id === item.id
									)
										? '!bg-gray-100 dark:!bg-sky-800/30'
										: ''}"
									on:mouseenter={() => (hovering = true)}
									on:mouseleave={() => (hovering = false)}
								>
									<div
										class="item relative h-full flex-initial  items-center  p-4  transition {viewOptions.view ===
										'list'
											? 'flex flex-row gap-3'
											: 'grid grow grid-cols-12 gap-2 md:flex md:flex-col'}"
									>
										{#if viewOptions.properties?.image}
											<div
												class="flex-inital relative flex shrink-0 cursor-pointer flex-row items-center overflow-hidden  transition  {viewOptions.view ===
												'list'
													? 'h-8 w-8 rounded-md hover:ring'
													: 'col-span-4 h-full md:h-28 md:w-full'}"
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
															: ' h-40 w-full rounded-t-md'}"
														src={data?.image}
														alt=""
													/>
												{/if}
												<input
													bind:group={$selectedItems}
													checked={$selectedIds.includes(item.id)}
													id="entry-input-{item.id}"
													value={item}
													on:click={(e) => {
														// handle shift
														if (e.shiftKey) {
															handleShiftClick(index);
														}
													}}
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
												? 'justify-center truncate'
												: 'col-span-8 gap-1 px-3'} text-left"
										>
											<span
												class="cursor-pointer {font === 'newsreader'
													? 'font-newsreader sm:text-lg'
													: 'font-sans'}  text-base {'unread' in data && data.unread
													? 'font-semibold'
													: 'font-regular'} !leading-tight line-clamp-2  {viewOptions.view ===
												'grid'
													? 'text-lg'
													: ''}"
											>
												{#if html}{@html data.title || '[No title]'}{:else}{data?.title ||
														'[No title]'}{/if}
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
															? 'truncate md:text-sm'
															: ''} {quoted && 'before:mr-4 before:border-l-2 before:content-[""]'}"
													>
														{#if html}{@html data.summary}{:else}{data.summary}{/if}
													</p>
												{/if}
											</div>
											{#if viewOptions.properties?.pageNote && pageNotes?.length}
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
										{#if 'bookmark' in item}
											<SavedPillWrapper {item} {viewOptions} />
										{/if}
										<div
											class=" shrink-0 basis-auto items-center text-xs {viewOptions.view === 'list'
												? 'flex'
												: 'col-start-12 mt-auto flex w-full flex-initial justify-between md:place-self-start'}"
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
									{#if item[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
										<div class="custom-shadow-item" />
									{/if}
								</div>
							{:else if viewOptions.view === 'grid'}{/if}
						</div>
					</KeyboardNavItem>
				</div>
			{/each}
		</div>
	</KeyboardNav>
{:else}
	<slot name="empty-container">
		<div class="mx-auto max-w-xs pt-[25vh]">
			<span class="text-lg font-medium">
				<slot name="empty">No entries</slot>
			</span>
		</div>
	</slot>
{/if}

<style lang="postcss">
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
		visibility: visible;
		margin: 0;
		@apply bg-gray-200/60 transition dark:bg-gray-700/75;
	}
	input[type='checkbox']:focus {
		box-shadow: none !important;
	}
	:global(#dnd-action-dragged-el) {
		@apply scale-105 !rounded-lg !bg-sky-200/80 shadow-2xl transition dark:!bg-sky-800/30;
		.item {
			@apply !border-none;
		}
	}
	:global([data-selected-items-count]::after) {
		@apply absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-700 p-2 text-xs font-medium shadow transition;
		content: attr(data-selected-items-count);
	}
</style>
