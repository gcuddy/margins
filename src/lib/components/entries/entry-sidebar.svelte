<script lang="ts">
	import { TableOfContents } from '@skeletonlabs/skeleton';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import {
		ChevronRightIcon,
		CrosshairIcon,
		FileDown,
		FileText,
		Link2,
		MoreHorizontalIcon,
		PlusIcon,
		RotateCcwIcon,
		XIcon,
	} from 'lucide-svelte';
	import { nanoid } from 'nanoid';
	import { derived, writable } from 'svelte/store';
	import { persisted } from 'svelte-local-storage-store';
	import * as Collapsible from '$components/ui/collapsible';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import AddAnnotationModal from '$components/annotations/add-annotation-input/add-annotation-modal.svelte';
	import Annotation from '$components/annotations/Annotation.svelte';
	import { audioPlayer } from '$components/AudioPlayer.svelte';
	// import TagPopover from '$lib/components/TagPopover.svelte';
	import TagPopover from '$components/entries/tag-popover.svelte';
	import * as Dialog from '$components/ui/dialog';
	import Editor, { type SaveStatus } from '$components/ui/editor/Editor.svelte';
	import {
		extractDataFromContentData,
		isJSONContent,
	} from '$components/ui/editor/utils';
	import Input from '$components/ui/input/input.svelte';
	import LibraryForm from '$components/ui/library/library-form.svelte';
	import Separator from '$components/ui/Separator.svelte';
	import Skeleton from '$components/ui/skeleton/Skeleton.svelte';
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
	import { Badge } from '$components/ui/badge';
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
	import { initUpdateBookmarkMutation } from '$lib/queries/mutations';
	import { mutation } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';
	import { update_entry } from '$lib/state/entries';
	import type { Type } from '$lib/types';
	import { getHostname } from '$lib/utils';
	import { triggerDownload } from '$lib/utils/annotations';
	import {
		ago,
		formatDate,
		formatDuration,
		normalizeTimezone,
		now,
	} from '$lib/utils/date';
	import { numberOrString } from '$lib/utils/misc';
	import {
		changeSearch,
		defaultStringifySearch,
	} from '$lib/utils/search-params';
	import { cn } from '$lib/utils/tailwind';

	import EntryAuthorInput from './entry-author-input.svelte';
	import EntryIcon from './EntryIcon.svelte';
	// import History from './history.svelte';
	import { saveUrl } from './utils';
	import { fade, fly, scale, slide } from 'svelte/transition';
	import { fadeScale, gentleFly } from '$lib/transitions';
	import OtherAlbumsList from '$components/music/other-albums-list.svelte';
	import { Icon } from '$components/icon-picker';
	import AnnotationForm from '$components/annotations/annotation-form.svelte';
	import {
		getIdKeyName,
		isMediaType,
		makeMediaSchema,
	} from '$lib/utils/entries';
	import player from '$lib/stores/player';
	import { TimestampInput } from '$components/ui/timestamp';
	import { iframeNode } from '$components/ui/editor/nodes/iframes';
	import AnnotationCard from '$components/annotations/annotation-card.svelte';
	import { CaretRight } from 'radix-icons-svelte';
	import { flip } from 'svelte/animate';
	import { filterLibrary } from '$lib/schemas/library';
	import SimilarEntries from './similar-entries.svelte';
	import AddInlineAnnotation from '$components/annotations/add-inline-annotation.svelte';

	// const render = persisted('sidebar', false);

	const entriesQuery = createQuery(queryFactory.entries.all());

	const updateBookmark = initUpdateBookmarkMutation();

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
	class="flex flex-col h-full md:h-[calc(100%-var(--audio-player-height))] overflow-x-hidden overflow-y-auto overscroll-y-contain"
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
							class="text-lg h-auto font-semibold leading-tight tracking-tight w-full resize-none bg-transparent focus:outline-none"
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
								class="group-hover:opacity-100 group-focus:opacity-100 opacity-0 transition-opacity"
								variant="ghost"
								size="sm"
								on:click={() => {
									changeSearch($page.url, {
										author,
									});
								}}
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
							class="group-hover:opacity-100 group-focus:opacity-100 opacity-0 transition-opacity"
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
								class="group-hover:opacity-100 group-focus:opacity-100 opacity-0 transition-opacity"
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
				<div class="sidebar-row">
					<Muted>Relations</Muted>
					<!-- <StatusPopover
                    data={$page.data.updateBookmarkForm}
                    entry={$page.data.entry}
                    /> -->
					<Cluster>
						{@const relations = $query.data?.entry?.relations?.concat(
							$query.data.entry.back_relations ?? [],
						)}
						{#each relations ?? [] as relation}
							{#if relation.related_entry}
								<Relation
									id={relation.id}
									type={relation.type}
									entry={relation.related_entry}
								/>
							{/if}
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
								class="line-clamp-2 rounded"
								href="/collection/{collection.id}"
							>
								<Icon
									class="mr-2 h-4 w-4"
									color={collection.color}
									icon={collection.icon}
								/>
								{collection.name}</Badge
							>
						{/each}
						<Button
							class="h-8 text-xs [&>svg]:text-muted-foreground"
							on:click={() => {
								// TODO
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
			<div class="p-6 flex flex-col gap-4">
				<Collapsible.Root
					bind:open={isPageNotesPanelOpen}
					class="space-y-2 flex flex-col"
				>
					<Collapsible.Trigger asChild let:builder>
						<div>
							<Button builders={[builder]} variant="ghost">
								<span class="font-medium text-base">Page Notes</span>
								<CaretRight
									class="h-4 w-4 ml-2 {isPageNotesPanelOpen ? 'rotate-90' : ''}"
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
									<span class="font-medium text-base">Annotations</span>
									<CaretRight
										class="h-4 w-4 ml-2 {isAnnotationsPanelOpen
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
				<Collapsible.Root open class="px-6 space-y-4">
					<Collapsible.Trigger asChild let:builder>
						<Button variant="ghost" builders={[builder]} class="group">
							<span class="font-medium text-base">Similar entries</span>
							<CaretRight
								class="h-4 w-4 ml-2 group-data-[state=open]:rotate-90"
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
			<ul class="px-6 flex flex-col gap-y-3 text-sm">
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
									class="basis-1/2 truncate cursor-pointer text-left"
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
