<script lang="ts">
	// TODO: allow groups
	import type { Items } from './utils';

	type T = $$Generic<Items>;
	// type TItems = Items<T>;
	type C = CreateComboboxProps<T>;
	export let items: C['items'];
	export let filterFunction: C['filterFunction'];
	export let itemToString: C['itemToString'];
	export let loop: C['loop'] = false;
	export let scrollAlignment: C['scrollAlignment'] = 'nearest';

	type ItemId = T extends {} ? keyof T : undefined;
	// TODO: make this required if items is objects (which it probably should be)
	export let itemId: ItemId = undefined as ItemId;

	// Read-only external binding
	let external_input = '';
	export { external_input as input };

	import { CreateComboboxProps, createCombobox } from '@melt-ui/svelte';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import ComboboxInput from './ComboboxInput.svelte';
	import ComboboxMenu from './ComboboxMenu.svelte';
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

    $: $open = true;

	// When items changes, update the items.
	$: items, updateItems(() => items);

	$: external_input = $inputValue;
	$: console.log({ external_input });
</script>

<div class="rounded border shadow-md">
	<ComboboxInput {input} {inputValue} />
	<ComboboxMenu {menu} {open} {filteredItems} {item} {isSelected}>
		<svelte:fragment slot="item" let:item>
			<slot {item} />
		</svelte:fragment>
	</ComboboxMenu>
</div>
