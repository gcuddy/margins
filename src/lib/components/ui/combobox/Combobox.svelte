<script lang="ts">
	import { inputVariants } from '../Input.svelte';

	import { cn } from '$lib/utils/tailwind';
	import type { Items } from './utils';

	type T = $$Generic<Items>;
	// type TItems = Items<T>;
	type C = CreateComboboxProps<T>;
	export let items: C['items'];
	export let filterFunction: C['filterFunction'];
	export let itemToString: C['itemToString'];
	export let loop: C['loop'] = false;
	export let scrollAlignment: C['scrollAlignment'] = 'nearest';

    export let placeholder = '';

	type ItemId = T extends {} ? keyof T : undefined;
	// TODO: make this required if items is objects (which it probably should be)
	export let itemId: ItemId = undefined as ItemId;

    // read-only external bindings
	let external_input = '';
	export { external_input as input };
    let selected_item: T | undefined = undefined;
    export { selected_item as selected } ;
    $:selected_item = $selectedItem;

	import { CreateComboboxProps, createCombobox } from '@melt-ui/svelte';
	import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
	const {
		menu,
		item,
		filteredItems,
		input,
		inputValue,
		isSelected,
		label,
		open,
		selectedItem,
		updateItems,
		options
	} = createCombobox({
		items,
		filterFunction,
		itemToString,
		loop,
		scrollAlignment
	});

	// When items changes, update the items.
	$: items, updateItems(() => items);

	$: external_input = $inputValue;
	$: console.log({ $selectedItem });
</script>

<!-- There's a version here which separates input and results... but that's not what we're going for. actually — we should separate into diff componenetss -->
<!-- Optional Label -->
<label {...$label} use:label>
	<!-- Label -->
</label>
<div class="relative w-max">
	<input
		{...$input}
		use:input
		class={cn(
			inputVariants(),
			'flex h-10 items-center justify-between rounded-md bg-white px-3 pr-12'
		)}
		{placeholder}
		bind:value={$inputValue}
	/>

	<div class="absolute right-1 top-1/2 z-10 -translate-y-1/2 text-magnum-700">
		{#if $open}
			<ChevronUp />
		{:else}
			<ChevronDown />
		{/if}
	</div>
</div>

<ul
	class="z-50 flex max-h-[300px] flex-col overflow-hidden rounded-md border shadow"
	{...$menu}
	use:menu
    on:click|preventDefault|stopPropagation={(e) => console.log({e})}
>
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div class="flex max-h-full flex-col gap-2 overflow-y-auto bg-white px-2 py-2" tabindex="0">
		{#if $open}
			{#if $filteredItems.length !== 0}
				{#each $filteredItems as filteredItem, index (itemId ? filteredItem[itemId] : index)}
					<li
						{...$item({
							index,
							item: filteredItem,
							disabled: filteredItem.disabled
						})}
						use:item
						class="relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800
                        data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground
                        data-[disabled]:opacity-50"
					>
						{#if $isSelected(filteredItem)}
							<div class="check">
								<Check class="h-4 w-4" />
							</div>
						{/if}
						<slot item={filteredItem}>
							<div>
								<span>{filteredItem.title}</span>
								<span class="block text-sm opacity-70">{filteredItem.author}</span>
							</div>
						</slot>
					</li>
				{/each}
			{:else}
				<li
					class="relative cursor-pointer rounded-md py-1 pl-8 pr-4
                    text-neutral-800 data-[highlighted]:bg-magnum-100
                    data-[highlighted]:text-magnum-700"
				>
					No results found
				</li>
			{/if}
		{/if}
	</div>
</ul>

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2 text-muted-foreground;
		translate: 0 calc(-50% + 1px);
	}
</style>
