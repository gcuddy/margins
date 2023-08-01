<script lang="ts">
	import EntryList from "$components/entries/EntryList.svelte";


    export let data;
</script>

<EntryList view={"Kanban"} entries={data.entries} />
