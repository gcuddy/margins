<script lang="ts">
	import ViewEdit from '$components/views/view-edit.svelte';

	export let data;
</script>

<ViewEdit
	id={data.view.id}
	scope={data.view.entryFilterType === 'Library' ? 'library' : 'all'}
	name={data.view.name}
    filterData={data.view.filterData}
/>
