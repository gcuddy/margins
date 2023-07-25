<script lang="ts">
	import { page } from '$app/stores';
	import Relation from '$lib/components/Relation.svelte';
	import StatusPopover from '$lib/components/StatusPopoverForm.svelte';
	import TagPopover from '$lib/components/TagPopover.svelte';
	import Cluster from '$lib/components/helpers/Cluster.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { Collapsible } from 'radix-svelte';

	import { CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Muted } from '$lib/components/ui/typography';
	import { TableOfContents } from '@skeletonlabs/skeleton';
	import { persisted } from 'svelte-local-storage-store';

	import { invalidate } from '$app/navigation';
	import ColResizer from '$components/ColResizer.svelte';
	import Collections from '$lib/commands/Collections.svelte';
	import { getCommanderContext } from '$lib/commands/GenericCommander.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/Button.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { mutation } from '$lib/queries/query';
	import { state, update_entry } from '$lib/state/entries';
	import mq from '$lib/stores/mq';
	import { check_inert } from '$lib/utils';
	import { triggerDownload } from '$lib/utils/annotations';
	import { cn } from '$lib/utils/tailwind';
	import debounce from 'just-debounce-it';
	import {
		ChevronUpIcon,
		FileDown,
		InfoIcon,
		Locate,
		MoreHorizontalIcon,
		PlusIcon,
		XIcon
	} from 'lucide-svelte';
	import { getContext, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { fade, fly } from 'svelte/transition';
	import { useMenuBar } from '../../MainNav.svelte';
	import Annotation from './[id]/Annotation.svelte';
	import NoteForm from './[id]/NoteForm.svelte';
	import Input from '$components/ui/Input.svelte';
	import type { Writable } from 'svelte/store';
	import type { PDFDocumentProxy } from 'pdfjs-dist';
	import type Pdf from './[id]/PDF.svelte';
	import NoteModal from './[id]/NoteModal.svelte';

	const render = persisted('sidebar', false);
	let flash = false;
	let prev_annotation_count: number = $page.data.entry?.annotations?.length ?? 0;

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

	let show_note_form = false;

	const width_store = persisted('sidebar__width', 360);

	export let width = $width_store || 360;

	// debounce width update and set store
	const debounced_set_width = debounce(() => {
		width_store.set(width);
	}, 250);

	$: if (width) {
		debounced_set_width();
	}

	$: data = $page.data.entry?.id ? $state[$page.data.entry.id] : undefined;
    $: outline = data?.outline;


	$: console.log({ $state });

	const mainnav = useMenuBar();

	let container: HTMLElement;

	function on_keydown(e: KeyboardEvent) {
		if (!container) return;
		if (check_inert(container)) return;
		if (e.key === 'i' && e.metaKey) {
			e.preventDefault();
			$render = !$render;
		}
	}

	const open_sections = persisted('sidebar_open_sections', {
		details: true,
		notes: true,
		outline: true
	});

    const pdf = getContext('pdf') as Writable<null | Pdf>
</script>

<svelte:window on:keydown={on_keydown} />

{#if $render && $mq.max_lg}
	<div
		transition:fade|global={{ duration: 150 }}
		aria-hidden="true"
		class="fixed inset-0 bg-background/80 backdrop-blur-sm transition-all"
	/>
{/if}
{#if $render}
	<!-- Ensure max height is 100vh minus the header size, which is currently 3.5rem -->
	<!-- When mainnav is hidden, translate up a bit to center it vertically -->
	<div
		bind:this={container}
		transition:fly={{ y: 10, duration: 200 }}
		class="sticky bottom-0 left-0 right-0 top-14 max-h-[calc(100vh-(3.5rem))] w-80 transition-transform duration-300 lg:w-[--width] {$mainnav.show
			? ''
			: '-translate-y-7'}"
		style:--width="{width}px"
	>
		<aside
			class="z-10 flex max-h-[calc(100vh-(3.5rem))] flex-col divide-y overflow-y-auto overflow-x-hidden rounded-lg border bg-card text-card-foreground shadow-sm max-lg:absolute max-lg:right-0 max-lg:top-0"
		>
			<Collapsible.Root bind:open={$open_sections.details}>
				<CardHeader class="">
					<div class="flex items-center gap-x-2">
						<Collapsible.Trigger
							class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'group -ml-2 transition')}
						>
							<CardTitle>
								Details
								<ChevronUpIcon
									class="inline h-4 w-4 transition group-data-[state='open']:rotate-180"
								/>
							</CardTitle></Collapsible.Trigger
						>

						<Button
							on:click={() => ($render = false)}
							size="sm"
							variant="ghost"
							class="absolute right-4 top-4 px-2"
						>
							<XIcon class="h-4 w-4" />
						</Button>
					</div>
				</CardHeader>
				<Collapsible.Content transition>
					<CardContent class="space-y-4">
						{#if $page.data.entry?.uri?.startsWith('http')}
							<div class="flex items-center space-x-4">
								<Muted>URL</Muted>
								<Muted class="truncate"
									><a href={$page.data.entry.uri} target="_blank">{$page.data.entry.uri}</a></Muted
								>
							</div>
						{/if}
						<div class="flex items-center space-x-4">
							<Muted>Author</Muted>

							<Input variant="ghost" value={$page.data.entry?.author} />
							<Button
								as="a"
								href="/tests/people/{$page.data.entry?.author}"
								variant="ghost"
								size="sm"
							>
								<Locate class="h-3 w-3" />
							</Button>
						</div>
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
						<!-- <div class="flex items-center space-x-4">
							<Muted>Snooze</Muted>
							<input type="date" name="" id="" />
						</div> -->
						<div class="flex items-center space-x-4">
							<Muted>Relations</Muted>
							<!-- <StatusPopover
							data={$page.data.updateBookmarkForm}
							entry={$page.data.entry}
							/> -->
							<Cluster>
								{@const relations = $page.data.entry?.relations?.concat(
									$page.data.entry.back_relations
								)}
								{#each relations ?? [] as relation}
									<Relation id={relation.id} type={relation.type} entry={relation.related_entry} />
								{/each}
							</Cluster>
						</div>
						<div class="flex flex-row items-center space-x-4">
							<Muted class="shrink-0">Collections</Muted>
							<!-- <StatusPopover
							data={$page.data.updateBookmarkForm}
							entry={$page.data.entry}
							/> -->
							<Cluster>
								{#each data?.collections ?? [] as collection}
									<Badge as="a" class="line-clamp-2" href="/tests/collection/{collection.id}"
										>{collection.name}</Badge
									>
								{/each}
								<Button
									class="h-8 text-xs [&>svg]:text-muted-foreground"
									on:click={() => {
										commander_store.open({
											component: Collections,
											placeholder: 'Add to collection...',
											props: {
												onSelect: (c) => {
													commander_store.close();
													toast.promise(
														mutation($page, 'addToCollection', {
															entryId: $page.data.entry?.id,
															collectionId: c.id
														}),
														{
															loading: 'Adding to collection...',
															success: () => {
																if (data?.id) {
																	update_entry(data.id, {
																		collections: [
																			...(data.collections ?? []),
																			{
																				id: c.id,
																				name: c.name
																			}
																		]
																	});
																}
																return 'Added to collection';
															},
															error: 'Failed to add to collection'
														}
													);
												},
												onFallback: (name) => {
													commander_store.close();
													toast.promise(
														mutation($page, 'createCollection', {
															name,
															items: [
																{
																	entryId: $page.data.entry.id
																}
															]
														}).then(() => invalidate('entry')),
														{
															loading: 'Creating collection...',
															success: 'Created collection and added entry',
															error: 'Failed to create collection'
														}
													);
												}
											}
										});
									}}
									variant="ghost"
									size="sm"
								>
									<PlusIcon class="mr-2 h-4 w-4" />
									{#if !$page.data.entry?.collections?.length}
										Add to collection
									{/if}
								</Button>
							</Cluster>
						</div>
					</CardContent>
				</Collapsible.Content>
			</Collapsible.Root>
			{#if outline && $outline?.length}
				<Collapsible.Root bind:open={$open_sections.outline}>
					<div class="p-6">
						<Collapsible.Trigger
							class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'group -ml-2 transition')}
						>
							<CardTitle>
								Outline
								<ChevronUpIcon
									class="inline h-4 w-4 transition group-data-[state='open']:rotate-180"
								/>
							</CardTitle></Collapsible.Trigger
						>
						<Collapsible.Content transition>
							<ol>
								{#each $outline as outline}
									<li>
										<a class:font-bold={outline.active} data-sveltekit-replacestate data-sveltekit-noscroll on:click={() => {
                                        }} href="#page-{outline.pageNumber}">{outline.title}</a>
									</li>
								{/each}
							</ol>
						</Collapsible.Content>
					</div>
				</Collapsible.Root>
			{/if}
				<div class="p-6">
					<div class="flex items-center justify-between">
						<h3 class=" top-0 bg-card py-2 text-lg font-semibold leading-none tracking-tight">
							Notes
						</h3>
						<div class="flex items-center gap-1">
							<Button size="xs" variant="ghost" on:click={() => (show_note_form = true)}>
								<PlusIcon class="h-4 w-4" />
							</Button>
							<DropdownMenu>
								<DropdownMenuTrigger class={buttonVariants({ size: 'xs', variant: 'ghost' })}>
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
					</div>
					<div class="grid gap-4">
						{#each data.annotations
							.filter((a) => !!a.body || !!a.target || !!a.contentData)
							.sort((a, b) => (a.start ?? 0) - (b.start ?? 0)) as annotation}
							<Annotation {annotation} data={$page.data.annotationForm} entry={$page.data.entry} />
						{/each}
					</div>
				</div>
            </aside>

		<!-- Resizer -->
		<ColResizer
			min={300}
			max={550}
			direction="w"
			class="absolute -left-1 bottom-0 top-0 z-50 w-2 cursor-col-resize after:absolute after:inset-y-0 after:left-0.5 after:w-0.5 "
			bind:width
		/>
		<!-- <div class='-left-1 absolute bottom-0 top-0 w-2 cursor-col-resize z-50 after:absolute after:inset-y-0 after:w-0.5 after:left-0.5 '></div> -->
	</div>
{/if}

{#if !$render}
	<div class="absolute right-0 top-0">
		<Button
			bind:ref={button_el}
			on:click={() => ($render = !$render)}
			variant="outline"
			class="w-10 rounded-full p-0 {flash ? 'animate-flash' : ''}"
		>
			<InfoIcon class="h-4 w-4" />
		</Button>
		<Tooltip placement="left" ref={button_el}>Show sidebar</Tooltip>
	</div>
{/if}

<NoteModal bind:isOpen={show_note_form} entry={$page.data.entry} />
