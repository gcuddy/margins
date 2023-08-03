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
	import { MutationInput, QueryInput, QueryOutput, mutation, qquery } from '$lib/queries/query';
	import { state, update_entry } from '$lib/state/entries';
	import mq from '$lib/stores/mq';
	import { check_inert, check_inside_input, getHostname } from '$lib/utils';
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
	import { derived, writable, type Writable } from 'svelte/store';
	import type { PDFDocumentProxy } from 'pdfjs-dist';
	import type Pdf from './[id]/PDF.svelte';
	import NoteModal from './[id]/NoteModal.svelte';
	import { TabsContent, TabsList, TabsTrigger } from '$components/ui/tabs';
	import { createTabs } from '@melt-ui/svelte';
	import { createTabsContext } from '$components/ui/tabs/utils';
	import Sheet from '$components/ui/sheet/Sheet.svelte';
	import scrollLock from '$lib/actions/scrollLock';
	import { removeScroll } from '$lib/helpers';
	import { backOut } from 'svelte/easing';
	import Editor from '$components/ui/editor/Editor.svelte';
	import {
		extractDataFromContentData,
		findNodes,
		isJSONContent
	} from '$components/ui/editor/utils';
	import { nanoid } from 'nanoid';
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import { createQueryOptions } from '$lib/queries/options';
	import type { Type } from '$lib/types';
	import { useEntry } from './[id]/query';
	import { QueryFactory, queryFactory } from '$lib/queries/querykeys';
	import { effect, typedDerived } from '@melt-ui/svelte/internal/helpers';

	// const render = persisted('sidebar', false);
	export let render: Writable<boolean> = getContext('rightSidebar') ?? writable(false);

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

	const jumping = (getContext('jumping') as Writable<boolean>) ?? writable(false);

	// REVIEW should we be debouncing this?
	const width_store =
		(getContext('rightSidebarWidth') as Writable<number>) ?? persisted('sidebar__width', 360);

	export let width = $width_store || 360;

	const saveNoteMutation = createMutation({
		mutationFn: (data: MutationInput<'save_note'>) => mutation($page, 'save_note', data)
		//    TODO: invalidate entries onsettled
	});

	$saveNoteMutation.variables;

	// debounce width update and set store
	// const debounced_set_width = debounce(() => {
	// 	width_store.set(width);
	// }, 50);

	// $: if (width) {
	// 	debounced_set_width();
	// }

	// const query = useEntry(
	// 	{
	// 		id: +$page.params.id,
	// 		type: $page.data.type as Type
	// 	},
	// 	{
	// 		select: (data) => data?.entry,
	// 		enabled: !!$page.data.entry?.id
	// 	}
	// );
	const u = effect(page, ($page) => {});

	// const query = createQuery(
	// 	derived(page, ($page) => {
	//         const filters = {
	//             id: +$page.params.id,
	//             type: $page.data.type as Type
	//         }
	// 		return {
	// 			queryKey: ['entries', 'list', { filters }] as const,
	// 			queryFn: ({ queryKey, meta }) => qquery(meta?.init, 'get_library', filters),
	// 			select: (data) => data?.entry,
	// 			enabled: !!$page.data.entry?.id,
	// 		};
	// 	})
	// );
	const query = createQuery(
		derived(page, ($page) => ({
			...queryFactory.entries.detail({
				id: Number.isInteger(+$page.params.id) ? +$page.params.id : $page.params.id,
				type: $page.params.type as Type
			}),
			enabled: !!$page.data.entry?.id,
            // REVIEW: when using derived, it doesn't correctly infer type of select (so we have to type it manually)
			select: (data: QueryOutput<"entry_by_id">) => data?.entry,
		}))
	);
	// const query = createQuery(
	// 	derived(page, ($page) => ({
	// 		...queryFactory.entries.detail({
	// 			id: Number.isInteger(+$page.params.id) ? +$page.params.id : $page.params.id,
	// 			type: $page.params.type as Type
	// 		}),
	//         enabled: !!$page.data.entry?.id,
	//         select: (data) => data?.entry
	// 	}))
	// );
	$: console.log({ $query });
	// $: data = $page.data.entry?.id ? $state[$page.data.entry.id] : undefined;
	$: outline = [];

	$: console.log({ $state });

	const mainnav = useMenuBar();

	let container: HTMLElement;

	function on_keydown(e: KeyboardEvent) {
		if (container && check_inert(container)) return;
		console.log({ e });
		if (e.target instanceof Element && check_inside_input(e.target)) return;
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

	const pdf = getContext('pdf') as Writable<null | Pdf>;

	// "details" | "notes"
	const currentTab = persisted('sidebar_current_tab', 'details');

	$: console.log({ currentTab });

	const { root, list, trigger, content, value } = createTabsContext({
		value: $currentTab ?? 'details'
	});
	$: if ($value) {
		currentTab.set($value);
		console.log({ $value });
	}

	let cleanupRemoveScroll: ReturnType<typeof removeScroll> | undefined;

	$: if ($render && $mq.max_lg) {
		// then we should set scroll lock on the body (else get rid of it)
		// position: fixed; overflow: hidden; top: -4016px; left: 0px; right: 0px; padding-right: 16px;
		cleanupRemoveScroll = removeScroll();
	} else {
		console.log('removing scroll lock');
		cleanupRemoveScroll?.();
	}
</script>

<!-- TODO: on small sizes, use dialog component to make either drawer or vaul like component -->

<svelte:window on:keydown={on_keydown} />

{#if $render && $mq.max_lg}
	<!-- <div
		transition:fade|global={{ duration: 150 }}
    aria-hidden="true"
		class="fixed inset-0 bg-background/80 backdrop-blur-sm transition-all"
	/> -->
{/if}
{#if $render}
	<!-- Ensure max height is 100vh minus the header size, which is currently 3.5rem -->
	<!-- When mainnav is hidden, translate up a bit to center it vertically -->
	<!-- style:--width="{width}px" -->

	<!-- Hidden Shadow Element -->
	<!-- <div transition:fly={{ x: $width_store, duration: 300, opacity: 1 }} class="bg-transparent z-0 w-[--right-sidebar-width] shrink-0">

        </div> -->

	<div
		bind:this={container}
		transition:fly={{ x: $width_store, duration: 300, opacity: 1 }}
		class="fixed right-0 top-0 h-screen transition-transform duration-300 lg:w-[--right-sidebar-width]"
	>
		<aside
			class="z-10 flex h-full flex-col overflow-x-hidden border-l border-r bg-card text-card-foreground max-lg:absolute max-lg:right-0 max-lg:top-0 max-sm:w-screen"
			melt={$root}
		>
			<!-- 2.5rem is size of sidebar toggle -->
			<div
				class="flex px-6 w-[calc(100%-2.5rem)] items-center justify-start h-[--nav-height] min-h-[--nav-height]"
			>
				<TabsList class="grow">
					<TabsTrigger class="grow" value="details">Details</TabsTrigger>
					<TabsTrigger class="grow" value="notes">Notes</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent value="details">
				<Collapsible.Root bind:open={$open_sections.details}>
					<CardHeader class="">
						<div class="flex items-center gap-x-2">
							<Collapsible.Trigger
								class={cn(
									buttonVariants({ variant: 'ghost', size: 'sm' }),
									'group -ml-2 transition'
								)}
							>
								<CardTitle>
									Details
									<ChevronUpIcon
										class="inline h-4 w-4 transition group-data-[state='open']:rotate-180"
									/>
								</CardTitle></Collapsible.Trigger
							>

							<!-- <Button
							on:click={() => ($render = false)}
							size="sm"
							variant="ghost"
							class="absolute right-4 top-4 px-2"
						>
							<XIcon class="h-4 w-4" />
						</Button> -->
						</div>
					</CardHeader>
					<Collapsible.Content transition>
						<CardContent class="space-y-4">
							{#if $page.data.entry?.uri?.startsWith('http')}
								<div class="flex items-center space-x-4">
									<Muted>URL</Muted>
									<Muted class="truncate"
										><a href={$page.data.entry.uri} target="_blank">{$page.data.entry.uri}</a
										></Muted
									>
								</div>
							{/if}
							{#if $page.data.entry?.uri?.startsWith('http')}
								{@const domain = getHostname($page.data.entry.uri)}
								<div class="flex items-center space-x-4">
									<Muted>Domain</Muted>
									<Muted class="truncate"><a href="/tests/domain/{domain}">{domain}</a></Muted>
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
										<Relation
											id={relation.id}
											type={relation.type}
											entry={relation.related_entry}
										/>
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
									{#each $query.data?.collections ?? [] as collection}
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
																	if ($query.data?.id) {
																		update_entry($query.data.id, {
																			collections: [
																				...($query.data.collections ?? []),
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
				</Collapsible.Root></TabsContent
			>
			{#if outline && outline?.length}
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
								{#each outline as outline}
									<li>
										<a
											class:font-bold={outline.active}
											data-sveltekit-replacestate
											data-sveltekit-noscroll
											on:click={() => {}}
											href="#page-{outline.pageNumber}">{outline.title}</a
										>
									</li>
								{/each}
							</ol>
						</Collapsible.Content>
					</div>
				</Collapsible.Root>
			{/if}
			<TabsContent class="overflow-y-auto" value="notes">
				{@const note = $query.data?.annotations?.find((a) => a.type === 'note')}
				<div class="p-6 flex flex-col gap-4">
					<div class="space-y-2">
						<h3 class=" text-lg font-semibold leading-none tracking-tight">Page Note</h3>
						{#key note?.contentData}
							<Editor
								content={note && isJSONContent(note?.contentData) ? note.contentData : undefined}
								on:blur={({ detail: { editor } }) => {
									// TODO: only do this if the content has changed

									const contentData = editor.getJSON();
									if (!$query.data) throw new Error('No data');
									const id = note?.id ?? nanoid();

									// TODO: should filing away tags and relations happen in the editor, here, or on the server?
									// It would look like this:
									const { tags, links } = extractDataFromContentData(contentData);

									mutation($page, 'save_note', {
										contentData,
										entryId: $query.data.id,
										type: 'note',
										id,
										tags,
										relations: links.map((link) => ({ relatedEntryId: link.id }))
									});
									update_entry($query.data.id).annotation({
										contentData,
										entryId: $query.data.id,
										type: 'note',
										id
									});
								}}
								options={{ autofocus: false }}
							/>
						{/key}
					</div>
					<div class="flex items-center justify-between">
						<h3 class=" text-lg font-semibold leading-none tracking-tight">Annotations</h3>
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
						{#if $query.data?.annotations}
							{#each $query.data?.annotations
								.filter((a) => a.type !== 'note' && (!!a.body || !!a.target || !!a.contentData))
								.sort((a, b) => (a.start ?? 0) - (b.start ?? 0)) as annotation}
								<Annotation
									{annotation}
									data={$page.data.annotationForm}
									entry={$page.data.entry}
								/>
							{/each}
						{/if}
					</div>
				</div>
			</TabsContent>
		</aside>

		<!-- Resizer -->
		<ColResizer
			min={300}
			max={550}
			direction="w"
			class="absolute -left-1 bottom-0 top-0 z-50 w-2 cursor-col-resize after:absolute after:inset-y-0 after:left-0.5 after:w-0.5 "
			bind:width={$width_store}
		/>
		<!-- <div class='-left-1 absolute bottom-0 top-0 w-2 cursor-col-resize z-50 after:absolute after:inset-y-0 after:w-0.5 after:left-0.5 '></div> -->
	</div>
{/if}
<!-- {:else if $mq.max_md}
        <Sheet open={render}>Testing</Sheet> -->

{#if !$render}
	<!-- <div class="absolute right-0 top-0">
		<Button
			bind:ref={button_el}
			on:click={() => ($render = !$render)}
			variant="outline"
			class="w-10 rounded-full p-0 {flash ? 'animate-flash' : ''}"
		>
			<InfoIcon class="h-4 w-4" />
		</Button>
		<Tooltip placement="left" ref={button_el}>Show sidebar</Tooltip>
	</div> -->
{/if}

<!-- <NoteModal bind:isOpen={show_note_form} entry={$page.data.entry} /> -->
