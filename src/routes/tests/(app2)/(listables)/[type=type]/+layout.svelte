<script>
	import { page } from '$app/stores';
	import StatusPopover from '$lib/components/StatusPopoverForm.svelte';
	import TagPopover from '$lib/components/TagPopover.svelte';
	import { H3, Muted } from '$lib/components/ui/typography';
	// import { getCurrentListContext } from "$lib/stores/currentList";
	import Relation from '$lib/components/Relation.svelte';
	import Cluster from '$lib/components/helpers/Cluster.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { TableOfContents } from '@skeletonlabs/skeleton';
	import { fly } from 'svelte/transition';
	import Annotation from './[id]/Annotation.svelte';
	import Sidebar from './Sidebar.svelte';
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
<!-- header row -->
<!-- <div class="flex items-center justify-between">
	<div />
	<div>
		<DropdownMenu>
			<DropdownMenuTrigger
				class={buttonVariants({ size: "sm", variant: "ghost" })}
			>
				<MoreHorizontal />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<div>My account</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Profile</DropdownMenuItem>
				<DropdownMenuItem>Billing</DropdownMenuItem>
				<DropdownMenuItem>Team</DropdownMenuItem>
				<DropdownMenuItem>Subscription</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
</div> -->
<div class="relative flex items-start gap-10">
	<div class="flex flex-1 flex-col overflow-x-hidden">
		<slot />
	</div>
	{#if $page.data.entry}
		<Sidebar />
	{/if}
</div>
