<script lang="ts">
	import { ctx } from './ctx';
	import { getContext, onMount } from 'svelte';
	import { generateId } from '@melt-ui/svelte/internal/helpers';
	import CommandItem from './CommandItem.svelte';

	type T = $$Generic;
	export let items: T[];
	export let itemToId: ((item: T) => string) | undefined = undefined;
	export let onSelect: ((value: T | undefined) => void) | undefined = undefined;
	export let groupId = getContext('command_groupId') as string | undefined;
	let className = '';
	export { className as class };

	const id = generateId();

	const {
		state: { filtered },
		helpers
	} = ctx.get<T>();

	const _items = items.map((item, index) => ({
		id: itemToId ? `${id}-${itemToId(item)}` : `${id}-${index}`,
		value: item
	}));

	$: console.log({ _items });

	onMount(() => {
		const u = helpers.registerItems(_items, groupId);

		return () => {
			u();
		};
	});

	$: console.log({ $filtered });
</script>

{#each $filtered.items.slice(0, 25) as item, index}
	<CommandItem
		id={$filtered.ids[index]}
		class={className}
		shouldRegister={false}
		alwaysShow={true}
		value={item}
		{onSelect}
	>
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
