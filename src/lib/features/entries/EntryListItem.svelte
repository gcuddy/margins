<script lang="ts">
	import { page } from "$app/stores";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import dayjs from "$lib/dayjs";
	import { selectedIds, selectedItems } from "$lib/stores/selectedItems";
	import { DocumentType, Entry } from "@prisma/client";
	import { createEventDispatcher, onDestroy } from "svelte";
	import type { HTMLAnchorAttributes } from "svelte/elements";
	import { icons } from "./utils";

	export let entry: {
		id?: number;
		image: string | null;
		title: string | null;
		published?: string | Date | null;
		author?: string | null;
		type?: DocumentType;
	};

    // float
    export let progress = 0;

	// export let entry: Entry;
	export let active = false;
	export let checked = $selectedIds.includes(entry.id);

    let c = "";
    export { c as class};
	export let href: string | undefined = undefined;
	export let show = {
		year: true,
		type: true,
	};
	interface $$Props extends HTMLAnchorAttributes {
		active?: boolean;
		checked?: boolean;
		href?: string;
		entry: {
			id?: number;
			image: string | null;
			title: string | null;
			published?: string | Date | null;
			author?: string | null;
			type?: DocumentType;
		};
		show?: {
			year: boolean;
			type: boolean;
		};
	}
	// also allow to pass in as value
	// export { entry as value};
	$: imgsrc = entry.type === DocumentType.tweet ? "/images/twitter.png" : entry?.image ? entry?.image : "";

	const dispatch = createEventDispatcher();

	const unsubscribeSelectedIds = selectedIds.subscribe((value) => {
		checked = value.includes(entry.id);
	});

	onDestroy(unsubscribeSelectedIds);
</script>

<svelte:element
	this={entry.id || href ? "a" : "div"}
	href={entry.id ? `/u:${$page.data.user?.username}/entry/${entry.id}` : href}
	class:active
	class="item relative flex h-full flex-initial items-center gap-4  p-4  transition {c}"
>
	<div
		class="flex-inital relative flex h-16 w-14 shrink-0 drop-shadow-lg cursor-pointer flex-row  items-center overflow-hidden rounded-md transition {entry.id
			? 'hover:ring'
			: ''}"
		on:click|stopPropagation
		on:keydown
	>
		<img
			class=" h-full w-full  shrink-0 cursor-pointer rounded-md ring-1 ring-border/50  object-cover shadow-sm hover:ring-1"
			src={imgsrc}
			alt=""
		/>
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
						$selectedItems = $selectedItems.filter((item) => item.id !== entry.id);
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
			</slot>
		</div>
		<slot name="author">
			<div class="flex items-center gap-2 text-sm">
				{#if show.type && entry.type}
					<Icon name={icons[entry.type] || "document"} className="h-4 w-4 stroke-muted/80" />
				{/if}
				{#if entry.author}
					<Muted class="text-sm">{entry.author}</Muted>
				{/if}
				<slot name="author-extended" />
			</div>
		</slot>
		<slot name="description" />
	</div>
</svelte:element>

<style lang="postcss">
	.active {
		@apply bg-elevation-hover;
	}
</style>
