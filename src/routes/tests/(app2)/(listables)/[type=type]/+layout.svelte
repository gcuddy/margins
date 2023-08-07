<script lang="ts">
	import { page } from '$app/stores';
	import { getContext, setContext } from 'svelte';
	import Sidebar from './Sidebar.svelte';
	import LeftSidebar from './LeftSidebar.svelte';
	import Header from './Header.svelte';
	import { writable } from 'svelte/store';
	import { persisted } from 'svelte-local-storage-store';
	import { createPdfStateContext } from '$components/pdf-viewer/utils';
	// export let data;

	const is_entry = getContext('is_entry');

	const scrollingDown = writable(false);
	setContext('scrollingDown', scrollingDown);

	/** A store to track whether or not we're jumping to a new point (i.e. when an annotation is clicked and we're scrolling to it.)*/
	const jumping = writable(false);
	setContext('jumping', jumping);

	const rightSidebar = persisted('rightSidebar', true);
	setContext('rightSidebar', rightSidebar);

	const rightSidebarWidth = persisted('rightSidebarWidth', 360);
	setContext('rightSidebarWidth', rightSidebarWidth);

	createPdfStateContext();

	const navWidth = writable(0);
	setContext('navWidth', navWidth);
</script>

<div style:--right-sidebar-width="{$rightSidebarWidth}px" class="relative flex items-start grow">
	<!-- Left sidebar -->
	<!-- <div class="flex flex-col max-md:fixed md:sticky top-0 max-md:basis-0 "> -->
	<LeftSidebar />
	<!-- </div> -->
	<div id="entry-wrapper" class="flex grow flex-col overflow-x-hidden h-full">
		<Header {scrollingDown} />
		<slot />
	</div>
	<Sidebar />
</div>
