<script lang="ts">
	import EntryItem from "$lib/components/EntryItem.svelte";
	import type { ComponentProps } from "svelte";

	type EntryItemProps = ComponentProps<EntryItem>["entry"];

	export let entries: EntryItemProps[];
</script>

{#each entries as entry}
	<EntryItem {entry} />
{/each}

<!-- TODO: use virtualizer -->
