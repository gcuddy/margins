<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import AddAnnotationModal from '$components/annotations/add-annotation-input/add-annotation-modal.svelte';
	import { audioPlayer } from '$components/AudioPlayer.svelte';
	import * as Collapsible from '$components/ui/collapsible';
	import { TableOfContents } from '@skeletonlabs/skeleton';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import {
		ChevronRightIcon,
		FileDown,
		FileText,
		Link2,
		MoreHorizontalIcon,
		PlusIcon,
		RotateCcwIcon,
	} from 'lucide-svelte';
	import { persisted } from 'svelte-local-storage-store';
	import { derived, writable } from 'svelte/store';
	// import TagPopover from '$lib/components/TagPopover.svelte';
	import TagPopover from '$components/entries/tag-popover.svelte';
	import { Badge } from '$components/ui/badge';
	import { type SaveStatus } from '$components/ui/editor/Editor.svelte';
	import Input from '$components/ui/input/input.svelte';
	import LibraryForm from '$components/ui/library/library-form.svelte';
	import { Skeleton } from '$components/ui/skeleton';
	import {
		Tabs,
		TabsContent,
		TabsList,
		TabsTrigger,
	} from '$components/ui/tabs';
	import autosize from '$lib/actions/autosize';
	import Cluster from '$lib/components/helpers/Cluster.svelte';
	import Relation from '$lib/components/Relation.svelte';
	import StatusPopover from '$lib/components/StatusPopoverForm.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { CardContent, CardHeader } from '$lib/components/ui/card';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuTrigger,
	} from '$lib/components/ui/dropdown-menu';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Muted } from '$lib/components/ui/typography';
	import { isBrowser } from '$lib/helpers';
	import {
		addToCollectionMutation,
		removeFromCollectionMutation,
		initUpdateBookmarkMutation,
	} from '$lib/queries/mutations';
	import { queryFactory } from '$lib/queries/querykeys';
	import type { Type } from '$lib/types';
	import { getHostname } from '$lib/utils';
	import { triggerDownload } from '$lib/utils/annotations';
	import { ago, now } from '$lib/utils/date';
	import { numberOrString } from '$lib/utils/misc';
	import { defaultStringifySearch } from '$lib/utils/search-params';
	import { cn } from '$lib/utils/tailwind';

	import EntryAuthorInput from './entry-author-input.svelte';
	import EntryIcon from './EntryIcon.svelte';
	// import History from './history.svelte';
	import AddInlineAnnotation from '$components/annotations/add-inline-annotation.svelte';
	import AnnotationCard from '$components/annotations/annotation-card.svelte';
	import AnnotationForm from '$components/annotations/annotation-form.svelte';
	import { Icon } from '$components/icon-picker';
	import OtherAlbumsList from '$components/music/other-albums-list.svelte';
	import { Collections } from '$lib/commands';
	import { commanderStore } from '$lib/commands/GenericCommander.svelte';
	import { isMediaType, makeMediaSchema } from '$lib/utils/entries';
	import { CaretRight, Cross2 } from 'radix-icons-svelte';
	import { flip } from 'svelte/animate';
	import { fade, fly, slide } from 'svelte/transition';
	import SimilarEntries from './similar-entries.svelte';
	import { saveUrl } from './utils';

	// const render = persisted('sidebar', false);

	const entriesQuery = createQuery(queryFactory.entries.all());

	const updateBookmark = initUpdateBookmarkMutation();
	const addToCollection = addToCollectionMutation();
	const removeFromCollection = removeFromCollectionMutation();

	function handleTitleBlur(e: FocusEvent) {
		const target = e.target as HTMLTextAreaElement;
		const title = target.value;
		if (!$query.data?.entry) {
			throw new Error('No data');
		}
		if (title === $derivedTitle) {
			return;
		}
		$updateBookmark.mutate({
			data: {
				title,
			},
			entryId: $query.data.entry.id,
			id: $query.data.entry.bookmark?.id,
		});
	}

	const queryClient = useQueryClient();

	const query = createQuery(
		derived(page, ($page) => ({
			...(typeof $page.params.id === 'string'
				? queryFactory.entries.detail({
						id: numberOrString($page.params.id),
						type: $page.params.type as Type,
				  })
				: {}),
			// enabled: !!$page.data.entry?.id,
			// REVIEW: when using derived, it doesn't correctly infer type of select (so we have to type it manually)
			// select: (data: QueryOutput<'entry_by_id'>) => data?.entry,
			refetchOnMount: false,
		})),
	);

	const derivedTitle = derived(query, ($query) => {
		if (!$query.data?.entry) {
			return null;
		}
		return (
			$query.data.entry.bookmark?.title ?? $query.data.entry.title ?? 'Untitled'
		);
	});

	const hasCustomTitle = derived(query, ($query) => {
		if (!$query.data?.entry?.bookmark?.title) {
			return false;
		}
		return $query.data.entry.bookmark.title !== $query.data.entry.title;
	});

	const currentTab = persisted('sidebar_current_tab', 'details');

	const note_save_status = writable<SaveStatus>();

	const links = writable<
		Array<{
			href: string;
			html: string;
			textContent: string;
		}>
	>([]);

	let linkFilterValue = '';

	function generateLinks(content: string) {
		// parser
		if (!isBrowser) {
			return;
		}
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
					const nextText = link.nextSibling?.textContent ?? '';
					return {
						href: link.href,
						html: `<b>${link.textContent}</b> ${nextText.slice(0, 50).trim()}`,
						textContent: link.textContent,
					};
				}
			})
			.filter(Boolean)
			.filter((link) => {
				// make sure link is not same as current entry
				if (!uri) {
					return true;
				}
				const url = new URL(uri);
				const linkUrl = new URL(link.href);
				return url.pathname !== linkUrl.pathname;
			})
			.filter((link) => link.href.startsWith('http'));
	}

	const linksFetching: Record<string, boolean> = {};

	// const todayHistory = derived(query, ($query) => {
	// 	if (!$query.data?.entry?.history) {
	// 		return [];
	// 	}
	// 	const today = new Date();
	// 	return $query.data.entry.history.filter((h) => {
	// 		const historyDate = new Date(normalizeTimezone(h.createdAt));
	// 		return (
	// 			historyDate.getDate() === today.getDate() &&
	// 			historyDate.getMonth() === today.getMonth() &&
	// 			historyDate.getFullYear() === today.getFullYear()
	// 		);
	// 	});
	// });

	// const todayStatusHistoryId = derived(todayHistory, ($todayHistory) => {
	// 	if (!$todayHistory.length) {
	// 		return undefined;
	// 	}
	// 	const statusHistory = $todayHistory.find((h) => h.toStatus);
	// 	return statusHistory?.id;
	// });

	$: if ($query.data?.entry?.html) {
		generateLinks($query.data.entry.html);
	}

	afterNavigate(() => {
		// generateLinks();
	});

	let isAddAnnotationModalOpen = false;
	let isAddingPageNote = false;
	let isAddingAnnotation = false;
	let isPageNotesPanelOpen = true;
	let isAnnotationsPanelOpen = true;

	// these are types we'll show similar entries. we don't want to show similar entries for all types
	const similarEntriesTypes = ['article', 'movie', 'podcast'] as const;
</script>

<aside
	id="entry-sidebar"
	style:--audio-player-height="{$audioPlayer.height}px"
	class="flex h-full flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain md:h-[calc(100%-var(--audio-player-height))]"
>
	<!-- 2.5rem is size of sidebar toggle -->
	<Tabs bind:value={$currentTab}>
		<div
			class="sticky top-0 flex h-[--nav-height] min-h-[--nav-height] w-[calc(100%-2.5rem)] items-center justify-start bg-background px-6"
		>
			<TabsList class="grow">
				<TabsTrigger class="grow" value="details">Details</TabsTrigger>
				<TabsTrigger class="grow" value="notes"
					>Notes{$query.data?.entry?.annotations?.length
						? `(${$query.data.entry.annotations.length})`
						: ''}</TabsTrigger
				>
				<!-- {#if $query.data?.entry?.type === 'article'} -->
				<TabsTrigger class="grow" value="links">Links</TabsTrigger>
				<!-- {/if} -->
			</TabsList>
		</div>
		<TabsContent value="details">
			<CardHeader class="">
				<div class="flex items-center gap-x-2">
					{#if $query.data}
						<!-- TODO: reset button -->
						<textarea
							on:blur={handleTitleBlur}
							rows={1}
							use:autosize
							class="h-auto w-full resize-none bg-transparent text-lg font-semibold leading-tight tracking-tight focus:outline-none"
							value={$derivedTitle}
						></textarea>
						{#if $hasCustomTitle}
							<Tooltip.Root>
								<Tooltip.Trigger asChild let:builder>
									<Button
										builders={[builder]}
										on:click={() => {
											if (!$query.data?.entry) {
												return;
											}
											$updateBookmark.mutate({
												data: {
													title: null,
												},
												entryId: $query.data?.entry?.id,
												id: $query.data?.entry?.bookmark?.id,
											});
										}}
										variant="ghost"
										size="icon"
										class="h-8 w-8"
									>
										<RotateCcwIcon class="h-4 w-4 text-muted-foreground" />
										<span class="sr-only">Reset to initial title</span>
									</Button>
								</Tooltip.Trigger>
								<Tooltip.Content>
									<p>Reset to initial title</p>
								</Tooltip.Content>
							</Tooltip.Root>
						{/if}
					{:else if $query.isError}
						<Skeleton class="h-9 w-full grow" />
					{:else}
						<Skeleton class="h-9 w-full grow" />
					{/if}

					<!-- <CardTitle>
						{#if $query.data}
							{$query.data.entry?.bookmark?.title ??
								$query.data.entry?.title ??
								'Untitled'}
						{:else if $query.isError}
							<Skeleton class="h-9 w-full grow" />
						{:else}
							<Skeleton class="h-9 w-full grow" />
						{/if}
					</CardTitle> -->
				</div>
			</CardHeader>
			<CardContent class="space-y-4">
				{#if $query.data?.entry?.id}
					{@const author =
						$query.data.entry.bookmark?.author || $query.data.entry.author}
					<div class="sidebar-row group">
						<Muted>Author</Muted>

						<!-- <Input variant="ghost" value={$query.data?.entry?.author} /> -->
						<EntryAuthorInput
							author={$query.data.entry.bookmark?.author ||
								$query.data.entry.author ||
								'No author'}
							entryId={$query.data.entry.id}
						/>

						{#if author}
							<Button
								class="opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100"
								variant="ghost"
								size="sm"
								href="/library/all?author={encodeURIComponent(author)}"
							>
								<ChevronRightIcon class="h-3 w-3" />
							</Button>
						{/if}
					</div>
				{/if}
				<div class="sidebar-row group">
					<Muted>Saved</Muted>
					<Muted class="grow">
						{#if $query.data?.entry?.bookmark?.createdAt}
							<!-- we have to do this because of how the date gets transformed with our json selector in mysqle -->
							{@const datetime = new Date(
								String($query.data.entry.bookmark.createdAt).replace(
									/00$/,
									'Z',
								),
							).toISOString()}
							<time {datetime}>
								{ago(new Date(datetime), $now)}
							</time>
						{:else}
							<span>Never</span>
						{/if}
					</Muted>
					{#if $query.data?.entry?.bookmark?.createdAt}
						<!-- <Button href="/library/all?createdAt={encodeURIComponent(`=${new Date($query.data?.entry?.bookmark?.createdAt).toISOString().slice(0,10)}`)}" variant="ghost" size="sm" class="p-2">
                            <ChevronRightIcon class="h-3 w-3" />
                        </Button> -->
						<Button
							href="/library/all{defaultStringifySearch({
								createdAt: {
									equals: new Date($query.data.entry.bookmark.createdAt)
										.toISOString()
										.slice(0, 10),
								},
							})}"
							variant="ghost"
							class="p-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100"
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
							><a
								href={$query.data.entry.uri}
								target="_blank"
								rel="noopener noreferrer">{$query.data.entry.uri}</a
							></Muted
						>
					</div>
				{/if}
				{#if $query.data?.entry?.uri?.startsWith('http')}
					{@const domain = getHostname($query.data.entry.uri)}
					<div class="sidebar-row group">
						<Muted>Domain</Muted>
						<Muted class="truncate px-2"
							><a href="/domain/{domain}">{domain}</a></Muted
						>
						<Button
							class="opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100"
							href="/library/all?domain={domain}"
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
						{@const status = $query.data.entry?.bookmark?.status}
						<!-- historyId={$todayStatusHistoryId} -->
						<LibraryForm
							{status}
							type={$query.data.type}
							entryId={$query.data.entry?.id}
							googleBooksId={$query.data.book?.id ?? undefined}
							podcastIndexId={$query.data.podcast?.episode.id ?? undefined}
							spotifyId={$query.data.album?.id}
							tmdbId={$query.data.movie?.id ?? $query.data.tv?.id}
						/>
						{#if status}
							<Button
								class="opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100"
								href="/library/{status.toLowerCase()}"
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
							entry={$query.data.entry}
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
				{#if $query.data?.entry?.relations?.length}
					<div class="sidebar-row">
						<Muted>Relations</Muted>
						<!-- <StatusPopover
                    data={$page.data.updateBookmarkForm}
                    entry={$page.data.entry}
                    /> -->
						<Cluster>
							{@const relations = $query.data?.entry?.relations ?? []}
							{#each relations ?? [] as relation}
								{#if relation.entry}
									<Relation
										id={relation.id}
										type={relation.type}
										entry={relation.entry}
                                        direction={relation.direction}
									/>
								{/if}
							{/each}
						</Cluster>
					</div>
				{/if}
				<!-- Only show if collections exist. To add to a collection, you can use the entryoperations menu or Command bar. -->

				{#if $query.data?.entry?.collections?.length}
					<div class="flex flex-row items-center space-x-4">
						<Muted class="shrink-0">Collections</Muted>
						<!-- <StatusPopover
                    data={$page.data.updateBookmarkForm}
                    entry={$page.data.entry}
                    /> -->
						<Cluster class="gap-1">
							{#each $query.data?.entry?.collections ?? [] as collection}
								<Badge
									variant="secondary"
									as="a"
									class="line-clamp-2 rounded"
									href="/collection/{collection.id}"
								>
									<Icon
										class="mr-2 h-4 w-4"
										color={collection.color}
										icon={collection.icon}
									/>
									{collection.name}

									<button
										on:click|stopPropagation|preventDefault={() => {
											// TODO: alert or offer undo
											$removeFromCollection.mutate({
												collectionId: collection.id,
												entryId: $query.data?.entry?.id,
											});
										}}
										class="ml-2 rounded p-1 text-muted-foreground hover:bg-background"
									>
										<Cross2 />
									</button>
								</Badge>
							{/each}
							<Button
								class="h-8 text-xs [&>svg]:text-muted-foreground"
								on:click={() => {
									commanderStore.open({
										component: Collections,
										props: {
											onSelect(collection) {
												$addToCollection.mutate({
													collectionId: collection.id,
													entryId: $query.data?.entry?.id,
												});
												commanderStore.close();
											},
										},
									});
								}}
								variant="ghost"
								size="sm"
							>
								<PlusIcon class="h-4 w-4" />
								{#if !$query.data?.entry?.collections?.length}
									<span class="ml-2">Add to collection</span>
								{/if}
							</Button>
						</Cluster>
					</div>
				{/if}
				<!-- now a  -->
				<!-- {#if $query.data?.entry?.history}
					<Separator />
					<h3 class="tracking-tight text-base font-medium">Timeline</h3>
					<History entry={$query.data.entry} />
				{/if} -->
			</CardContent>
		</TabsContent>

		<TabsContent class="overflow-y-auto overscroll-contain" value="notes">
			{@const pageNotes = $query.data?.entry?.annotations?.filter(
				(a) => a.type === 'note',
			)}
			<div class="flex flex-col gap-4 p-6">
				<Collapsible.Root
					bind:open={isPageNotesPanelOpen}
					class="flex flex-col space-y-2"
				>
					<Collapsible.Trigger asChild let:builder>
						<div>
							<Button builders={[builder]} variant="ghost">
								<span class="text-base font-medium">Page Notes</span>
								<CaretRight
									class="ml-2 h-4 w-4 {isPageNotesPanelOpen ? 'rotate-90' : ''}"
								/>
							</Button>
						</div>
					</Collapsible.Trigger>
					<Collapsible.Content class="flex flex-col gap-4">
						{#each pageNotes ?? [] as note (note.id)}
							<div
								animate:flip={{ duration: 200 }}
								transition:slide={{ duration: 150 }}
							>
								<AnnotationCard annotation={note} />
							</div>
							<!-- <Editor
							content={note && isJSONContent(note.contentData)
								? note.contentData
								: undefined}
							save_status={note_save_status}
							showSaveStatus="auto"
							on:blur={({ detail: { editor } }) => {
								// TODO: only do this if the content has changed

								const contentData = editor.getJSON();
								if (!$query.data?.entry) {
									throw new Error('No data');
								}
								const id = note?.id ?? nanoid();

								// TODO: should filing away tags and relations happen in the editor, here, or on the server?
								// It would look like this:
								const { links, tags } = extractDataFromContentData(contentData);

								note_save_status.set('Saving...');

								mutation($page, 'save_note', {
									contentData,
									entryId: $query.data.entry.id,
									id,
									relations: links.map((link) => ({ relatedEntryId: link.id })),
									tags: tags.map((tag) => tag.id),
									type: 'note',
								}).then(() => {
									note_save_status.set('Saved');
								});
								update_entry($query.data.entry.id).annotation({
									contentData,
									entryId: $query.data.entry.id,
									id,
									type: 'note',
								});
							}}
							options={{ autofocus: false }}
						/> -->
						{/each}
						{#if isAddingPageNote}
							<div transition:fly={{ duration: 200, y: -10 }}>
								<AnnotationForm
									autofocus
									media={isMediaType($page.params.type) && $page.params.id
										? makeMediaSchema($page.params.id, $page.params.type)
										: undefined}
									entryId={$query.data?.entry?.id}
									on:cancel={() => {
										isAddingPageNote = false;
									}}
									on:save={() => {
										isAddingPageNote = false;
									}}
								/>
							</div>
						{:else}
							<div
								in:fade={{ delay: 300 }}
								class="flex items-center justify-center"
							>
								<Button
									on:click={() => {
										isAddingPageNote = true;
									}}
									class="text-muted-foreground"
									size="sm"
									variant="ghost"
								>
									<PlusIcon class="h-4 w-4" />
									Add page note</Button
								>
							</div>
						{/if}
					</Collapsible.Content>
				</Collapsible.Root>
				<Collapsible.Root
					bind:open={isAnnotationsPanelOpen}
					class="flex flex-col space-y-2"
				>
					<div class="flex items-center justify-between">
						<Collapsible.Trigger asChild let:builder>
							<div>
								<Button builders={[builder]} variant="ghost">
									<span class="text-base font-medium">Annotations</span>
									<CaretRight
										class="ml-2 h-4 w-4 {isAnnotationsPanelOpen
											? 'rotate-90'
											: ''}"
									/>
								</Button>
							</div>
						</Collapsible.Trigger>
						<div class="flex items-center gap-1">
							<DropdownMenu>
								<DropdownMenuTrigger
									class={buttonVariants({ size: 'sm', variant: 'ghost' })}
								>
									<MoreHorizontalIcon class="h-4 w-4" />
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuGroup>
										<DropdownMenuItem
											on:click={() => {
												if ($query.data?.entry) {
													triggerDownload(
														$query.data.entry,
														$query.data.entry?.annotations ?? [],
													);
												}
											}}
										>
											<FileDown class="mr-2 h-4 w-4" />
											Export notes to markdown
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					<Collapsible.Content class="grid gap-4">
						{#if $query.data?.entry?.annotations}
							{#each $query.data.entry.annotations
								.filter((a) => a.type !== 'note' && (!!a.body || !!a.target || !!a.contentData))
								.sort((a, b) => (a.start ?? 0) - (b.start ?? 0)) as annotation (annotation.id)}
								<div
									animate:flip={{ duration: 200 }}
									transition:slide={{ duration: 150 }}
								>
									<AnnotationCard {annotation} />
								</div>
								<!-- <Annotation
									on:click
									{annotation}
									data={$page.data.annotationForm}
									entry={$query.data?.entry}
								/> -->
							{/each}
						{/if}
						{#if isAddingAnnotation}
							<div transition:fly={{ duration: 200, y: 10 }}>
								<AddInlineAnnotation
									media={isMediaType($page.params.type) && $page.params.id
										? makeMediaSchema($page.params.id, $page.params.type)
										: undefined}
									entryId={$query.data?.entry?.id}
									on:cancel={() => {
										isAddingAnnotation = false;
									}}
									on:save={() => {
										isAddingAnnotation = false;
									}}
								/>
								<!-- <AnnotationForm
									autofocus
									on:cancel={() => {
										isAddingAnnotation = false;
									}}
								>
									<svelte:fragment slot="header">
										{#if $player}
											{@const player = $player.player}
                                            {@const time = player.getCurrentTime()}
											{#await time}
												...
											{:then timestamp}
												<TimestampInput
													duration={formatDuration(
														Math.floor(Number(timestamp)),
														's',
														true,
														':',
													)}
													let:updateDuration
													let:currentTimestamp
													showReset={false}
												>
													<button
														on:click={async () => {
															const time = await player.getCurrentTime();
															updateDuration(
																formatDuration(
																	Math.floor(time),
																	's',
																	true,
																	':',
																),
															);
														}}
													>
														{#if currentTimestamp}
															<CrosshairIcon
																class="h-4 w-4 text-muted-foreground"
															/>
															<span class="sr-only"> Set timestamp </span>
														{:else}
															<Button variant="ghost" size="sm">
																Set timestamp
															</Button>
														{/if}
													</button>
													{#if currentTimestamp}
														<button
															on:click={() => {
																updateDuration('');
															}}
														>
															<XIcon class="h-4 w-4 text-muted-foreground" />
															<span class="sr-only"> Clear timestamp </span>
														</button>
													{/if}
												</TimestampInput>
											{/await}
										{/if}
									</svelte:fragment>
								</AnnotationForm> -->
							</div>
						{:else}
							<div in:fade={{ delay: 250 }} class="flex justify-center">
								{#if $query.data?.entry?.type === 'movie'}
									<Button
										on:click={() => {
											isAddAnnotationModalOpen = true;
										}}
										size="sm"
										variant="ghost"
										class="text-muted-foreground"
									>
										<PlusIcon class="h-4 w-4" />
										Add annotation</Button
									>
								{:else if $query.data?.entry?.type !== 'article'}
									<Button
										on:click={() => {
											isAddingAnnotation = true;
										}}
										size="sm"
										variant="ghost"
										class="text-muted-foreground"
									>
										<PlusIcon class="h-4 w-4" />
										Add annotation</Button
									>
								{:else if !$query.data?.entry?.annotations?.length}
									<div class="py-2 text-center text-sm text-muted-foreground">
										No annotations yet.
									</div>
								{/if}
							</div>
						{/if}
					</Collapsible.Content>
				</Collapsible.Root>
			</div>
		</TabsContent>
		<!-- {#if $query.data?.entry?.type === 'article'} -->
		<TabsContent value="links">
			<!-- other entries -->
			{#if $query.data?.entry?.type && similarEntriesTypes.includes($query.data?.entry?.type)}
				<Collapsible.Root open class="space-y-4 px-6">
					<Collapsible.Trigger asChild let:builder>
						<Button variant="ghost" builders={[builder]} class="group">
							<span class="text-base font-medium">Similar entries</span>
							<CaretRight
								class="ml-2 h-4 w-4 group-data-[state=open]:rotate-90"
							/>
						</Button>
					</Collapsible.Trigger>
					<Collapsible.Content>
						{#if $query.data?.entry?.title}
							<SimilarEntries
								enabled={$currentTab === 'links'}
								title={$query.data.entry.title}
								author={$query.data.entry.author}
							/>
						{/if}
					</Collapsible.Content>
				</Collapsible.Root>
			{/if}
			<!-- <Collapsible.Root>
                <Collapsible.Trigger></Collapsible.Trigger>
            </Collapsible.Root> -->
			<ul class="flex flex-col gap-y-3 px-6 text-sm">
				{#if $query.data?.entry?.type === 'article'}
					<Input bind:value={linkFilterValue} />
					{#each $links.filter((link) => {
						if (!linkFilterValue) {
							return true;
						}
						const term = `${link.textContent} ${link.href}`;
						return term.toLowerCase().includes(linkFilterValue.toLowerCase());
					}) as link}
						{@const entry = $entriesQuery.data?.find(
							(e) => e.uri === link.href,
						)}
						<li class="flex items-center">
							<!-- TODO: else if entry exists show icon -->
							<Tooltip.Root>
								<Tooltip.Trigger asChild let:builder>
									<Button
										builders={[builder]}
										on:click={() => {
											if (entry) {
												return;
											}
											linksFetching[link.href] = true;
											saveUrl(link.href, $query.data?.entry?.id, () => {
												linksFetching[link.href] = false;
												void queryClient.invalidateQueries({
													queryKey: ['entries'],
												});
											});
										}}
										disabled={!!entry || linksFetching[link.href]}
										variant="ghost"
										size="sm"
										class="group relative mr-2 flex w-6 shrink-0 items-center justify-center"
									>
										{#if !entry}
											<PlusIcon
												class="absolute inset-0 mx-auto my-auto h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100"
											/>
										{/if}
										{#if entry}
											<EntryIcon
												class={cn(
													'absolute inset-0 mx-auto my-auto h-3 w-3 shrink-0 opacity-100',
												)}
												type={entry.type}
											/>
										{:else if link.href.endsWith('pdf')}
											<FileText
												class="absolute inset-0 mx-auto my-auto h-3 w-3 shrink-0 opacity-100 group-hover:opacity-0"
											/>
										{:else}
											<Link2
												class="absolute inset-0 mx-auto my-auto h-3 w-3 shrink-0 opacity-100 group-hover:opacity-0"
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

							<div class="flex min-w-0 flex-col">
								<button
									on:click|preventDefault|stopPropagation={() => {
										const el = document.querySelector(`a[href="${link.href}"]`);
										if (el) {
											el.scrollIntoView({
												behavior: 'smooth',
												block: 'center',
											});

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
									class="basis-1/2 cursor-pointer truncate text-left"
								>
									<!-- eslint-disable-next-line svelte/no-at-html-tags -->
									{@html link.html}</button
								>
								<a
									target="_blank"
									rel="noopener noreferrer"
									href={link.href}
									class="truncate text-muted-foreground">{link.href}</a
								>
							</div>
						</li>
					{/each}
				{:else if $query.data?.album}
					<!-- TODO: albums by this artist -->
					{#if $query.data.album.artists[0]?.id}
						<h3>Other albums by {$query.data.album.artists[0].name}</h3>
						{#key $query.data.album.id}
							<OtherAlbumsList
								filterOutIds={[$query.data.album.id]}
								spotifyArtistId={$query.data.album.artists[0].id}
							/>
						{/key}
					{/if}
				{/if}
			</ul>
		</TabsContent>
		<!-- {/if} -->
	</Tabs>
</aside>

{#if $query.data?.entry}
	<AddAnnotationModal
		entryId={$query.data?.entry?.id}
		bind:open={isAddAnnotationModalOpen}
	/>
{/if}

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
