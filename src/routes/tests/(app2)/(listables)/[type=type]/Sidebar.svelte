<script lang="ts">
	import { page } from '$app/stores';
	import Relation from '$lib/components/Relation.svelte';
	import StatusPopover from '$lib/components/StatusPopoverForm.svelte';
	import TagPopover from '$lib/components/TagPopover.svelte';
	import Cluster from '$lib/components/helpers/Cluster.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		Card,
		CardContent,
		CardHeader,
		CardDescription,
		CardSkeleton,
		CardFooter,
		CardTitle
	} from '$lib/components/ui/card';
	import { H3, Muted } from '$lib/components/ui/typography';
	import { TableOfContents } from '@skeletonlabs/skeleton';
	import { persisted } from 'svelte-local-storage-store';

	import Annotation from './[id]/Annotation.svelte';
	import { fly } from 'svelte/transition';
	import Button, { buttonVariants } from '$lib/components/ui/Button.svelte';
	import {
		ArrowUpRightFromCircle,
		FileDown,
		InfoIcon,
		MoreHorizontalIcon,
		PlusIcon,
		XIcon
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import { getCommanderContext } from '$lib/commands/GenericCommander.svelte';
	import Collections from '$lib/commands/Collections.svelte';
	import { mutation } from '$lib/queries/query';
	import toast from 'svelte-french-toast';
	import { invalidate } from '$app/navigation';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { triggerDownload } from '$lib/utils/annotations';

	const render = persisted('sidebar', false);
	$: console.log({ $render });
	let flash = false;
	let prev_annotation_count: number = $page.data.entry?.annotations?.length ?? 0;

	$: console.log({ prev_annotation_count });
	onMount(() => {
		let unsubscriber = page.subscribe((val) => {
			if (val.data.entry?.annotations?.length !== prev_annotation_count) {
				flash = true;
				setTimeout(() => {
					flash = false;
				}, 4000);
			}
			prev_annotation_count = val.data.entry?.annotations?.length;
		});

		return () => {
			unsubscriber();
		};
	});

	// refs
	let button_el: HTMLElement;

	const commander_store = getCommanderContext();
</script>

<aside class="right-4 top-16 max-lg:fixed max-lg:z-50 lg:sticky">
	{#if $render}
		<div
			class=" hidden h-[calc(100vh-6rem)] flex-col gap-2 overflow-y-auto overflow-x-hidden pb-4 max-lg:absolute max-lg:right-0 max-lg:top-0 lg:flex"
			in:fly|local={{
				y: -10
			}}
		>
			<Card class="h-full w-[calc(100vw-2rem)]  overflow-y-auto md:w-80">
				<CardHeader class="">
					<div class="flex items-center justify-between gap-x-2">
						<CardTitle>Details</CardTitle>
						<Button on:click={() => ($render = false)} size="sm" variant="ghost" class="px-2">
							<XIcon class="h-4 w-4" />
						</Button>
					</div>
				</CardHeader>
				<CardContent class="space-y-4">
					{#if $page.data.tagForm}
						<div class="flex items-center space-x-4">
							<Muted>Tags</Muted>
							<TagPopover data={$page.data.tagForm} entry={$page.data.entry} />
						</div>
					{/if}
					{#if $page.data.updateBookmarkForm}
						<div class="flex items-center space-x-4">
							<Muted>Status</Muted>
							<StatusPopover data={$page.data.updateBookmarkForm} entry={$page.data.entry} />
						</div>
					{/if}
					{#if $page.data.type === 'entry'}
						{#key $page.data.entry?.id}
							<TableOfContents active="font-bold" scrollParent="html" target="#article" />
						{/key}
					{/if}
					<div class="flex items-center space-x-4">
						<Muted>Snooze</Muted>
						<!-- <StatusPopover
							data={$page.data.updateBookmarkForm}
							entry={$page.data.entry}
							/> -->
						<input type="date" name="" id="" />
					</div>
					<div class="flex items-center space-x-4">
						<Muted>Relations</Muted>
						<!-- <StatusPopover
							data={$page.data.updateBookmarkForm}
							entry={$page.data.entry}
							/> -->
						<Cluster>
							{#each $page.data.entry?.relations ?? [] as relation}
								<Relation type={relation.type} entry={relation.related_entry} />
							{/each}
						</Cluster>
					</div>
					<div class="flex flex-row space-x-4">
						<Muted class="shrink-0">Collections</Muted>
						<!-- <StatusPopover
							data={$page.data.updateBookmarkForm}
							entry={$page.data.entry}
							/> -->
						<Cluster>
							{#each $page.data.entry?.collections ?? [] as collection}
								<Badge as="a" href="/tests/collection/{collection.id}">{collection.name}</Badge>
							{/each}
							<Button
								on:click={() => {
									commander_store.open({
										component: Collections,
										placeholder: 'Add to collection...',
										props: {
											onSelect: (c) => {
												commander_store.close();
												mutation($page, 'addToCollection', {
													entryId: $page.data.entry?.id,
													collectionId: c.id
												}).then(() => {
													toast.success('Added to collection');
													invalidate('entry');
												});
											},
											onFallback: (name) => {
												commander_store.close();
												toast.promise(mutation($page, 'createCollection', {
													name,
													items: [
														{
															entryId: $page.data.entry.id
														}
													]
												}).then(() => invalidate('entry')), {
													loading: 'Creating collection...',
													success: 'Created collection and added entry',
													error: 'Failed to create collection'
												})
											}
										}
									});
								}}
								variant="ghost"
								size="sm"
							>
								<PlusIcon class="mr-2 h-4 w-4" />
								{#if !$page.data.entry?.collections.length}
									Add to collection
								{/if}
							</Button>
						</Cluster>
					</div>
					{#if $page.data.entry?.annotations?.length}
						<div class="flex items-center justify-between">
							<h3 class=" top-0 bg-card py-2 text-lg font-semibold leading-none tracking-tight">
								Notes
							</h3>
							<DropdownMenu>
								<DropdownMenuTrigger class={buttonVariants({ size: 'sm', variant: 'ghost' })}>
									<MoreHorizontalIcon class="h-4 w-4" />
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuGroup>
										<DropdownMenuItem
											on:click={() =>
												triggerDownload($page.data.entry, $page.data.entry?.annotations)}
										>
											<FileDown class="mr-2 h-4 w-4" />
											Export notes to markdown
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<div class="grid gap-4">
							{#each $page.data.entry.annotations
								.filter((a) => !!a.body || !!a.target)
								.sort((a, b) => a.start - b.start) as annotation}
								<Annotation
									{annotation}
									data={$page.data.annotationForm}
									entry={$page.data.entry}
								/>
							{/each}
						</div>
					{/if}
				</CardContent>
			</Card>
		</div>
	{:else}
		<Button
			bind:ref={button_el}
			on:click={() => ($render = true)}
			variant="outline"
			class="w-10 rounded-full p-0 {flash ? 'animate-flash' : ''}"
		>
			<InfoIcon class="h-4 w-4" />
		</Button>
		<Tooltip placement="left" ref={button_el}>Show sidebar</Tooltip>
	{/if}
</aside>
