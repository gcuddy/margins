<script lang="ts">
	import { page } from '$app/stores';
	import Relation from '$lib/components/Relation.svelte';
	import StatusPopover from '$lib/components/StatusPopoverForm.svelte';
// import TagPopover from '$lib/components/TagPopover.svelte';
	import TagPopover from '$components/entries/tag-popover.svelte';
	import Cluster from '$lib/components/helpers/Cluster.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Collapsible } from 'radix-svelte';

	import { CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Muted } from '$lib/components/ui/typography';
	import { TableOfContents } from '@skeletonlabs/skeleton';
	import { persisted } from 'svelte-local-storage-store';

	import { afterNavigate, invalidate } from '$app/navigation';
	import Annotation from '$components/annotations/Annotation.svelte';
	import Input from '$components/ui/Input.svelte';
	import UserAvatar from '$components/ui/avatar/UserAvatar.svelte';
	import Editor, { SaveStatus } from '$components/ui/editor/Editor.svelte';
	import {
		extractDataFromContentData,
		isJSONContent,
	} from '$components/ui/editor/utils';
	import LibraryForm from '$components/ui/library/library-form.svelte';
	import Skeleton from '$components/ui/skeleton/Skeleton.svelte';
	import {
		Tabs,
		TabsContent,
		TabsList,
		TabsTrigger,
	} from '$components/ui/tabs';
	import Collections from '$lib/commands/Collections.svelte';
	import { getCommanderContext } from '$lib/commands/GenericCommander.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuTrigger,
	} from '$lib/components/ui/dropdown-menu';
	import { isBrowser } from '$lib/helpers';
	import { mutation } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';
	import { state, update_entry } from '$lib/state/entries';
	import type { Type } from '$lib/types';
	import { check_inert, check_inside_input, getHostname } from '$lib/utils';
	import { triggerDownload } from '$lib/utils/annotations';
	import { ago, now } from '$lib/utils/date';
	import { make_link } from '$lib/utils/entries';
	import { numberOrString } from '$lib/utils/misc';
	import { defaultStringifySearch } from '$lib/utils/search-params';
	import { cn } from '$lib/utils/tailwind';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import {
		ChevronRightIcon,
		ChevronUpIcon,
		FileDown,
		FileText,
		Link2,
		MoreHorizontalIcon,
		PlusIcon,
	} from 'lucide-svelte';
	import { nanoid } from 'nanoid';
	import { getContext, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { derived, writable, type Writable } from 'svelte/store';
	import EntryIcon from './EntryIcon.svelte';
	import EntryAuthorInput from './entry-author-input.svelte';
	import { saveUrl } from './utils';

	// const render = persisted('sidebar', false);
	export let render: Writable<boolean> =
		getContext('rightSidebar') ?? writable(false);

	let flash = false;
	let prev_annotation_count: number =
		$page.data.entry?.annotations?.length ?? 0;

	const entriesQuery = createQuery(queryFactory.entries.all());

	const queryClient = useQueryClient();

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

	const jumping =
		(getContext('jumping') as Writable<boolean>) ?? writable(false);

	// REVIEW should we be debouncing this?
	const width_store =
		(getContext('rightSidebarWidth') as Writable<number>) ??
		persisted('sidebar__width', 360);

	export let width = $width_store || 360;

	const query = createQuery(
		derived(page, ($page) => ({
			...(typeof $page.params.id === 'string'
				? queryFactory.entries.detail({
						id: numberOrString($page.params.id),
						type: $page.params.type as Type,
				  })
				: {}),
			enabled: !!$page.data.entry?.id,
			// REVIEW: when using derived, it doesn't correctly infer type of select (so we have to type it manually)
			// select: (data: QueryOutput<'entry_by_id'>) => data?.entry,
			refetchOnMount: false,
		})),
	);
	$: console.log(`entry-sidebar`, { $query });
	$: outline = [];

	$: console.log({ $state });

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
		outline: true,
	});

	// "details" | "notes"
	const currentTab = persisted('sidebar_current_tab', 'details');

	$: console.log({ currentTab });

	const note_save_status = writable<SaveStatus>();
	// $: if ($value) {
	// 	currentTab.set($value);
	// 	console.log({ $value });
	// }

	const links = writable<
		{
			href: string;
			text: string;
		}[]
	>([]);

	let linkFilterValue = '';

	function generateLinks(content: string) {
		// parser
		if (!isBrowser) return;
		const parser = new DOMParser();
		const doc = parser.parseFromString(content, 'text/html');
		const _links = doc.querySelectorAll('a');
		const linksArray = Array.from(_links);
		const linksWithHref = linksArray.filter((link) => link.href);
		const linksWithHrefAndText = linksWithHref.filter(
			(link) => link.textContent,
		);
		const linksWithHrefAndTextArray = Array.from(linksWithHrefAndText);
		const uri = $query.data?.entry?.uri;
		// TODO: get selector to be able to jump to place in article
		$links = linksWithHrefAndTextArray
			.map((link) => {
				if (link.textContent) {
					// TODO: normalize url, search in db for existing entry, if exists, link to it, otherwise, link to new entry
					return {
						href: link.href,
						text: link.textContent,
					};
				}
			})
			.filter(Boolean)
			.filter((link) => {
				// make sure link is not same as current entry
				if (!uri) return true;
				const url = new URL(uri);
				const linkUrl = new URL(link.href);
				return url.pathname !== linkUrl.pathname;
			});
	}

	const linksFetching: Record<string, boolean> = {};

	$: if ($query.data?.entry?.html) generateLinks($query.data?.entry?.html);

	afterNavigate(() => {
		// generateLinks();
	});

	type Timeline = { createdAt: Date }[];
</script>

<aside
	class="flex flex-col h-full overflow-x-hidden overflow-y-auto overscroll-y-contain"
>
	<!-- 2.5rem is size of sidebar toggle -->
	<Tabs bind:value={$currentTab}>
		<div
			class="flex px-6 w-[calc(100%-2.5rem)] items-center justify-start h-[--nav-height] min-h-[--nav-height] sticky top-0 bg-background"
		>
			<TabsList class="grow">
				<TabsTrigger class="grow" value="details">Details</TabsTrigger>
				<TabsTrigger class="grow" value="notes"
					>Notes{$query.data?.entry?.annotations?.length
						? `(${$query.data?.entry?.annotations?.length})`
						: ''}</TabsTrigger
				>
				<TabsTrigger class="grow" value="timeline">Timeline</TabsTrigger>
				<TabsTrigger class="grow" value="links">Links</TabsTrigger>
			</TabsList>
		</div>
		<TabsContent value="details">
			<Collapsible.Root bind:open={$open_sections.details}>
				<CardHeader class="">
					<div class="flex items-center gap-x-2">
						<Collapsible.Trigger
							class={cn(
								buttonVariants({ variant: 'ghost', size: 'sm' }),
								'group -ml-2 transition',
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
						<div class="sidebar-row group">
							<Muted>Saved</Muted>
							<Muted class="grow">
								{#if $query.data?.entry?.bookmark?.createdAt}
									{@const datetime = new Date(
										$query.data?.entry?.bookmark?.createdAt,
									)?.toISOString()}
									<time {datetime}>
										{ago(new Date(datetime), $now)}
									</time>
								{:else}
									<span>Never</span>
								{/if}
							</Muted>
							{#if $query.data?.entry?.bookmark?.createdAt}
								<!-- <Button href="/tests/library/all?createdAt={encodeURIComponent(`=${new Date($query.data?.entry?.bookmark?.createdAt).toISOString().slice(0,10)}`)}" variant="ghost" size="sm" class="p-2">
                            <ChevronRightIcon class="h-3 w-3" />
                        </Button> -->
								<Button
									href="/tests/library/all{defaultStringifySearch({
										createdAt: {
											equals: new Date($query.data?.entry?.bookmark?.createdAt)
												.toISOString()
												.slice(0, 10),
										},
									})}"
									variant="ghost"
									class="group-hover:opacity-100 group-focus:opacity-100 opacity-0 transition-opacity p-2"
									size="sm"
								>
									<ChevronRightIcon class="h-3 w-3" />
								</Button>
							{/if}
						</div>
						{#if $query.data?.entry?.uri?.startsWith('http')}
							<div class="sidebar-row">
								<Muted>URL</Muted>
								<Muted class="truncate px-2"
									><a href={$query.data?.entry.uri} target="_blank"
										>{$query.data?.entry.uri}</a
									></Muted
								>
							</div>
						{/if}
						{#if $query.data?.entry?.uri?.startsWith('http')}
							{@const domain = getHostname($query.data?.entry.uri)}
							<div class="sidebar-row group">
								<Muted>Domain</Muted>
								<Muted class="truncate px-2"
									><a href="/tests/domain/{domain}">{domain}</a></Muted
								>
								<Button
									class="group-hover:opacity-100 group-focus:opacity-100 opacity-0 transition-opacity"
									href="/tests/library/all?domain={domain}"
									variant="ghost"
									size="sm"
								>
									<ChevronRightIcon class="h-3 w-3" />
								</Button>
							</div>
						{/if}
						{#if $query.data?.entry?.id}
							<div class="sidebar-row group">
								<Muted>Author</Muted>

								<!-- <Input variant="ghost" value={$query.data?.entry?.author} /> -->
								<EntryAuthorInput
									author={$query.data?.entry?.bookmark?.author ??
										$query.data?.entry?.author ??
										''}
									entryId={$query.data?.entry?.id}
								/>
								<Button
									class="group-hover:opacity-100 group-focus:opacity-100 opacity-0 transition-opacity"
									href="/tests/people/{$query.data?.entry?.author}"
									variant="ghost"
									size="sm"
								>
									<ChevronRightIcon class="h-3 w-3" />
								</Button>
							</div>
						{/if}
						{#if $page.data.tagForm && $query.data?.entry}
							<div class="sidebar-row">
								<Muted>Tags</Muted>
								<!-- <TagPopover data={$page.data.tagForm} entry={$query.data?.entry} /> -->
								<TagPopover
									entryId={[$query.data.entry.id]}
									selectedTags={$query.data.entry.tags}
								/>
							</div>
						{/if}
						<div class="sidebar-row group">
							<Muted>Status</Muted>
							{#if $query.isLoading}
								<Skeleton class="h-9 w-full grow" />
							{:else if $query.isSuccess}
								{@const status = $query.data?.entry?.bookmark?.status}
								<LibraryForm
									{status}
									type={$query.data.type}
									entryId={$query.data?.entry?.id}
									googleBooksId={$query.data.book?.id ?? undefined}
									podcastIndexId={$query.data.podcast?.episode?.id ?? undefined}
									spotifyId={$query.data.album?.id}
									tmdbId={$query.data.movie?.id ?? $query.data.tv?.id}
								/>
								{#if status}
									<Button
										class="group-hover:opacity-100 group-focus:opacity-100 opacity-0 transition-opacity"
										href="/tests/library/{status.toLowerCase()}"
										variant="ghost"
										size="sm"
									>
										<ChevronRightIcon class="h-3 w-3" />
									</Button>
								{/if}
							{/if}
						</div>
						{#if $page.data.updateBookmarkForm && $query.data?.entry}
							<div class="sidebar-row">
								<Muted>Status</Muted>
								<StatusPopover
									data={$page.data.updateBookmarkForm}
									entry={$query.data?.entry}
								/>
							</div>
						{/if}
						{#if $page.data.type === 'entry'}
							{#key $query.data?.entry?.id}
								<TableOfContents
									active="font-bold"
									scrollParent="html"
									target="#article"
								/>
							{/key}
						{/if}
						<!-- <div class="sidebar-row">
                    <Muted>Snooze</Muted>
                    <input type="date" name="" id="" />
                </div> -->
						<div class="sidebar-row">
							<Muted>Relations</Muted>
							<!-- <StatusPopover
                    data={$page.data.updateBookmarkForm}
                    entry={$page.data.entry}
                    /> -->
							<Cluster>
								{@const relations = $query.data?.entry?.relations?.concat(
									$query.data?.entry.back_relations,
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
								{#each $query.data?.entry?.collections ?? [] as collection}
									<Badge
										variant="secondary"
										as="a"
										class="line-clamp-2"
										href="/tests/collection/{collection.id}"
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
															entryId: $query.data?.entry?.id,
															collectionId: c.id,
														}),
														{
															loading: 'Adding to collection...',
															success: () => {
																if ($query.data?.entry?.id) {
																	update_entry($query.data?.entry.id, {
																		collections: [
																			...($query.data?.entry.collections ?? []),
																			{
																				id: c.id,
																				name: c.name,
																			},
																		],
																	});
																}
																return 'Added to collection';
															},
															error: 'Failed to add to collection',
														},
													);
												},
												onFallback: (name) => {
													commander_store.close();
													toast.promise(
														mutation($page, 'createCollection', {
															name,
															items: [
																{
																	entryId: $query.data?.entry.id,
																},
															],
														}).then(() => invalidate('entry')),
														{
															loading: 'Creating collection...',
															success: 'Created collection and added entry',
															error: 'Failed to create collection',
														},
													);
												},
											},
										});
									}}
									variant="ghost"
									size="sm"
								>
									<PlusIcon class="mr-2 h-4 w-4" />
									{#if !$query.data?.entry?.collections?.length}
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
						class={cn(
							buttonVariants({ variant: 'ghost', size: 'sm' }),
							'group -ml-2 transition',
						)}
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
		<TabsContent class="overflow-y-auto overscroll-contain" value="notes">
			{@const note = $query.data?.entry?.annotations?.find(
				(a) => a.type === 'note',
			)}
			<div class="p-6 flex flex-col gap-4">
				<div class="space-y-2">
					<h3 class=" text-lg font-semibold leading-none tracking-tight">
						Page Note
					</h3>
					{#key note?.contentData}
						<Editor
							content={note && isJSONContent(note?.contentData)
								? note.contentData
								: undefined}
							save_status={note_save_status}
							showSaveStatus="auto"
							on:blur={({ detail: { editor } }) => {
								// TODO: only do this if the content has changed

								const contentData = editor.getJSON();
								if (!$query.data?.entry) throw new Error('No data');
								const id = note?.id ?? nanoid();

								// TODO: should filing away tags and relations happen in the editor, here, or on the server?
								// It would look like this:
								const { tags, links } = extractDataFromContentData(contentData);

								note_save_status.set('Saving...');

								mutation($page, 'save_note', {
									contentData,
									entryId: $query.data?.entry.id,
									type: 'note',
									id,
									tags,
									relations: links.map((link) => ({ relatedEntryId: link.id })),
								}).then(() => {
									note_save_status.set('Saved');
								});
								update_entry($query.data?.entry.id).annotation({
									contentData,
									entryId: $query.data?.entry.id,
									type: 'note',
									id,
								});
							}}
							options={{ autofocus: false }}
						/>
					{/key}
				</div>
				<div class="flex items-center justify-between">
					<h3 class=" text-lg font-semibold leading-none tracking-tight">
						Annotations
					</h3>
					<div class="flex items-center gap-1">
						<Button
							size="sm"
							variant="ghost"
							on:click={() => (show_note_form = true)}
						>
							<PlusIcon class="h-4 w-4" />
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger
								class={buttonVariants({ size: 'sm', variant: 'ghost' })}
							>
								<MoreHorizontalIcon class="h-4 w-4" />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuGroup>
									<DropdownMenuItem
										on:click={() =>
											triggerDownload(
												$query.data?.entry,
												$query.data?.entry?.annotations,
											)}
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
					{#if $query.data?.entry?.annotations}
						{#each $query.data?.entry?.annotations
							.filter((a) => a.type !== 'note' && (!!a.body || !!a.target || !!a.contentData))
							.sort((a, b) => (a.start ?? 0) - (b.start ?? 0)) as annotation}
							<Annotation
								on:click
								{annotation}
								data={$page.data.annotationForm}
								entry={$query.data?.entry}
							/>
						{/each}
					{/if}
				</div>
			</div>
		</TabsContent>
		<TabsContent value="timeline">
			<div class="p-6">
				{#if $query.data?.entry?.bookmark}
					{@const bookmark = $query.data.entry.bookmark}
					{@const via = $query.data.entry.relations?.find(
						(r) => r.type === 'SavedFrom',
					)}
					{@const createdAt = new Date(bookmark.createdAt)}
					<div class="flex gap-4 items-center">
						<div>
							<!--  -->
							{#if bookmark.user}
								<UserAvatar class="h-5 w-5" user={bookmark.user} />
							{/if}
						</div>
						<div class="flex flex-1 min-w-0 text-xs">
							<span
								><b>{bookmark.user?.username}</b>{' '}saved the {$query.data
									.type}
								<time datetime={createdAt.toString()}
									>{ago(createdAt, $now)}</time
								>
								{#if via && via.related_entry}
									via <a href={make_link(via.related_entry)}
										>{via.related_entry?.title}</a
									>
								{/if}
							</span>
							<!-- <span class="font-semibold leading-none tracking-tighter">Saved</span>
						<span>{ago(new Date(bookmark.createdAt), new Date())}</span> -->
						</div>
					</div>
					<!-- TODO: group annotations by day, etc. -->
					<!-- <div class="flex gap-4 items-center">
					<div />
					<div class="flex flex-1 min-w-0 text-xs">
						<span
							><b>{bookmark.user?.username}</b>{' '}saved the {$query.data.type}
							{ago(new Date(bookmark.createdAt), new Date())}</span
						>
					</div>
				</div> -->
				{/if}
			</div>
		</TabsContent>
		<TabsContent value="links">
			<ul class="px-6 flex flex-col gap-y-2 text-sm">
				<Input bind:value={linkFilterValue} />
				{#each $links.filter((link) => {
					if (!linkFilterValue) return true;
					const term = link.text + ' ' + link.href;
					return term.toLowerCase().includes(linkFilterValue.toLowerCase());
				}) as link}
					{@const entry = $entriesQuery.data?.find((e) => e.uri === link.href)}
					<li class="flex items-center">
						<!-- TODO: else if entry exists show icon -->
						<Tooltip.Root>
							<Tooltip.Trigger asChild let:builder>
								<Button
									builders={[builder]}
									on:click={() => {
										if (entry) return;
										linksFetching[link.href] = true;
										saveUrl(link.href, $query.data?.entry?.id, () => {
											linksFetching[link.href] = false;
											queryClient.invalidateQueries({
												queryKey: ['entries'],
											});
										});
									}}
									disabled={!!entry ?? linksFetching[link.href]}
									variant="ghost"
									size="sm"
									class="flex items-center relative w-6 shrink-0 justify-center mr-2 group"
								>
									{#if !entry}
										<PlusIcon
											class="h-3 w-3 absolute inset-0 mx-auto my-auto shrink-0 opacity-0 group-hover:opacity-100"
										/>
									{/if}
									{#if entry}
										<EntryIcon
											class={cn(
												'h-3 w-3 absolute inset-0 mx-auto my-auto shrink-0 opacity-100',
												!entry && 'group-hover:opacity-0',
											)}
											type={entry.type}
										/>
									{:else if link.href.endsWith('pdf')}
										<FileText
											class="h-3 w-3 absolute inset-0 mx-auto my-auto shrink-0 opacity-100 group-hover:opacity-0"
										/>
									{:else}
										<Link2
											class="h-3 w-3 absolute inset-0 mx-auto my-auto shrink-0 opacity-100 group-hover:opacity-0"
										/>
									{/if}
								</Button>
							</Tooltip.Trigger>

							<Tooltip.Content>
								{#if entry}
									<p>Link already saved</p>
								{:else if link.href.endsWith('pdf')}
									<p>Save PDF</p>
								{:else}
									<p>Save Link</p>
								{/if}
							</Tooltip.Content>
						</Tooltip.Root>

						<div class="flex flex-col min-w-0">
							<span
								on:click|preventDefault|stopPropagation={() => {
									const el = document.querySelector(`a[href="${link.href}"]`);
									if (el) {
										el.scrollIntoView({ behavior: 'smooth', block: 'center' });

										el.classList.add('bg-primary');
										el.classList.add('text-primary-foreground');
										el.classList.add('rounded');
										setTimeout(() => {
											el.classList.remove('bg-primary');
											el.classList.remove('text-primary-foreground');
											el.classList.remove('rounded');
										}, 1000);
									}
								}}
								class="basis-1/2 line-clamp-2 cursor-pointer">{link.text}</span
							>
							<a href={link.href} class="truncate text-muted-foreground"
								>{link.href}</a
							>
						</div>
					</li>
				{/each}
			</ul>
		</TabsContent>
	</Tabs>
</aside>

<style lang="postcss">
	.sidebar-row {
		@apply flex min-h-[36px] items-center space-x-4;

		> :global(*:first-child) {
			@apply w-24 shrink-0;
		}

		> :global(*:nth-child(2)) {
			@apply px-2;
		}
	}
</style>
