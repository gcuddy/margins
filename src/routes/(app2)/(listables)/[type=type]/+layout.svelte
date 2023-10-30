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
	import { cn } from '$lib';

	export let data;

	/** A store to track whether or not we're jumping to a new point (i.e. when an annotation is clicked and we're scrolling to it.)*/
	const jumping = writable(false);
	setContext('jumping', jumping);

	createPdfStateContext();
	setAppearanceContext();
	setArticleContext();

	const { rightSidebarWidth } = setEntryContext();
</script>

<div
	style:--right-sidebar-width="{$rightSidebarWidth}px"
	class="relative flex grow items-start overflow-hidden"
>
	<!-- Left sidebar -->
	<!-- <div class="flex flex-col max-md:fixed md:sticky top-0 max-md:basis-0 "> -->
	{#if data.session}
		<LeftSidebar />
	{/if}
	<!-- </div> -->
	<div id="entry-wrapper" class={cn(
        "flex h-full grow flex-col overflow-x-hidden",
        !data.session && 'items-center'
    )}>
		{#if data.session}
			<Header />
		{/if}
		<slot />
	</div>
	{#if data.session}
		<Sidebar />
	{/if}
</div>
