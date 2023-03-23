<script lang="ts">
	import BasicSearchItem from "$lib/features/entries/BasicSearchItem.svelte";
	import EntryListItem from "$lib/features/entries/EntryListItem.svelte";

	export let data;
</script>

<a href="/tests/edge/users">Users</a>

<!-- {#each data.entries as entry}
<BasicSearchItem title={entry.title}  />
{entry.relations} relations
{/each} -->
<!-- {#await data.lazy.tags} {JSON.stringify(tags)} {:then tags} {/await} -->
{JSON.stringify(data.entries)}
<!-- {#each data.entries as entry}
	<EntryListItem
		entry={{
			...entry,
            relations: +entry.relations
		}}
	/>
{/each} -->
