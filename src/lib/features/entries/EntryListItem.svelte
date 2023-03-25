<script lang="ts">
	import { page } from "$app/stores";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import Spacer from "$lib/components/helpers/Spacer.svelte";
	import MiniAnnotation from "$lib/components/MiniAnnotation.svelte";
	import Pill from "$lib/components/Pill.svelte";
	import StateCombobox from "$lib/components/StateCombobox.svelte";
	import TagCloud from "$lib/components/TagCloud.svelte";
	import dayjs from "dayjs";
	import type { EntryInList } from "$lib/prisma/selects/entry";
	import { selectedIds, selectedItems } from "$lib/stores/selectedItems";
	import type { DocumentType, Entry } from "@prisma/client";
	import { createEventDispatcher, onDestroy } from "svelte";
	import type { HTMLAnchorAttributes } from "svelte/elements";
	import { Image } from "@unpic/svelte";
	import { icons } from "./utils";
	import type { RouterOutputs } from "$lib/trpc/router";
	import { trpcWithQuery } from "$lib/trpc/client";
	import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";

	const client = trpcWithQuery($page);

	export let entry: RouterOutputs["entries"]["listBookmarks"][number];

	let show_metadata = false;
	$: relationsQuery = client.entries.getRelations.createQuery(
		{
			id: entry.id,
		},
		{
			enabled: show_metadata,
		}
	);
	$: annotationsQuery = client.entries.getAnnotations.createQuery(
		{
			id: entry.id,
		},
		{
			enabled: show_metadata,
		}
	);

	// float
	export let progress = 0;

	// export let entry: Entry;
	export let active = false;
	export let checked = $selectedIds.includes(entry.id);

	let c = "";
	export { c as class };
	export let href: string | undefined = undefined;
	export let show = {
		year: true,
		type: true,
	};
	interface $$Props extends HTMLAnchorAttributes {
		active?: boolean;
		checked?: boolean;
		href?: string;
		entry:
			| {
					id?: number;
					image: string | null;
					title: string | null;
					published?: string | Date | null;
					author?: string | null;
					type?: DocumentType;
			  }
			| EntryInList;
		show?: {
			year: boolean;
			type: boolean;
		};
	}
	// also allow to pass in as value
	// export { entry as value};
	$: imgsrc =
		entry.type === "tweet" && !entry.image
			? "/images/twitter.png"
			: entry?.image
			? entry?.image
			: "";

	const dispatch = createEventDispatcher();

	const unsubscribeSelectedIds = selectedIds.subscribe((value) => {
		checked = value.includes(entry.id);
	});

	onDestroy(unsubscribeSelectedIds);

	// TODO: viewoptions
	// something like getContext(viewOptions) and then use that
</script>

<svelte:element
	this={entry.id || href ? "a" : "div"}
	href={entry.id ? `/u:${$page.data.user?.username}/entry/${entry.id}` : href}
	class:active
	class="item group relative flex h-full flex-initial items-center gap-4 p-4 transition {c}"
>
	<div
		class="flex-inital group/button relative flex h-12 w-10 shrink-0 cursor-pointer flex-row items-center overflow-hidden rounded-md drop-shadow-lg transition sm:h-16 sm:w-14 {entry.id
			? 'hover:ring'
			: ''}"
		on:click|stopPropagation
		on:keydown
	>
		<!-- if remote image -->
		{#if imgsrc.startsWith("http")}
			<Image
				src={imgsrc}
				class=" h-full w-full shrink-0 cursor-pointer rounded-md object-cover shadow-sm ring-1 ring-border/50 hover:ring-1"
				layout="constrained"
				width={56}
				cdn="vercel"
				height={64}
				alt=""
			/>
		{:else}
			<img
				class=" h-full w-full shrink-0 cursor-pointer rounded-md object-cover shadow-sm ring-1 ring-border/50 hover:ring-1"
				src={imgsrc}
				alt=""
			/>
		{/if}
		{#if entry.id}
			<input
				id="entry-input-{entry.id}"
				value={entry}
				bind:checked
				on:change={(e) => {
					console.log(e, checked);
					if (checked && entry.id) {
						if (!$selectedIds.includes(entry.id)) {
							$selectedItems = [...$selectedItems, entry];
						}
					} else {
						$selectedItems = $selectedItems.filter(
							(item) => item.id !== entry.id
						);
					}
				}}
				on:click={() => {
					dispatch("check");
				}}
				type="checkbox"
				aria-hidden={true}
				tabindex={-1}
				class="absolute inset-0 z-10 h-full w-full cursor-pointer rounded-md border-0 bg-transparent text-gray-500/10 ring-0 checked:bg-accent/50 checked:backdrop-blur-lg checked:focus:!bg-accent/50"
			/>
		{/if}
	</div>
	<!-- <img class="h-16 w-14 shrink-0 rounded-lg object-cover ring-1 ring-black/10" src={entry.image} alt="" /> -->
	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<slot name="title">
				<span class="font-medium line-clamp-2">{entry.title}</span>
				{#if entry.published && show.year}
					<Muted class="text-sm">{dayjs(entry.published).year()}</Muted>
				{/if}
				<div class="flex items-center gap-0.5">
					{#if entry.annotations}
						<Pill
							popup={true}
							icon="pencilMini"
							on:showPopup={() => {
								show_metadata = true;
							}}
						>
							{entry.annotations}
							<div class="flex flex-col space-y-2" slot="popup">
								<div class="border-b border-border/80 py-1">
									<h2 class="text-sm font-medium">Annotations</h2>
								</div>
								<div class="flex flex-col space-y-1.5 text-xs">
									{#if $annotationsQuery.isLoading}
										<LoadingSpinner />
									{:else if $annotationsQuery.data}
										{@const annotations = $annotationsQuery.data}
										{@const pageNotes = annotations.filter(
											(a) => a.type === "note"
										)}
										{@const inlineNotes = annotations.filter(
											(a) => a.type === "annotation"
										)}
										{#each pageNotes
											.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
											.slice(0, 3) as note, idx}
											<MiniAnnotation clamp="line-clamp-3" annotation={note} />
										{/each}
										{#each inlineNotes
											.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
											.slice(0, 3) as note, idx}
											<MiniAnnotation clamp="line-clamp-3" annotation={note} />
										{/each}
										{#if inlineNotes.length > 3}
											<span class="px-1 text-accent/80"
												>+{inlineNotes.length - 3} more</span
											>
										{/if}
									{/if}
								</div>
							</div>
						</Pill>
					{/if}
					<!-- Entry.relations can be a number (or array?) -->
					{#if !!entry.relations}
						{@const total = entry.relations}
						<Pill
							icon="arrowsRightLeftMini"
							on:showPopup={() => {
								// relations
								show_metadata = true;
							}}
							popup={true}
						>
							{entry.relations}
							<div class="flex flex-col space-y-2" slot="popup">
								<div class="border-b border-border/80 py-1">
									<h2 class="text-sm font-medium">Relations</h2>
								</div>
								<div class="flex flex-col space-y-1.5 px-1 text-xs">
									{#if $relationsQuery.isInitialLoading}
										<LoadingSpinner />
									{:else if $relationsQuery.data}
										{@const slicedRelations =
											$relationsQuery.data.relations?.slice(0, 3) || []}
										{@const slicedBackRelations =
											$relationsQuery.data.back_relations?.slice(0, 3) || []}
										{@const slicedRelationsTotal =
											slicedRelations?.length + slicedBackRelations?.length}

										{#each slicedRelations as relation}
											<div class="flex gap-1">
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
												<a href="/entry/{relation.related_entry_id}"
													>{relation.related_entry_title}</a
												>
											</div>
										{/each}
										{#each slicedBackRelations as relation}
											<div class="flex gap-1">
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
												<a href="/entry/{relation.related_entry_id}"
													>{relation.related_entry_title}</a
												>
											</div>
										{/each}
										{#if total > slicedRelationsTotal}
											<span class="text-accent/80"
												>+{total - slicedRelationsTotal} more</span
											>
										{/if}
									{/if}
								</div>
							</div>
						</Pill>
					{/if}
				</div>
			</slot>
		</div>
		<slot name="author">
			<div class="flex items-center gap-2 text-sm">
				{#if show.type && entry.type}
					<Icon
						name={icons[entry.type] || "document"}
						className="h-4 w-4 stroke-muted/80"
					/>
				{/if}
				{#if entry.author}
					<Muted class="text-sm">{entry.author}</Muted>
				{/if}
				<slot name="author-extended" />
			</div>
		</slot>
		<slot name="description" />
	</div>
	<!-- metadata grower -->
	<div class="hidden grow justify-between sm:flex">
		<Spacer />
		{#if entry.tags?.length}
			{#if entry.tags.length < 5}
				<TagCloud class="gap-x-0.5 text-xs" tags={entry.tags} />
			{:else}
				<span>{entry.tags.length} tags</span>
			{/if}
		{/if}
		<!-- don't show if location is present since it's redundant -->
		{#if !$page.data.location && entry.bookmarks?.[0]?.state}
			<StateCombobox state={entry.bookmarks?.[0]?.state} />
			<!-- {entry.bookmarks?.[0]?.state?.name} -->
		{/if}
	</div>
</svelte:element>

<style lang="postcss">
	.active {
		@apply bg-elevation-hover;
	}
</style>
