<script lang="ts">
	import { groupBy } from '$lib/utils';
	import KanbanColumn from './KanbanColumn.svelte';

	type T = $$Generic<object>;
	type TKey = keyof T;
	export let items: T[] = [];
	export let grouping: TKey;
    let _key = "id" in items[0] ? items[0].id as TKey : undefined
    export { _key as key}

	$: groupings = groupBy(items, (item) => item[grouping]);
</script>

{#each Object.entries(groupings) as [key, items]}
	<div>
		<h2>{key}</h2>
        <KanbanColumn key={_key} onDrop={(e) => {
            console.log(e)
        }} {items} let:item>
            <slot {item} />
        </KanbanColumn>
		<!-- {#each items as item}
			<slot {item} />
		{/each} -->
	</div>
{/each}
