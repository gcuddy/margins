<script lang="ts">
	import { page } from '$app/stores';
	import { getContext, setContext } from 'svelte';
	import Sidebar from './Sidebar.svelte';
	import LeftSidebar from './LeftSidebar.svelte';
	import Header from './Header.svelte';
	import { writable } from 'svelte/store';
	// export let data;

	const is_entry = getContext('is_entry');

	const scrollingDown = writable(false);
	setContext('scrollingDown', scrollingDown);

    const rightSidebar = writable(false);
    setContext('rightSidebar', rightSidebar);
</script>

<div style:--nav-height="4rem" class="relative flex items-start gap-2 grow">
	<!-- Left sidebar -->
	<!-- <div class="flex flex-col max-md:fixed md:sticky top-0 max-md:basis-0 "> -->
	<LeftSidebar />
	<!-- </div> -->
	<div id="entry-wrapper" class="flex grow flex-col overflow-x-hidden h-full">
		<Header {scrollingDown} />
		<slot />
	</div>
	{#if $page.data.entry}
		<Sidebar />
	{/if}
</div>
