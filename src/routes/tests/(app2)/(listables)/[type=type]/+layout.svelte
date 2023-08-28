<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	import { createPdfStateContext } from '$components/pdf-viewer/utils';

	import {
		setAppearanceContext,
		setArticleContext,
		setEntryContext,
	} from './ctx';
	import Header from './Header.svelte';
	import LeftSidebar from './LeftSidebar.svelte';
	import Sidebar from './Sidebar.svelte';
	// export let data;

	const scrollingDown = writable(false);
	setContext('scrollingDown', scrollingDown);

	/** A store to track whether or not we're jumping to a new point (i.e. when an annotation is clicked and we're scrolling to it.)*/
	const jumping = writable(false);
	setContext('jumping', jumping);

	createPdfStateContext();
	setAppearanceContext();
	setArticleContext();

	const {  rightSidebarWidth } = setEntryContext();
</script>

<div
	style:--right-sidebar-width="{$rightSidebarWidth}px"
	class="relative flex items-start grow"
>
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
