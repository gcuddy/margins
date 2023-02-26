<script lang="ts">
	import GenericInput from "$lib/components/GenericInput.svelte";
	import GenericTextarea from "$lib/components/GenericTextarea.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import AnnotationListItem from "$lib/features/annotations/AnnotationListItem.svelte";
	import EntryListItem from "$lib/features/entries/EntryListItem.svelte";
	import { syncStore } from "$lib/stores/sync";
	import { trpc } from "$lib/trpc/client";
	import type { RouterOutputs } from "$lib/trpc/router";
	import { Menu, MenuButton, MenuItem, MenuItems } from "@rgossiaux/svelte-headlessui";
	import { createEventDispatcher, onMount } from "svelte";
	import { dndzone, TRIGGERS } from "svelte-dnd-action";
	import { flip } from "svelte/animate";
	import cx from "classnames";
	import GridItem from "$lib/features/entries/GridItem.svelte";
	import AnnotationGridItem from "$lib/features/annotations/AnnotationGridItem.svelte";

	export let item: RouterOutputs["collections"]["detail"]["items"][number];

	export let view: "list" | "grid" = "list";
	$: console.log({ item });
	export let onDrop: (newItems: (typeof item)["children"]) => void;
	export let recursion = 0;

	const flipDurationMs = 200;

	let titleInput: HTMLInputElement | undefined = undefined;

	const dispatch = createEventDispatcher();

	const dispatchSectionDrag = () => dispatch("sectiondrag");

	onMount(() => {
		// TODO: focus input if it's just been created
		// titleInput?.focus();
	});
</script>

<!-- TODO: support/prevent limiting nesting more than N levels deep -->
<div class={cx("grow", {
    'px-6':view === 'list',
})}>
	{#if item.type === "Section"}
		{recursion}
		<div class="rounded border border-border">
			<div class="group flex items-center px-2">
				<Menu>
					<MenuButton class="flex flex-col items-center" on:click on:mousedown on:touchstart>
						<Icon name="dragHandle2" className="h-4 w-4 fill-current" />
					</MenuButton>
					<MenuItems>
						<MenuItem>Test</MenuItem>
					</MenuItems>
				</Menu>
				<GenericInput
					bind:el={titleInput}
					on:blur={async (e) => {
						const value = e.target?.value;
						const s = syncStore.add();
						await trpc().collections.updateItem.mutate({
							id: item.id,
							data: {
								title: value,
							},
						});
						// update queryclient
						syncStore.remove(s);
					}}
					bind:value={item.title}
					variant="naked"
					class=" inline-block text-xl">{item.title || "Untitled Section"}</GenericInput
				>
				<button class="flex flex-col items-center opacity-0 transition group-hover:opacity-100">
					<Icon name="trashMini" className="h-4 w-4 fill-muted" />
				</button>
			</div>
			<GenericTextarea
				on:blur={async (e) => {
					const value = e.target?.value;
					const s = syncStore.add();
					await trpc().collections.updateItem.mutate({
						id: item.id,
						data: {
							note: value,
						},
					});
					syncStore.remove(s);
				}}
				variant="ghost"
				placeholder="note"
				rows={1}
				value={item.note || ""}
			/>
			<!-- <p>{item.note}</p> -->
			<div
				class="p-2"
				use:dndzone={{
					items: item.children || [],
					flipDurationMs,
					zoneTabIndex: -1,
					morphDisabled: true,
					// TODO: if recursion > 5, don't let sections get dragged in...
				}}
				on:finalize={async (e) => {
					console.warn("got finalize", e);
					item.children = e.detail.items;
					// update server
					if (e.detail.info.trigger === TRIGGERS.DROPPED_INTO_ZONE) {
						const id = e.detail.info.id;
						const idx = e.detail.items.findIndex((i) => i.id === id);
						// position shuold be between idx -1.position and idx + 1.position
						const position =
							(e.detail.items[idx - 1]?.position || -1) + (e.detail.items[idx + 1]?.position || -1) / 2;
						console.log({ position });
						const s = syncStore.add();
						await trpc().collections.updateItem.mutate({
							id,
							data: {
								parentId: item.id,
								position,
							},
						});
						syncStore.remove(s);
					}
					onDrop(e.detail.items);
				}}
				on:consider={(e) => {
					console.warn("got consider", e);
					item.children = e.detail.items;
				}}
			>
				{#each item.children || [] as child (child.id)}
					<div animate:flip={{ duration: flipDurationMs }}>
						<svelte:self item={child} {onDrop} recursion={recursion + 1} />
					</div>
				{/each}
			</div>
		</div>
		<!-- do section stuff -->
	{:else if item.entry}
    {#if view === "list"}
		<EntryListItem entry={item.entry} />
    {:else if view === "grid"}
        <GridItem item={item.entry} />
    {/if}
	{:else if item.annotation}
		<!-- etc -->
       {#if view === "list"}
		<AnnotationListItem annotation={item.annotation} />
        {:else if view === "grid"}
            <AnnotationGridItem annotation={item.annotation} />
        {/if}
	{/if}
</div>
