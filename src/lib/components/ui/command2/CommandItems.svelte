<script lang="ts">
	import { ctx } from './ctx';
	import { getContext, onMount } from 'svelte';
	import { generateId } from '@melt-ui/svelte/internal/helpers';
	import CommandItem from './CommandItem.svelte';

	type T = $$Generic;
	export let items: T[];
	export let itemToValue: (item: T) => string;
	export let itemToId: ((item: T) => string) | undefined = undefined;
	export let onSelect: ((value: string) => void) | undefined = undefined;
	export let groupId = getContext('command_groupId') as string | undefined;
    let className = "";
    export { className as class };

	const id = generateId();

	const {
		state: { filtered },
		helpers
	} = ctx.get();

	const _items = items.map((item, index) => ({
		id: itemToId ? `${id}-${itemToId(item)}` : `${id}-${index}`,
		value: itemToValue(item)
	}));

	type Item = T extends object ? T & { id: string } : T;

	// let filteredItems: (T extends object ? T & { id: string} : T)[] = []
	$: filteredItems = $filtered.items
		.filter((item) => item.startsWith(id))
		.map((filteredItem) => {
			const idx = _items.findIndex((item) => item.id === filteredItem);
			const item = items[idx];
			if (item && typeof item === 'object') {
				return {
					...item,
					id: itemToId ? itemToId(item) : filteredItem
				};
			}
			return item;
		})
		.filter(Boolean) as Item[];

	onMount(() => {
		const u = helpers.registerItems(_items, groupId);

		return () => {
			u();
		};
	});

	$: console.log({ $filtered });
</script>

{#each filteredItems.slice(0, 25) as item (item && typeof item === 'object' && 'id' in item ? item.id : item)}
	<CommandItem class={className} shouldRegister={false} alwaysShow={true} value={itemToValue(item)} {onSelect}>
		<slot {item} />
	</CommandItem>
{/each}

<!-- {#each $filtered.items.filter((item) => item.startsWith(id)) as filteredItem}
	{@const idx = _items.findIndex((item) => item.id === filteredItem)}
	{@const item = items[idx]}
	{#if item}
		<CommandItem shouldRegister={false} value={itemToValue(item)} {onSelect}>
			<slot {item} />
		</CommandItem>
	{/if}
{/each} -->
