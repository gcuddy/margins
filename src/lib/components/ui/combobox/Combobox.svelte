<script lang="ts">
	type T = $$Generic;
	type C = CreateComboboxProps<T>;
	export let items: C['items'];
	export let filterFunction: C['filterFunction'];
	export let itemToString: C['itemToString'];
	export let loop: C['loop'] = false;
	export let scrollAlignment: C['scrollAlignment'] = 'nearest';

    type ItemId =  T extends {} ? keyof T : undefined;
    // TODO: make this required if items is objects (which it probably should be)
	export let itemId: ItemId = undefined as ItemId;

    let external_input = '';
    export { external_input as input};

	import { CreateComboboxProps, createCombobox } from '@melt-ui/svelte';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
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
    $: console.log({external_input})
</script>

<!-- There's a version here which separates input and results... but that's not what we're going for -->
<!-- Optional Label -->
<label {...$label} use:label>
	<!-- Label -->
</label>
{$inputValue}
<input
	{...$input}
	use:input
	class="flex h-10 items-center justify-between rounded-md bg-white
          px-3 pr-12 text-magnum-700"
	placeholder="Best book ever"
	value={$inputValue}
/>

<div class="absolute right-1 top-1/2 z-10 -translate-y-1/2 text-magnum-700">
	{#if $open}
		<ChevronUp />
	{:else}
		<ChevronDown />
	{/if}
</div>


<ul class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-md" {...$menu} use:menu>
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div class="flex max-h-full flex-col gap-2 overflow-y-auto bg-white px-2 py-2" tabindex="0">
		{#if $open}
			{#if $filteredItems.length !== 0}
				{#each $filteredItems as book, index (itemId ? book[itemId] : index)}
					<li
						{...$item({
							index,
							item: book,
							disabled: book.disabled
						})}
						use:item
						class="relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800
                        data-[highlighted]:bg-magnum-100 data-[highlighted]:text-magnum-700
                        data-[disabled]:opacity-50"
					>
						{#if $isSelected(book)}
							<div class="check">
								<Check />
							</div>
						{/if}
						<div>
							<span>{book.title}</span>
							<span class="block text-sm opacity-70">{book.author}</span>
						</div>
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
