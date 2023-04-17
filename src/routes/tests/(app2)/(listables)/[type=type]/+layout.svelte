<script>
	import { page } from "$app/stores";
	import TagPopover from "$lib/components/TagPopover.svelte";
	import StatusPopover from "$lib/components/StatusPopover.svelte";
	import { H3, H4, Subtle } from "$lib/components/ui/typography";
	// import { getCurrentListContext } from "$lib/stores/currentList";
	import { TableOfContents } from "@skeletonlabs/skeleton";
	import { fly } from "svelte/transition";
	export let data;

	// const currentList = getCurrentListContext();
	// $: currentIndex = $currentList.entries.findIndex(
	// 	(e) => e.id === $page.data.entry.id
	// );
	// $: nextId = $currentList.entries[currentIndex + 1]?.id;
	// $: prevId = $currentList.entries[currentIndex - 1]?.id;

	// $: ({ hasMore } = currentList);
</script>

<!-- py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]" -->
<div class="relative flex items-start gap-10">
	<div class="flex flex-1 flex-col overflow-x-hidden">
		<slot />
	</div>
	{#if $page.data.entry}
		<aside
			in:fly|local={{
				y: -10,
			}}
			class="sticky top-10 hidden w-72 space-y-4 xl:block"
		>
			<H3>Metadata</H3>
			{#if $page.data.tagForm}
				<div class="flex items-center space-x-4">
					<Subtle>Tags</Subtle>
					<TagPopover data={$page.data.tagForm} entry={$page.data.entry} />
				</div>
			{/if}
			{#if $page.data.updateBookmarkForm}
				<div class="flex items-center space-x-4">
					<Subtle>Status</Subtle>
					<StatusPopover
						data={$page.data.updateBookmarkForm}
						entry={$page.data.entry}
					/>
				</div>
			{/if}
			{#if $page.data.type === "entry"}
				{#key $page.data.entry?.id}
					<TableOfContents
						active="font-bold"
						scrollParent="html"
						target="#article"
					/>
				{/key}
			{/if}
			<div class="flex items-center space-x-4">
				<Subtle>Snooze</Subtle>
				<!-- <StatusPopover
					data={$page.data.updateBookmarkForm}
					entry={$page.data.entry}
				/> -->
				<input type="date" name="" id="" />
			</div>
		</aside>
	{/if}
</div>
