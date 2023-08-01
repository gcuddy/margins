<script lang="ts">
	import autoAnimate from '@formkit/auto-animate';
	import { createEventDispatcher } from 'svelte';

	type T = $$Generic<{ id: string | number }>;
	export let items: T[];

	import { dndzone } from 'svelte-dnd-action';
	const dispatch = createEventDispatcher<{
		kanbandrop: CustomEvent<DndEvent<T>>;
	}>();
	const flipDurationMs = 200;

	export let type: string | undefined = undefined;
	export let onDrop: (e: CustomEvent<DndEvent<T>>) => void;
	function handleSort(e: CustomEvent<DndEvent<T>>) {
        console.log({e, items})
		items = e.detail.items;
	}

	function handleFinalize(e: CustomEvent<DndEvent<T>>) {
		const { items: newItems } = e.detail;
		items = newItems;
        console.log(`finalizing`)
		// dispatch('kanbandrop', e);
		onDrop(e);
	}
</script>

<!-- TODO: virtualize -->
<!-- TODO: dragged element should be able to scroll parent container -->
<section
	class="flex h-full flex-col gap-2"
	use:autoAnimate={{
		duration: 200
	}}
	use:dndzone={{
		items,
		flipDurationMs: 200,
		type,
		morphDisabled: true,
        dropTargetStyle: {}
	}}
	on:consider={handleSort}
	on:finalize={handleFinalize}
>
	{#each items as item (item.id)}
		<slot {item} />
	{/each}
    <slot name="end" />
</section>
