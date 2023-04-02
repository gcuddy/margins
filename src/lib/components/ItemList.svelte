<script lang="ts">
	import { EntryItem, EntryItemSkeleton } from "$lib/components/entry-item";
	import type { ComponentProps } from "svelte";

	type EntryItemProps = ComponentProps<EntryItem>["entry"];

	export let entries: EntryItemProps[];
	export let loading = false;
</script>

<div class="divide-y divide-gray-200 rounded-md border border-gray-200">
	{#if !loading}
		{#each entries as entry}
			<EntryItem {entry} />
		{/each}
	{:else}
		{#each [1, 2, 3, 4, 5] as _}
			<EntryItemSkeleton />
		{/each}
	{/if}
</div>
<!-- TODO: use virtualizer -->
