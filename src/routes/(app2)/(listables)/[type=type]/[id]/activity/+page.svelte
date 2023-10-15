<script lang="ts">
	import { page } from '$app/stores';
	import InteractionsTable from '$components/entries/interactions/interactions-table.svelte';
	import SlimEntry from '$components/entries/slim-entry.svelte';
	import { cn } from '$lib';
	import { getEntryContext } from '../../ctx';

	export let data;

	const { rightSidebar } = getEntryContext();
</script>

<div
	class={cn(
		'grow duration-300',
		$page.data.type !== 'pdf' &&
			'mt-[calc(var(--nav-height)+24px)] sm:px-6 px-4', // margin top is nav height + 24px (to account for header) (pdf handles this itself)
		$rightSidebar
			? 'w-full md:w-[calc(100%-(var(--right-sidebar-width)))]'
			: 'w-full', // width is 100% - right sidebar width + 64px (to account for padding) if showing, otherwise just 100%

		// current_list && 'rounded-lg border bg-card text-card-foreground shadow-lg h-full  grow'
	)}
>
	{#if data.entry}
		<SlimEntry viewTransition link entry={data.entry} />
		<InteractionsTable interactions={data.interactions} entry={data.entry} />
	{:else}
		<!-- TODO -->
	{/if}
</div>
