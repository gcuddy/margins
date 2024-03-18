<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import DataTable from './data-table.svelte';
</script>

<div class="container mx-auto py-10">
	<DataTable {data} />
</div>
