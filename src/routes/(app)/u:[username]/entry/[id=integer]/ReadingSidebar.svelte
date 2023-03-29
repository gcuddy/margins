<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/stores";
	import resize from "$lib/actions/resize";
	import Annotation from "$lib/components/Annotation.svelte";
	import AnnotationInput from "$lib/components/annotations/AnnotationInput.svelte";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import SmallPlus from "$lib/components/atoms/SmallPlus.svelte";
	import Button from "$lib/components/Button.svelte";
	import ChosenIcon from "$lib/components/ChosenIcon.svelte";
	import DatePicker from "$lib/components/DatePicker.svelte";
	import DotMenu from "$lib/components/DotMenu.svelte";
	import Filter from "$lib/components/Filters/Filter.svelte";
	import FilterDisplay from "$lib/components/Filters/FilterDisplay.svelte";
	import GenericInput from "$lib/components/GenericInput.svelte";
	import GenericPopover from "$lib/components/GenericPopover.svelte";
	import Cluster from "$lib/components/helpers/Cluster.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
	import StateCombobox from "$lib/components/StateCombobox.svelte";
	import TagInputCombobox from "$lib/components/TagInputCombobox.svelte";
	import dayjs from "$lib/dayjs";
	import { useSaveAnnotation } from "$lib/features/annotations/mutations";
	import { addEntriesToCollection } from "$lib/features/collections/stores";
	import { useUpdateBookmark } from "$lib/features/entries/mutations";
	import { reading_sidebar } from "$lib/features/entries/stores";
	import { iconsMini } from "$lib/features/entries/utils";
	import MovieEntrySidebar from "$lib/features/movies/MovieEntrySidebar.svelte";
	import Recipe from "$lib/features/recipes/Recipe.svelte";
	import { nanoid } from "$lib/nanoid";
	import { checkIfKeyboardShortcutsAllowed } from "$lib/stores/keyboard";
	import { createRelativeDateStore } from "$lib/stores/relativeDate";
	import { trpc, trpcWithQuery } from "$lib/trpc/client";
	import type { RouterOutputs } from "$lib/trpc/router";
	import { getHostname, getPathname } from "$lib/utils";
	import { lookupUrlType } from "$lib/web-parser/urls";
	import autoAnimate from "@formkit/auto-animate";
	import { Color, DocumentType, Tag } from "@prisma/client";
	import {
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
	} from "@rgossiaux/svelte-headlessui";
	import { useQueryClient } from "@tanstack/svelte-query";
	import { onMount } from "svelte";
	import { flip } from "svelte/animate";
	import { cubicOut } from "svelte/easing";
	import { tweened } from "svelte/motion";
	import { writable } from "svelte/store";
	import { fade, fly, slide } from "svelte/transition";
	import ReadingSidebarSection from "./ReadingSidebarSection.svelte";

	export let entry: RouterOutputs["entries"]["public"]["byId"] &
		Partial<RouterOutputs["entries"]["loadUserData"]>;
	$: console.log({ entry });
	const queryClient = useQueryClient();

	function customBackOut(t: number) {
		const s = 0.7;
		return --t * t * ((s + 1) * t + s) + 1;
	}
	$: pageNotes = entry?.annotations?.filter((a) => a.type === "note");
	$: inlineNotes = entry?.annotations?.filter((a) => a.type === "annotation");
	// $: inlineNotes, (annotations = inlineNotes);
	$: console.log({ inlineNotes });
	const noFilter = () => true;
	let inlineNotesFilter: (n: (typeof inlineNotes)[number]) => boolean =
		noFilter;

	let tags: Tag[] = [];
	$: console.log({ tags });

	let WIDTH = 428;

	let WIDTH_SPRING = tweened(WIDTH, {
		duration: 250,
		easing: cubicOut,
		delay: 0,
	});

	let display = $reading_sidebar.active;

	$: if ($reading_sidebar.active) {
		display = $reading_sidebar.active;
		WIDTH_SPRING.set(0);
	} else {
		WIDTH_SPRING.set(WIDTH).then(() => (display = $reading_sidebar.active));
	}

	let noting = false;
	let noting_id: string | null = null;

	const busy = writable({
		note: false,
	});

	const client = trpcWithQuery($page);
	const utils = client.createContext();
	const updateInteraction = client.entries.updateInteraction.createMutation();
	const saveAnnotationMutation = useSaveAnnotation();
	const updateBookmark = useUpdateBookmark();

	// $: collectionsQuery = client.entries.getCollections.createQuery(
	// 	{
	// 		id: entry.id,
	// 	},
	// 	{
	// 		enabled: !!entry,
	// 	}
	// );
	// $: ({ data: collections, isLoading: collectionsLoading } = $collectionsQuery);

	// $: relationsQuery = client.entries.getRelations.createQuery(
	// 	{
	// 		id: entry.id,
	// 	},
	// 	{
	// 		enabled: !!entry,
	// 	}
	// );
	// $: ({ data: relations, isLoading: relationsLoading } = $relationsQuery);

	$: savedDate = createRelativeDateStore(entry.bookmark_createdAt);

	// const updateInteraction = createMutation({
	//     mutationFn: () => trpc
	// })

	let tagInputRef: HTMLElement | undefined = undefined;
	let tagInputExpanded = false;
	let stateComboboxRef: HTMLElement | undefined = undefined;

	onMount(() => {
		// set tweened store with no animation
		if ($reading_sidebar.active) {
			display = $reading_sidebar.active;
			WIDTH_SPRING.set(0, {
				duration: 0,
			});
		}
	});

	let editing_entry = false;
</script>

<svelte:window
	on:keydown={(e) => {
		const allowed = checkIfKeyboardShortcutsAllowed();
		if (!allowed) return;
		if (e.key === "Escape") {
			if (checkIfKeyboardShortcutsAllowed()) {
				// e.preventDefault();
				// $reading_sidebar.active = false;
				// e.stopPropagation();
			}
		}
		// keyboard shortcuts
		// return if modifier keys are pressed
		if (e.ctrlKey || e.metaKey || e.altKey) return;
		if (e.key === "t") {
			// jump to tag input
			e.preventDefault();
			tagInputRef?.focus();
			tagInputExpanded = true;
		} else if (e.key === "s") {
			e.preventDefault();
			stateComboboxRef?.querySelector("button")?.click();
		}
	}}
/>

<!-- mt-8 to account for reading menu -->

{#if display}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		on:click={() => ($reading_sidebar.active = false)}
		class="inset-0 hidden bg-black/10 max-md:fixed max-md:block"
	/>
	<aside
		use:resize={(c) => {
			$reading_sidebar.width = c.contentRect.width;
		}}
		style:margin-left="{$WIDTH_SPRING * -1}px"
		style:--width="{WIDTH}px"
		style:transform="translateX({$WIDTH_SPRING}px)"
		class="z-10 mt-14 flex max-h-full shrink-0 flex-col space-y-5 overflow-auto overflow-y-auto border-l border-border bg-base p-4 shadow-lg backdrop-blur-md transition-shadow dark:border-gray-700 dark:shadow-stone-900 max-md:absolute max-md:top-0 max-md:right-0 max-md:bottom-0 max-md:border-l sm:w-96 md:relative"
	>
		<!-- <div class="absolute top-0 left-0 h-full w-full bg-red-500" style:width="450px" /> -->

		<div class="flex flex-col gap-y-2 divide-y dark:divide-gray-700/40">
			<div class="flex flex-col gap-y-1">
				<div class="flex items-center justify-between">
					{#if entry.title && !editing_entry}
						<span class="text-lg font-semibold">{entry.title}</span>
					{:else if editing_entry}
						<input
							class="text-lg font-semibold"
							value={entry.title}
							placeholder="title"
						/>
					{/if}
					<Button
						on:click={() => (editing_entry = !editing_entry)}
						variant="naked"
					>
						<Icon name="pencilMini" className="h-3 w-3 fill-current" />
						<span class="sr-only">edit</span>
					</Button>
				</div>
				{#if entry.author && !editing_entry}
					<span class="text-base font-medium">{entry.author}</span>
				{:else if editing_entry}
					<input
						class="text-base font-medium"
						value={entry.author}
						placeholder="author"
					/>
				{/if}
				{#if entry.type === DocumentType.book && entry.uri?.startsWith("isbn:")}
					<!-- bookshop link -->
					<a
						href="https://bookshop.org/book/{entry.uri.replace('isbn:', '')}"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center text-sm text-muted"
					>
						<span>Bookshop</span>
						<Icon
							name="arrowTopRightOnSquareMini"
							className="w-4 h-4 ml-1 fill-muted"
						/>
					</a>
				{/if}
				{#if entry.image && !!entry.recipe}
					<img src={entry.image} alt="" />
				{/if}
			</div>
			<ReadingSidebarSection>
				<svelte:fragment slot="heading">Metadata</svelte:fragment>

				<div class="flex flex-col gap-y-1">
					{#if entry.feedId}
						<!-- display feed -->
						<!-- Or just put this in context section -->
						subscription:
						<a
							href="/u:{$page.data.user?.username}/subscriptions/{entry.feedId}"
							>{$page.data.user?.subscriptions?.find(
								(s) => s.feedId === entry.feedId
							)?.title}</a
						>
					{/if}
					<div
						class="grid auto-rows-fr grid-cols-[minmax(90px,_auto)_1fr] items-center gap-1 text-sm"
					>
						<!-- REVIEW: what metadata to show -->
						{#if entry.bookmark_id}
							<Muted>Saved</Muted>
							<div class="px-2">{$savedDate}</div>
						{/if}
						{#if entry.state_id}
							{@const state = $page.data.user?.states.find(
								(s) => s.id === entry.state_id
							)}
							<Muted class="text-sm">Status</Muted>
							<StateCombobox
								bind:buttonWrapper={stateComboboxRef}
								{state}
								onSelect={async (state) => {
									const bookmarkId = entry.bookmark_id;
									$updateBookmark.mutate({
										id: bookmarkId,
										entryId: entry.id,
										data: {
											stateId: state.id,
										},
									});
								}}
							/>
						{:else}
							<Muted class="text-sm">Status</Muted>
							<StateCombobox
								unsaved={true}
								onSelect={async (state) => {
									// const s = syncStore.add();
									console.log({ entry });
									const bookmark = await $updateBookmark.mutateAsync({
										entryId: entry.id,
										uri: entry.uri || "undefined",
										data: {
											stateId: state.id,
										},
									});
									console.log({ bookmark });
									// await trpc().bookmarks.updateState.mutate({
									// 	stateId: state.id,
									// 	entryId: entry.id,
									// 	uri: entry.uri || undefined,
									// });
									// utils.entries.invalidate();
									// queryClient.invalidateQueries({
									// 	queryKey: entryDetailsQuery({ id: $page.data.article.id }).queryKey,
									// });
									// // await invalidateAll();
									// syncStore.remove(s);
								}}
							/>
						{/if}
						<Muted class="text-sm">Tags</Muted>
						<TagInputCombobox
							bind:expanded={tagInputExpanded}
							bind:inputRef={tagInputRef}
							bind:tags={entry.tags}
							original={{ ...entry }}
						/>
						<!-- {#if entry.context}
							<Muted class="text-sm">Context</Muted>
							{JSON.stringify(entry.context)}
						{/if} -->
						<!-- {#if relations?.relations.some((r) => r.type === "SavedFrom")}
							<Muted class="text-sm">Saved from</Muted>
							{#each relations?.relations.filter((r) => r.type === "SavedFrom") as r}
								<a
									href="/u:{$page.data.user
										?.username}/entry/{r.related_entry_id}"
									class="truncate text-xs">{r.related_entry_title}</a
								>
							{/each}
						{/if} -->
						<Muted class="text-sm">Type</Muted>
						<span>{entry.type}</span>
						{#if entry.type === DocumentType.book}
							{@const book = queryClient.getQueryData([
								"books",
								"detail",
								entry.googleBooksId,
							])}
							{@const currentPage = entry.interactions?.[0]?.currentPage}
							<Muted class="text-sm">Progress</Muted>
							<div class="flex items-center gap-2">
								<div class="w-16">
									<GenericInput
										value={currentPage || 0}
										on:blur={(e) => {
											if (!e.target.value) return;
											$updateInteraction.mutate({
												id: entry.id,
												currentPage: parseInt(e.target.value),
												progress: pageCount
													? parseInt(e.target.value) / pageCount
													: undefined,
											});
										}}
										type="number"
										class="text-xs"
									/>
								</div>
								<span>of {entry.pageCount} pages</span>
							</div>
						{/if}
						<Muted class="text-sm">Relations</Muted>
						{#if relationsLoading}
							<LoadingSpinner />
						{:else if relations}
							{@const { relations: to_relations, back_relations } = relations}
							<Cluster class="gap-x-2 gap-y-2">
								<!-- to -->
								{#each to_relations as relation}
									<div
										class="flex max-w-[220px] gap-1 truncate rounded bg-elevation py-1 px-2 ring-1 ring-border/50"
									>
										<!-- todo: little icon -->
										{#if relation.type === "Related"}
											<Icon
												name="arrowsRightLeftMini"
												className="w-3 h-3 fill-muted/80"
											/>
											<span class="sr-only">Related</span>
										{:else if relation.type === "SavedFrom"}
											<Icon
												name="arrowLeftMini"
												className="w-3 h-3 fill-muted/80"
											/>
											<span class="sr-only">Saved from</span>
										{/if}
										<a
											href="/u:{$page.data.user
												?.username}/entry/{relation.related_entry_id}"
											class="truncate text-xs">{relation.related_entry_title}</a
										>
									</div>
								{/each}
								<!-- back -->
								{#each back_relations as relation}
									<div
										class="flex max-w-[220px] gap-1 truncate rounded bg-elevation py-1 px-2 ring-1 ring-border/50"
									>
										<!-- todo: little icon -->
										{#if relation.type === "Related"}
											<Icon
												name="arrowsRightLeftMini"
												className="w-3 h-3 fill-muted/80"
											/>
											<span class="sr-only">Related</span>
										{:else if relation.type === "SavedFrom"}
											<Icon
												name="arrowRightMini"
												className="w-3 h-3 fill-muted/80"
											/>
											<span class="sr-only">Saved from</span>
										{/if}
										<a
											href="/u:{$page.data.user
												?.username}/entry/{relation.related_entry_id}"
											class="truncate text-xs">{relation.related_entry_title}</a
										>
									</div>
								{/each}
							</Cluster>
						{/if}

						{#if entry.bookmark?.dueDate}
							<Muted class="text-sm">Due Date</Muted>
							<GenericPopover>
								<svelte:fragment slot="button">
									<span>{dayjs(entry.bookmark?.dueDate).format("l")}</span
									></svelte:fragment
								>
								<div slot="panel" let:close>
									<DatePicker onConfirm={() => close(null)} />
								</div>
							</GenericPopover>
						{/if}
					</div>
				</div>
			</ReadingSidebarSection>
			{#if entry.recipe}
				<ReadingSidebarSection>
					<svelte:fragment slot="heading">Recipe Ingredients</svelte:fragment>
					<Recipe recipe={entry.recipe} />
				</ReadingSidebarSection>
			{/if}
			{#if entry.extended?.outgoingLinks?.length}
				<ReadingSidebarSection defaultOpen={false}>
					<svelte:fragment slot="heading"
						>Links ({entry.extended?.outgoingLinks?.length})</svelte:fragment
					>
					<div class="flex flex-col gap-x-4 gap-y-2 text-sm text-muted">
						{#each entry.extended?.outgoingLinks as { href, text }}
							{@const type = lookupUrlType(href)}
							<button
								on:click={() => {
									// scroll to link
									const el = document.querySelector(`[href="${href}"]`);
									if (el) {
										el.scrollIntoView({
											behavior: "smooth",
											block: "center",
											inline: "center",
										});
									}
								}}
								class="flex items-center justify-between gap-4 rounded bg-elevation py-1 px-2 ring-1 ring-border/50"
							>
								<div class="flex min-w-0 gap-2">
									<Icon
										name={type ? iconsMini[type] : "linkMini"}
										className="h-4 w-4  fill-muted/70"
									/>
									<div class="flex items-center gap-2 truncate">
										<span class="shrink-0 font-medium">{text}</span>
										<span class="truncate text-xs"
											>{getHostname(href) + getPathname(href)}</span
										>
									</div>
								</div>
								<div class="flex items-center gap-1">
									<DotMenu
										class="p-1"
										items={[
											[
												{
													label: "Copy link",
													perform: () => {
														navigator.clipboard.writeText(href);
													},
													icon: "linkMini",
												},
											],
											[
												{
													label: "Save link",
													perform: async () => {
														// todo
														const article = await trpc(
															$page
														).public.parse.query({ url: href });
														console.log({ article });
														await trpc($page).bookmarks.add.mutate({
															article,
															url: href,
															context: {
																entryId: entry.id,
															},
														});
													},
													icon: "arrowDownOnSquareMini",
												},
											],
										]}
									/>
									<a
										on:click|stopPropagation
										{href}
										target="_blank"
										rel="noreferrer noopener"
									>
										<Button variant="naked" as="div">
											<Icon
												name="arrowTopRightOnSquareMini"
												className="h-4 w-4 fill-current"
											/></Button
										>
									</a>
								</div>
							</button>
						{/each}
					</div>
					<!-- <Recipe recipe={entry.recipe} /> -->
				</ReadingSidebarSection>
			{/if}
			{#if entry.tmdbId}
				<ReadingSidebarSection>
					<svelte:fragment slot="heading">Movie Info</svelte:fragment>
					<MovieEntrySidebar tmdbId={entry.tmdbId} />
				</ReadingSidebarSection>
			{/if}
			<ReadingSidebarSection>
				<svelte:fragment slot="heading">Collections</svelte:fragment>
				<button
					slot="action"
					class="flex items-center self-end rounded-lg p-1.5 text-xs font-medium dark:hover:bg-gray-700/50"
					on:click={() => {
						addEntriesToCollection(queryClient, [entry.id], (c) => {
							utils.entries.getCollections.setData(
								{
									id: entry.id,
								},
								(old) => {
									if (!old) return old;
									return [...old, c];
								}
							);
							utils.collections.invalidate();
						});
					}}
				>
					<Icon name="plusMini" className="h-4 w-4 fill-gray-400" />
					<Muted>Add to collection</Muted></button
				>
				{#if collectionsLoading}
					loading...
				{:else if collections}
					<Cluster class="gap-x-4 gap-y-2">
						{#each collections as collection}
							<li class="rounded bg-elevation py-1 px-2 ring-1 ring-border/50">
								<a
									class="flex items-center gap-1"
									href="/u:{collection.username ||
										$page.data.user?.username}/collection/{collection.id}"
								>
									<ChosenIcon chosenIcon={collection.icon} />
									<span>{collection.name}</span>
								</a>
							</li>
						{/each}
					</Cluster>
				{/if}
				<!-- <MovieEntrySidebar tmdbId={entry.tmdbId} /> -->
			</ReadingSidebarSection>

			<Disclosure
				defaultOpen={true}
				let:open
				class="flex flex-col gap-3 p-2 text-sm"
			>
				<div class="flex items-center justify-between">
					<DisclosureButton
						class="group -ml-2 flex items-center gap-2 rounded py-1 px-2 hover:bg-gray-200"
					>
						<SmallPlus><Muted>Page Notes</Muted></SmallPlus>
						<Icon
							name={open ? "chevronUpMini" : "chevronDownMini"}
							className="h-4 w-4 fill-gray-400 opacity-0 group-hover:opacity-100"
						/>
					</DisclosureButton>
					<button
						in:fade|local={{ delay: 400 }}
						disabled={noting}
						class="flex items-center self-end rounded-lg p-1.5 text-xs font-medium dark:hover:bg-gray-700/50"
						on:click={() => (noting = true)}
					>
						<Icon name="plusMini" className="h-4 w-4 fill-gray-400" />
						<Muted>Add note</Muted></button
					>
				</div>
				{#if open}
					<div
						transition:slide|local={{
							duration: 75,
						}}
					>
						<DisclosurePanel static>
							<!-- TODO: use-dndzone -->
							<div class="flex flex-col gap-3" use:autoAnimate>
								{#each pageNotes || [] as annotation (annotation.id)}
									<div>
										{#if annotation.id !== noting_id}
											<Annotation
												{annotation}
												on:delete={(e) => {
													// remove
													console.log("HELLLLOOOO");
													utils.entries.load.setData(
														{
															id: entry.id,
														},
														(old) => {
															if (!old) return old;
															old = {
																...old,
																annotations: old.annotations.filter(
																	(a) => a.id !== annotation.id
																),
															};
															console.log({ old });
															return old;
														}
													);
												}}
												onEdit={() => {
													noting_id = annotation.id;
												}}
											/>
										{:else}
											<form
												action="?/updateNote"
												method="post"
												use:enhance={({}) => {
													$busy.note = true;
													return async ({ result, update }) => {
														console.log({ result });
														if (result.type === "success" && result.data) {
															const { annotation } = result.data;
															utils.entries.load.setData(
																{
																	id: entry.id,
																},
																(data) => {
																	if (!data) return data;
																	data.annotations = [
																		...data.annotations,
																		annotation,
																	];
																	return data;
																}
															);
														}
														// utils.entries.load.invalidate({
														//     id: entry.id,
														// })
														// await update({
														// 	reset: false,
														// });
														$busy.note = false;
														noting_id = null;
													};
												}}
												on:keydown={(e) => {
													if (e.key === "escape") {
														// todo: noting = false
													}
												}}
											>
												<input type="hidden" name="id" value={annotation.id} />
												<AnnotationInput
													placeholder="Add a page note…"
													rows={1}
													shadow_focus={true}
													include_tags={false}
													confirmButtonStyle="ghost"
													class="text-sm"
													value={annotation.body?.toString() || ""}
												>
													<svelte:fragment slot="buttons">
														<Button
															type="reset"
															on:click={() => (noting_id = null)}
															variant="ghost"
															size="sm"
															className="text-sm">Cancel</Button
														>
														<Button
															disabled={$busy.note}
															variant="ghost"
															size="sm"
															className="text-sm"
															>{#if $busy.note}
																<Icon
																	name="loading"
																	className="animate-spin h-4 w-4 text-current"
																/>
															{:else}
																Save
															{/if}
														</Button>
													</svelte:fragment>
												</AnnotationInput>
											</form>
										{/if}
									</div>
								{/each}

								{#if noting}
									<!-- REVIEW: is this action ok, since reading sidebar will always be in the entry? -->
									<!-- TODO: optimistic update  -->
									<form
										action="?/note"
										method="post"
										on:submit|preventDefault={(e) => {
											// let's handle this ourselves and set it directly.
											if (!e.target) return;
											const isForm = e.target instanceof HTMLFormElement;
											if (!isForm) return;
											const data = new FormData(e.target);
											const body = data.get("annotation");
											if (!body || typeof body !== "string") return;
											$saveAnnotationMutation.mutate({
												entryId: entry.id,
												body,
												id: nanoid(),
												type: "note",
											});
											noting = false;
										}}
										in:fly={{ y: -10 }}
										on:keydown={(e) => {
											if (e.key === "escape") {
												// todo: noting = false
											}
										}}
									>
										<AnnotationInput
											placeholder="Add a page note…"
											rows={1}
											shadow_focus={true}
											include_tags={false}
											confirmButtonStyle="ghost"
											class="text-sm"
										>
											<svelte:fragment slot="buttons">
												<Button
													type="reset"
													on:click={() => (noting = false)}
													variant="ghost"
													size="sm"
													className="text-sm">Cancel</Button
												>
												<Button
													type="submit"
													disabled={$busy.note}
													variant="ghost"
													size="sm"
													className="text-sm"
													>{#if $busy.note}
														<Icon
															name="loading"
															className="animate-spin h-4 w-4 text-current"
														/>
													{:else}
														Save
													{/if}
												</Button>
											</svelte:fragment>
										</AnnotationInput>
									</form>
								{/if}
							</div>
						</DisclosurePanel>
					</div>
				{/if}
			</Disclosure>
			{#if inlineNotes?.length || entry.type === DocumentType.video}
				<Disclosure
					defaultOpen={true}
					let:open
					class="flex flex-col gap-3 p-2 text-sm"
				>
					<!-- Review: if I bind annotations to entry thenit can also filter in article. interesting idea. -->
					<Filter
						values={inlineNotes}
						let:filteredItems
						let:filters
						on:filter={({ detail: annotations }) => {
							console.log({ annotations });
						}}
					>
						<div class="flex items-center justify-between">
							<DisclosureButton
								class="group -ml-2 flex items-center gap-2 rounded py-1 px-2 hover:bg-gray-200"
							>
								<SmallPlus
									><Muted>Annotations ({inlineNotes.length})</Muted></SmallPlus
								>
								<Icon
									name={open ? "chevronUpMini" : "chevronDownMini"}
									className="h-4 w-4 fill-gray-400 opacity-0 group-hover:opacity-100"
								/>
							</DisclosureButton>
							<div>
								<!-- fix this error (comes from serialization) -->
								<!-- <AnnotationFilter
									bind:annotations={entry.annotations}
									applyFilter={(a) => a.type === "annotation"}
								/> -->
								<FilterDisplay
									placement="bottom-end"
									{filters}
									options={[
										{
											id: "color",
											name: "Color",
											icon: "colorSwatch",
											multiple: true,
											options: Object.values(Color).map((c) => ({
												id: c,
												name: c,
												filter: (n) => n.color === c,
												color: `var(--highlight-${c.toLowerCase()})`,
											})),
										},
										{
											id: "private",
											name: "Private",
											icon: "lockClosedMini",
											options: [
												{
													id: "show-private",
													name: "Private",
													filter: (a) => a.private,
													icon: "lockClosedMini",
												},
												{
													id: "show-public",
													name: "Public",
													filter: (a) => !a.private,
													icon: "lockOpenMini",
												},
											],
										},
									]}
								/>
							</div>
						</div>
						{#if open}
							<div transition:slide|local={{ duration: 75 }}>
								<DisclosurePanel static>
									<div class="flex flex-col space-y-4 text-sm" use:autoAnimate>
										{#each filteredItems as annotation (annotation.id)}
											<!-- scroll to latest on creation -->
											<div
												data-sidebar-annotation-id={annotation.id}
												animate:flip={{
													duration: 125,
												}}
												transition:slide|local={{ duration: 75 }}
											>
												<Annotation
													on:delete={(e) => {
														// remove
														console.log("HELLLLOOOO");
														utils.entries.load.setData(
															{
																id: entry.id,
															},
															(old) => {
																if (!old) return old;
																old = {
																	...old,
																	annotations: old.annotations.filter(
																		(a) => a.id !== annotation.id
																	),
																};
																console.log({ old });
																return old;
															}
														);
													}}
													on:seek
													{annotation}
													scrollOnClick={true}
												/>
											</div>
										{/each}
									</div>
								</DisclosurePanel>
							</div>
						{/if}
					</Filter>
				</Disclosure>
			{/if}
		</div>
	</aside>
{/if}
