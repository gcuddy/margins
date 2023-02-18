<script lang="ts">
	import { syncStore } from "$lib/stores/sync";
	import { trpc } from "$lib/trpc/client";
import type { RouterOutputs } from "$lib/trpc/router";
	import { tick } from "svelte";
	import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
	import { flip } from "svelte/animate";
	import Section from "./Section.svelte";

	export let items: RouterOutputs["collections"]["detail"]["items"] = [];
    $: console.log(`sections.svelte`, {items})
	export let onFinalUpdate: (newItems: typeof items) => void;

	// chunk items into sections

	const flipDurationMs = 200;

	function handleChildrenFinalize(itemIdx: number, newItems: (typeof items)[number]["children"]) {
		console.warn("handleChildrenFinalize", itemIdx, newItems);
		items[itemIdx].children = newItems;
		onFinalUpdate([...items]);
	}

    let dragDisabled = true;

    function startDrag(e: Event) {
		// preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
		e.preventDefault();
		dragDisabled = false;
	}
</script>

<!-- {JSON.stringify(items)} -->
<div
	use:dndzone={{
		items,
		// type: "section",
		flipDurationMs,
		morphDisabled: true,
        dragDisabled
	}}
	on:consider={(e) => (items = e.detail.items)}
	on:finalize={async (e) => {
		console.warn("got finalize section", e);
        items = e.detail.items;

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
                    parentId: null,
                    position,
                },
           });
           syncStore.remove(s);
		}
		// onFinalUpdate(e.detail.items)
		// update server
        if (e.detail.info.source === SOURCES.POINTER) {
            dragDisabled = true
        }
		onFinalUpdate(e.detail.items);
	}}
>
	{#each items as item, idx (item.id)}
		<div animate:flip={{ duration: flipDurationMs }}>
			<Section on:mousedown={startDrag} on:touchstart={startDrag} on:click={() => {
                tick().then(() => dragDisabled = true)
            }} {item} onDrop={(newItems) => handleChildrenFinalize(idx, newItems)} />
		</div>
	{/each}
</div>
