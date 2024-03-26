<script lang="ts">
	import { page } from '$app/stores';

	import { goto } from '$app/navigation';
	import ViewEdit from '$components/views/view-edit.svelte';
</script>

<ViewEdit
	on:scopechange={(e) => {
		goto(`/views/explore/${e.detail.scope}${$page.url.search}`);
	}}
	scope={$page.params.customviewscope?.toLowerCase() === 'library'
		? 'library'
		: 'all'}
/>
