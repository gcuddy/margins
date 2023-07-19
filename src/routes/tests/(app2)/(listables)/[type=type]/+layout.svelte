<script>
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import Sidebar from './Sidebar.svelte';
	import LeftSidebar from './LeftSidebar.svelte';
	export let data;

	const is_entry = getContext('is_entry');

</script>

<div style:--nav-height="4rem" class="relative flex items-start gap-2 grow">
	<!-- Left sidebar -->
	<div class="flex flex-col sticky top-0">
		<LeftSidebar />
	</div>
	<div id="entry-wrapper" class="flex grow flex-col overflow-x-hidden h-full">
		<slot />
	</div>
	{#if $page.data.entry}
		<Sidebar />
	{/if}
</div>
