<script lang="ts">
	/// Take in a list of Bookmarks ~~*or* a list of Entries and display them~~

	type ExtendableEntry = Entry | EntryWithBookmark;

	type T = $$Generic<
		Entry & {
			bookmark?: Bookmark;
			bookmarks?: Bookmark[];
			interaction?: Interaction;
		}
	>;
	export let items: T[];
	$: console.log({ items });
	/** Should we render the title and description as safe html or not? */
	export let html = false;

	/** Should we render the description as a "quote"? */
	export let quoted = false;

	export let externalLink = false;
	export let font: "newsreader" | "sans" = "sans";
	export let alwaysShowDescription = false;

	import autoAnimate, { AnimationController } from "@formkit/auto-animate";
	import {
		dndzone,
		SHADOW_ITEM_MARKER_PROPERTY_NAME,
		SOURCES,
		TRIGGERS,
		type DndEvent,
	} from "svelte-dnd-action";
	import SelectActions from "./SelectActions.svelte";
	// overrideItemIdKeyNameBeforeInitialisingDndZones("id");
	import { invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";
	import type { EntryWithBookmark } from "$lib/entry.server";
	import EntryListItem from "$lib/features/entries/EntryListItem.svelte";
	import { showCommandPalette } from "$lib/stores/commands";
	import { dev } from "$lib/stores/developer";
	import groupBy from "lodash/groupBy";
	import wdragging from "$lib/stores/dragging";
	import { createItemStores } from "$lib/stores/filter";
	import { disableGlobalKeyboardShortcuts } from "$lib/stores/keyboard";
	import { selectedIds, selectedItems } from "$lib/stores/selectedItems";
	import { syncStore } from "$lib/stores/sync";
	import { trpc } from "$lib/trpc/client";
	import type { ViewOptions } from "$lib/types/schemas/View";
	import { validUrl } from "$lib/utils";
	import { formatDuration } from "$lib/utils/dates";
	import { Bookmark, DocumentType, Entry, Interaction } from "@prisma/client";
	import dayjs from "dayjs";
	import localizedFormat from "dayjs/plugin/localizedFormat.js";
	import type { Dictionary } from "lodash";
	import { getContext, onDestroy, onMount, tick } from "svelte";
	import { derived, writable, Writable } from "svelte/store";
	import { notifications } from "../stores/notifications";
	import Muted from "./atoms/Muted.svelte";
	import Button from "./Button.svelte";
	import DotMenu from "./DotMenu.svelte";
	import Icon from "./helpers/Icon.svelte";
	import KeyboardNav from "./helpers/KeyboardNav/KeyboardNav.svelte";
	import KeyboardNavItem from "./helpers/KeyboardNav/KeyboardNavItem.svelte";
	import Progress from "./helpers/Progress.svelte";
	import Spacer from "./helpers/Spacer.svelte";
	import KanbanList from "./KanbanList.svelte";
	import { podcastPlayer } from "./PodcastPlayer.svelte";
	import SavedPillWrapper from "./SavedPillWrapper.svelte";
	import { slide } from "svelte/transition";
	import { createMutation, useQueryClient } from "@tanstack/svelte-query";
	import type { RouterInputs } from "$lib/trpc/router";
	dayjs.extend(localizedFormat);
	// const selectedItems = createSelectedItemStore<ExtendableEntry>();
	const { items: currentItems, filteredItems, filterTerm } = createItemStores<ExtendableEntry>(items);

	// fix bigint issue
	BigInt.prototype.toJSON = function () {
		return this.toString();
	};

	$: items, currentItems.set(items);
	$: console.log({ filteredItems });

	let groupedByState: Dictionary<typeof items>;
	// $: if ("bookmarks" in items) items = items.map(i => ({...i, bookmark: i.bookmarks[0]}))
	$: if (viewOptions.view === "kanban")
		groupedByState = groupBy(items, (item) => item.bookmarks?.[0]?.stateId);

	// clear selecteditems on url change
	$: $page.url.pathname, ($selectedItems = []);

	let dragDisabled = false;

	// todo: generalize
    const queryClient = useQueryClient();
	const updateState = createMutation({
		mutationFn: (input: RouterInputs["bookmarks"]["updateState"]) =>
			trpc().bookmarks.updateState.mutate(input),
        onSuccess: () => {
            queryClient.invalidateQueries({
               queryKey: ["collections"]
            })
            queryClient.invalidateQueries({
               queryKey: ["entries"]
            })
            invalidateAll();
            // TODO: queryclient invalidation
        }
	});

	const handleConsider = (e: CustomEvent<DndEvent<ExtendableEntry>>) => {
		//optimistic update
		animationController?.enable();
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

		if (trigger === TRIGGERS.DRAG_STARTED && source !== SOURCES.KEYBOARD && $selectedIds.includes(+id)) {
			console.log(e.detail);
			items = newItems.filter((item) => !$selectedIds.includes(item.id));
			return;
		}
		items = newItems;
	};

	const handleFinalize = (e: CustomEvent<DndEvent<ExtendableEntry>>) => {
		animationController?.disable();
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
		if (!el?.getAttribute("data-selected-items-count") && $selectedItems.length) {
			el?.setAttribute("data-selected-items-count", $selectedItems.length.toString());
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
	const anchorPointIndex = derived(anchorPoint, ($a) => items.findIndex((i) => i.id === $a?.id), -1);
	$: console.log({ $anchorPointIndex });
	// const anchorPointIndex = derived([selectedItems, anchorPoint], ([s, a]) =>
	// 	s.findIndex((s) => s.id === a?.id)
	// );

	const handleShiftClick = (index: number) => {
		console.log("handle shift");
		const itemIds = items.map(({ id }) => id);
		const sortedSelected = [...$selectedItems].sort((a, b) => itemIds.indexOf(a.id) - itemIds.indexOf(b.id));
		console.log({ itemIds, sortedSelected, $anchorPointIndex });
		// if index less than anchor point, go up. otherwise, go down
		// e.g. a is 1, selected index is 4 -> selecteditems should be [1,2,3,4]
		if ($anchorPointIndex < index) {
			// evrything from anchor to index is now new selected items
			const newSelectedItems = items.slice($anchorPointIndex > 0 ? $anchorPointIndex : 0, index + 1);
			$selectedItems = [...newSelectedItems];
		} else {
			// if index is less than anchor point
			// e.g. si currently is [3,4,5], anchor point is 3. selected index is 1. new si should be [1,2,3]
			// new selectedItems will be everything from index to Anchor Point
			const newSelectedItems = items.slice(index, $anchorPointIndex + 1);
			$selectedItems = [...newSelectedItems];
		}
	};

	const flipDurationMs: Writable<number> = getContext("flipDurationMs") || writable(125);
	flipDurationMs.set(125);
	let hovering = false;

	const view_options: ViewOptions = {
		view: "list",
		sort: "manual",
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
	$: dragDisabled = viewOptions.sort != "manual";

	let animationController: AnimationController | undefined = undefined;
	export let container: HTMLElement | undefined = undefined;

	const disableAnimation: Writable<boolean> = getContext("disableAnimation");
	$: console.log({ disableAnimation });

	const unsubscribeDisableAnimation = disableAnimation
		? disableAnimation?.subscribe((active) => {
				if (active) {
					console.log("disabling animations");
					animationController?.disable();
				} else {
					console.log("enabling animation");
					animationController?.enable();
				}
		  })
		: undefined;

	let dragging = writable(false);
	function handleDragOver(e: DragEvent) {
		wdragging.set(false);
		dragging.set(true);
		console.log({ e });
		// check if type is text/uri-list
		if (e.dataTransfer?.types.includes("text/uri-list")) {
			e.preventDefault();
			// console.log("allow drop");
		}
		for (const item of e.dataTransfer?.items || []) {
			if (item.kind === "string" && item.type === "text/uri-list") {
				console.log("allow drop");
				// e.preventDefault();
			}
		}
		// get url from dataTransfer
		const url = e.dataTransfer?.getData("text/uri-list");
		// set cursor to display url
		// e.dataTransfer?.setDragImage(document.createElement('div'), 0, 0);
		// e.dataTransfer?.setData('text/plain', url);
	}
	function handleDragLeave(e: DragEvent) {
		dragging.set(false);
	}
	async function handleDrop(e: DragEvent) {
		dragging.set(false);
		console.log("drop", e);
		const url = e.dataTransfer?.getData("text/uri-list");
		console.log({ url });
		if (!url) return;
		if (!validUrl(url)) return;
		const n = notifications.notify({ message: "Adding url..." });
		const parsed = await trpc().public.parse.query(url);
		console.log({ parsed });
		await trpc().bookmarks.add.mutate({
			article: parsed,
			url,
			collectionId: $page.data.collection?.id,
		});
		await invalidateAll();
		notifications.remove(n);
		// add url to databasse and add it to this collection
	}

	// let virtualizer: Readable<Virtualizer<HTMLElement, Element>>;

	// let ref: HTMLElement;
	// onMount(() => {
	// 	virtualizer = createVirtualizer({
	// 		count: $filteredItems.length,
	// 		overscan: 5,
	// 		getScrollElement: () => ref,
	// 		estimateSize: () => 40,
	// 		getItemKey: (index) => $filteredItems[index].id,
	// 		// getItemKey,
	// 	});
	// });
	onMount(() => {
		if (container) {
			animationController = autoAnimate(container);
			// disable until explicitly enabled
			animationController.disable();
		}
	});
	onDestroy(() => {
		unsubscribeDisableAnimation && unsubscribeDisableAnimation();
	});
</script>

<!-- TODO: get this type working -->
<SelectActions bind:selected_items={$selectedItems} on:update>
	<Button variant="ghost" on:click={() => showCommandPalette.show()}>Actions</Button>
</SelectActions>

<svelte:window
	on:paste={async (e) => {
		console.log(`paste`, e);
		if ($disableGlobalKeyboardShortcuts) return;
		const a = document.activeElement;
		if (a instanceof HTMLTextAreaElement || a instanceof HTMLInputElement) return;
		// REVIEW: is this how I want to go about this? or should it be scoped more somehow?
		e.preventDefault();
		let paste = e.clipboardData?.getData("text");
		if (paste && validUrl(paste)) {
			console.log(`got a url!`, paste);
			const n = notifications.notify({
				title: `Saving url…`,
			});
			const s = syncStore.add();
			const article = await trpc($page).public.parse.query(paste);
			console.log({ article });
			await trpc($page).bookmarks.add.mutate({
				article,
				url: paste,
			});
			await invalidateAll();
			notifications.remove(n);
			syncStore.remove(s);
		}
		// TODO: interactive toast with setting option for allowing paste or disabling paste
	}}
/>
{#if viewOptions.view === "kanban"}
	<!-- group by state -->

	<!-- {@const groued = groupBy(items)} -->
	<!-- <pre>{JSON.stringify(groupedByState)}</pre> -->

	<div class="flex grow items-stretch gap-4 overflow-x-auto bg-border/50  py-8 pl-3 overflow-y-hidden ">
		<!-- TODO: actually just show all states -->
		<!-- make sure user/states is nto null -->
		{#each $page.data.user?.states || [] as state}
			{@const items = groupedByState[state.id] || []}
			{#if state}
				<div class="simple-scrollbar flex shrink-0 flex-col overflow-y-auto">
					<div class="relative flex w-80 grow flex-col">
						<h2>{state.name}</h2>
						<KanbanList
                            on:kanbandrop
							onDrop={(e) => {
								// update state
								if (e.detail.info.trigger === TRIGGERS.DROPPED_INTO_ZONE) {
                                    const id = +e.detail.info.id;
                                    const entry = e.detail.items.find((i) => i.id === id);
                                    if (entry && "bookmarks" in entry && entry.bookmarks?.length) {
                                        $updateState.mutate({
                                            stateId: state.id,
                                            entryId: +e.detail.info.id,
                                            id: entry.bookmarks?.[0].id,
                                        });
                                    }
									// console.log(state, { e });
									// $updateState.mutate({
									// 	stateId: state.id,
									// 	// entryId: +e.detail.info.id,
									// });
								}
							}}
							{items}
							let:item
							type="kanban"
						>
                       <EntryListItem class="bg-base border border-border rounded-lg" entry={item} show={{type: true, year: false}} />
							<!-- <a

								class="flex h-24 items-center gap-4 rounded border border-black/20 bg-white px-4 py-2 shadow-sm dark:bg-gray-800"
								href="/u:{$page.data.user?.username}/entry/{item.id}"
							>
								<img
									class="h-16 w-14 shrink-0 rounded-lg object-cover ring-1 ring-black/10"
									src={item.image}
									alt=""
								/>
								<div class="flex flex-col">
									<span class="font-medium line-clamp-2">{item.title}</span>
									<span class="">{item.author}</span>
								</div>
							</a> -->
						</KanbanList>
						<!-- <section
							use:dndzone={{
								items,
								flipDurationMs: 200,
								type: "kanban",
							}}
							on:consider={({ detail }) => {
								console.log({ state });
								console.log({ detail });
							}}
						>
							{#each items as item}
								<a href="/entry/{item.id}"> {item.title}</a>
							{/each}
						</section> -->
					</div>
				</div>
			{/if}
		{/each}
	</div>
{:else if items.length}
	<!-- todo: virtual list -->
	<KeyboardNav
		class="simple-scrollbar flex h-full grow flex-col items-stretch overflow-auto will-change-transform {viewOptions.view ===
		'grid'
			? 'TODO:customized-color-here'
			: ''} "
	>
		<div
			on:drop|preventDefault|stopPropagation={handleDrop}
			on:dragleave|preventDefault|stopPropagation={handleDragLeave}
			on:dragover|preventDefault|stopPropagation={handleDragOver}
			class:dragging={$dragging}
			class="mx-auto h-fit grow {viewOptions.view === 'grid'
				? 'p-4'
				: ''} w-full space-y-0 overflow-auto {viewOptions.view === 'grid'
				? 'container grid grid-cols-12 gap-4 pb-10'
				: ''}"
			use:dndzone={{
				items: items,
				flipDurationMs: $flipDurationMs,
				dragDisabled,
				transformDraggedElement,
				dropTargetStyle: {},
				zoneTabIndex: -1,
			}}
			bind:this={container}
			on:consider={handleConsider}
			on:finalize={handleFinalize}
		>
			{#each items || [] as item, index (item.id)}
				{@const data = item}
				{@const pageNotes = "annotations" in item ? item.annotations?.filter((a) => a.type === "note") : null}
				<!-- {index} -->
				<!-- by doing this can't do animate:flip. hm! trying out auto-animate. let's see... -->

				<!-- takes forever to use animate flip on safari with filtering damn -->
				<!-- animate:flip={{ duration: $flipDurationMs }} -->
                <!-- transitions are nice for removing/adding to list, but obnoxious for page transitions -->
                <!-- in:slide|local={{
						duration: 125,
					}} -->
				<div

					class="focus-within:!outline-none"
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
						href={externalLink && item.uri ? item.uri : `/u:${$page.params.username}/entry/${item.id}`}
						class="group col-span-12 h-min focus-visible:outline-none md:col-span-3 2xl:col-span-3 {viewOptions.view ===
						'list'
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
						<div class={viewOptions.view === "list" ? "max-h-24 !outline-none md:max-h-32" : "h-44 md:h-72"}>
							{#if viewOptions.view}
								<div
									class="item relative flex h-full flex-col overflow-hidden border-border ring-inset ring-accent/25 group-focus-visible:bg-base-hover group-focus-visible:ring-1    {viewOptions.view ===
									'list'
										? 'justify-center  border-b px-6 '
										: 'rounded-lg border bg-white/50 shadow-lg dark:bg-stone-800'} {$selectedItems.some(
										(a) => a.id === item.id
									)
										? '!bg-accent/20 group-focus-visible:!bg-accent/40'
										: ''}"
									on:mouseenter={() => (hovering = true)}
									on:mouseleave={() => (hovering = false)}
								>
									<!-- {#if item.type === DocumentType.article || item.type === "tweet"} -->
									{#if item.type === DocumentType.article || item.type === DocumentType.tweet}
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
														? 'h-16 w-14 rounded-md hover:ring'
														: 'col-span-4 h-full md:h-28 md:w-full'}"
													on:click|stopPropagation
													on:keydown
												>
													{#if $dev.disableListImgs}
														<div
															class="group h-8 w-8 shrink-0 cursor-pointer rounded-md border border-black/30 bg-red-100 object-cover shadow-sm hover:ring-1"
														/>
													{:else}
														{@const src =
															item.type === DocumentType.tweet
																? "/images/twitter.png"
																: data?.image
																? data?.image
																: ""}
														<img
															class=" shrink-0 cursor-pointer  border border-black/30 object-cover   {viewOptions.view ===
															'list'
																? 'h-full w-full rounded-md shadow-sm hover:ring-1'
																: ' h-40 w-full rounded-t-md'}"
															{src}
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
														class="absolute inset-0 z-10 h-full w-full cursor-pointer rounded-md border-0 bg-transparent text-gray-500/10 ring-0 checked:bg-accent/50 checked:backdrop-blur-lg   {viewOptions.view ===
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
														: 'font-medium'} !leading-tight line-clamp-2  {viewOptions.view === 'grid'
														? 'text-lg'
														: ''}"
												>
													{#if html}{@html data.title || "[No title]"}{:else}{data?.title ||
															"[No title]"}{/if}
												</span>
												<!-- url and author around 74,74,74, description around 126,126,126 -->
												<div
													class="flex flex-wrap gap-x-4 text-xs text-stone-700 dark:text-gray-300 {viewOptions.view ===
													'list'
														? 'md:text-sm'
														: ''} "
												>
													{#if item.uri && viewOptions.properties?.url}
														<!-- <span>{item.uri}</span> -->
													{/if}
													{#if data.author && viewOptions.properties?.author}
														<span>{data.author}</span>
													{/if}
													{#if viewOptions.properties?.site}
														<!-- <Muted>{data.siteName || item.uri}</Muted> -->
													{/if}
													{#if data.published && viewOptions.properties?.date && viewOptions.view === "list"}
														<Muted>{dayjs(data.published).format("ll")}</Muted>
													{/if}
													{#if data.wordCount && viewOptions.properties?.wordCount && viewOptions.view === "list"}
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
															<div class="flex rounded-md bg-amber-400 py-1 px-1.5 text-xs text-amber-900">
																{note.body}
															</div>
														{/each}
													</div>
												{/if}
											</div>
											<!-- is this necessary? -->
											{#if viewOptions.view === "list"}
												<Spacer />
											{/if}
											{#if "bookmark" in item}
												<SavedPillWrapper {item} {viewOptions} />
											{/if}
											<div
												class=" shrink-0 basis-auto items-center text-xs {viewOptions.view === 'list'
													? 'flex'
													: 'col-start-12 mt-auto flex w-full flex-initial justify-between md:place-self-start'}"
											>
												<!-- turning this off for now -->
												<div class="flex items-center space-x-2">
													{#if data.published && viewOptions.properties?.date && viewOptions.view === "grid"}
														<Muted>{dayjs(data.published).format("ll")}</Muted>
													{/if}
													{#if data.wordCount && viewOptions.properties?.wordCount && viewOptions.view === "grid"}
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
																		label: "Archive",
																		icon: "archive",
																	},
																	{
																		label: "Delete",
																		icon: "trash",
																		perform: async () => {
																			if (!window.confirm(`Really delete "${data.title}"?`)) return;
																			const form = new FormData();
																			form.set("id", item.id.toString());
																			const res = await fetch("/", {
																				method: "DELETE",
																				body: form,
																			});
																			console.log({ res });
																			if (res.ok) {
																				notifications.notify({
																					message: "Article deleted",
																				});
																				await invalidateAll();
																			}
																		},
																	},
																	{
																		label: "Tag",
																		icon: "tag",
																	},
																	{
																		label: "Bump to top",
																		icon: "trendingUp",
																		perform: () => dispatch("bump"),
																	},
																],
																[
																	{
																		label: "View Original",
																		icon: "globe",
																		perform: () => {
																			window.open(item.uri, "_blank");
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
															{dayjs(data.published).format("ll")}
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
									{:else if item.type === DocumentType.audio}
										{@const loaded = $podcastPlayer?.episode?.enclosureUrl === item.enclosureUrl}
										{@const progress = item.interactions?.[0]?.progress}
                                        <!-- {@const progress = item.interaction?.progress} -->
										<!-- Old way: -->
										<!-- <EpisodeListItem {item} /> -->
										<!-- New way: -->
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<EntryListItem
											entry={item}
											show={{
												type: true,
												year: false,
											}}
										>
											<svelte:fragment slot="author-extended">
												<Muted>{dayjs(item.published).format("ll")}</Muted>
											</svelte:fragment>
											<svelte:fragment slot="description">
												{#if item.enclosureUrl}
													<div class="flex justify-between gap-2">
														<div
															class="flex cursor-default items-center space-x-1"
															on:click|preventDefault|stopPropagation={() => {
																if (loaded) {
																	podcastPlayer.toggle();
																} else {
																	console.log("loading");
																	$podcastPlayer.loading = true;
																	podcastPlayer.load(
																		{
																			title: item.title,
																			enclosureUrl: item.enclosureUrl,
																			entryId: item.id,
																			image: item.image,
																			id: item.id,
																		},
																		{
																			title: item.feed?.title,
																		},
																		progress
																	);
																}
															}}
														>
															<div class="flex flex-col items-center">
																<Icon
																	name={loaded && !$podcastPlayer.paused ? "pauseSolid" : "playSolid"}
																	className="h-6 w-6 fill-primary-500/80"
																/>
															</div>
															<div class="flex w-full items-center text-sm transition-[width]">
																<Progress
																	class="h-1 appearance-none rounded-full bg-gray-500 transition-[width] dark:bg-gray-600/50 {loaded
																		? 'mr-2 w-24'
																		: 'w-0'} {$podcastPlayer.loading ? 'animate-pulse' : ''}"
																	innerClass="bg-gradient-to-r from-primary-500 to-primary-600"
																	value={typeof $podcastPlayer.currentTime === "number" && loaded
																		? $podcastPlayer.currentTime
																		: 0}
																	max={typeof $podcastPlayer.duration === "number" && loaded
																		? $podcastPlayer.duration
																		: 1}
																	min={0}
																/>
																<Muted>
																	<!-- {[loaded, progress, item.duration]} -->
																	{#if loaded}
																		{formatDuration(
																			$podcastPlayer.duration - $podcastPlayer.currentTime,
																			"seconds"
																		)} left
																	{:else if progress}
																		{Math.round(progress * 100)}%
																	{/if}
																	<!-- {match([loaded, progress, item.duration])
																		.with(
																			[true],
																			() =>
																				formatDuration(
																					$podcastPlayer.duration - $podcastPlayer.currentTime,
																					"seconds"
																				) + " left"
																		)
																		.with(
																			[false, P.number, P.number],
																			([, progress, duration]) =>
																				formatDuration(duration - duration * progress, "seconds") + " left"
																		)
																		.with([false, P.when((n) => !n), P.number], ([x, y, duration]) =>
																			formatDuration(duration, "seconds")
																		)
																		.otherwise(() => "")} -->
																</Muted>
															</div>
														</div>
													</div>
												{/if}
											</svelte:fragment>
										</EntryListItem>
									{:else if item.type === DocumentType.book || item.type === DocumentType.movie}
										<EntryListItem
											entry={item}
											show={{
												year: true,
												type: true,
											}}
										/>
										<!-- <div class="item relative  flex h-full flex-initial items-center  gap-4  p-4  transition">
											<img
												class="h-16 w-14 shrink-0 rounded-lg object-cover ring-1 ring-black/10"
												src={item.image}
												alt=""
											/>
											<div class="flex flex-col">
												<div class="flex items-center gap-2">
													<span class="font-medium line-clamp-2">{item.title}</span>
													{#if item.published}
														<Muted class="text-sm">{dayjs(item.published).year()}</Muted>
													{/if}
												</div>
												<Muted class="text-sm">{item.author}</Muted>
											</div>
										</div> -->
									{:else if item.type === DocumentType.bookmark}
										<EntryListItem
											entry={{
												...item,
												image: $page.data.S3_BUCKET_PREFIX + item.screenshot,
											}}
										/>
									{:else if item.type === DocumentType.image}
										<EntryListItem
											entry={{
												...item,
												image: $page.data.S3_BUCKET_PREFIX + item.image,
											}}
											show={{
												year: false,
												type: true,
											}}
										/>
									{:else if item.type === DocumentType.video}
										<EntryListItem
											entry={item}
											show={{
												year: false,
												type: true,
											}}
										>
											<div slot="description" class="flex min-w-0 truncate">
												{#if item.text}
													<span class="truncate">
														{item.text}
													</span>
												{/if}
												<!-- spacer -->
												<Spacer />
											</div>
										</EntryListItem>
									{:else if item.type === DocumentType.recipe}
										<EntryListItem
											entry={{
												...item,
											}}
											show={{
												year: false,
												type: true,
											}}
										>
											<div slot="author" class="flex items-center gap-2 text-sm">
												<Icon name="chef" className="h-4 w-4 stroke-muted" />
												<Muted>{item.author}</Muted>
												<!-- <Muted>{item.recipe?.duration}</Muted> -->
											</div>
										</EntryListItem>
									{:else}
										{item.title}
									{/if}
									{#if item[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
										<div class="custom-shadow-item" />
									{/if}
								</div>
							{:else if viewOptions.view === "grid"}{/if}
						</div>
					</KeyboardNavItem>
				</div>
			{/each}
		</div>
	</KeyboardNav>
{:else}
	<slot name="empty-container">
		<div
			on:drop|preventDefault|stopPropagation={handleDrop}
			on:dragleave|preventDefault|stopPropagation={handleDragLeave}
			on:dragover|preventDefault|stopPropagation={handleDragOver}
			class:dragging={$dragging}
			class="h-full w-full grow"
		>
			<div class=" mx-auto max-w-xs pt-[25vh] text-center">
				<span class="text-lg font-medium">
					<slot name="empty">No entries</slot>
				</span>
			</div>
		</div>
	</slot>
{/if}

<style lang="postcss">
	.dragging {
		@apply border-2 border-dashed border-border bg-elevation;
	}
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
	input[type="checkbox"]:focus {
		box-shadow: none !important;
	}
	/* :global(#dnd-action-dragged-el) {
		@apply scale-105 !rounded-lg !bg-sky-200/80 shadow-2xl transition dark:!bg-sky-800/30;
		.item {
			@apply !border-none;
		}
	} */
	:global([data-selected-items-count]::after) {
		@apply absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-700 p-2 text-xs font-medium shadow transition;
		content: attr(data-selected-items-count);
	}
</style>
