<script>
	import { page } from '$app/stores';
	import Sidebar from './Sidebar.svelte';
	export let data;

</script>


<div class="relative flex items-start gap-2">
	<div id="entry-wrapper" class="flex grow flex-col overflow-x-hidden h-full">
		<slot />
	</div>
	{#if $page.data.entry}
		<Sidebar />
	{/if}
</div>
