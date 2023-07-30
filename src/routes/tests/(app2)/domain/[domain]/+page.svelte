<script lang="ts">
	import EntryList from '$components/entries/EntryList.svelte';


    export let data;
</script>

<EntryList entries={data.entries} />
