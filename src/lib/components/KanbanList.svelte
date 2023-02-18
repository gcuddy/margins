<script lang="ts">
	import autoAnimate from "@formkit/auto-animate";

	type T = $$Generic<{
		id: string | number;
	}>;
	export let items: T[];

	import { dndzone } from "svelte-dnd-action";
	const flipDurationMs = 200;

	export let type: string | undefined = undefined;
	export let onDrop: (items: T[]) => void;
	function handleSort(e: CustomEvent<DndEvent<T>>) {
		items = e.detail.items;
	}

	function handleFinalize(e: CustomEvent<DndEvent<T>>) {
		const { items: newItems } = e.detail;
		items = newItems;
		onDrop(items);
	}
</script>

<!-- TODO: virtualize -->
<!-- TODO: dragged element should be able to scroll parent container -->
<section
	class="flex h-full flex-col gap-4"
	use:autoAnimate={{
		duration: 200,
	}}
	use:dndzone={{
		items,
		flipDurationMs: 200,
		type,
        morphDisabled: true
	}}
	on:consider={handleSort}
	on:finalize={handleFinalize}
>
	{#each items as item (item.id)}
		<slot {item} />
	{/each}
</section>
