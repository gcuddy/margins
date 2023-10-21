<script lang="ts">
	export let data;
	import DataTable from './data-table.svelte';
</script>

<div class="container mx-auto py-10">
	<DataTable {data} />
</div>
