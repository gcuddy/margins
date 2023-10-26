<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { useQueryClient, type InfiniteData } from '@tanstack/svelte-query';
	import { cva, type VariantProps } from 'class-variance-authority';
	import clsx from 'clsx';
	import { ArrowLeftRightIcon, CheckCircle2, PencilIcon } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { Play } from 'radix-icons-svelte';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { audioPlayer } from '$components/AudioPlayer.svelte';
	import { TagColorPill } from '$components/tags/tag-color';
	import { Button } from '$components/ui/button';
	import * as Command from '$components/ui/command2';
	import * as Popover from '$components/ui/popover';
	import Separator from '$components/ui/Separator.svelte';
	import * as Tooltip from '$components/ui/tooltip';
	import { defaultViewPreferences } from '$components/view-preferences';
	import { Progress } from '$lib/components/ui/progress';
	import type { ListEntry } from '$lib/db/selects';
	import { isBrowser } from '$lib/helpers';
	import { mutate, mutation } from '$lib/queries/query';
	import type { LibraryEntry, LibraryResponse } from '$lib/server/queries';
	import type { Status } from '$lib/status';
	import { getHostname, normalizeCamelCase } from '$lib/utils';
	import { formatDate, formatDuration, sortByDate } from '$lib/utils/date';
	import { getId, getType, make_link } from '$lib/utils/entries';
	import { cn } from '$lib/utils/tailwind';

	import { Badge } from '$components/ui/badge';
	import StarRating from '$components/ui/star-rating/star-rating.svelte';
	import { writable } from 'svelte/store';
	import { scale } from 'svelte/transition';
	import * as HoverCard from '../ui/hover-card';
	import ImageSkeleton from '../ui/skeleton/ImageSkeleton.svelte';
	import { Muted } from '../ui/typography';
	import EntryItemAnnotations from './entry-item-annotations.svelte';
	import EntryItemRelations from './entry-item-relations.svelte';
	import StatusIcon from './StatusIcon.svelte';
	import { optimisticUpdateLibrary } from '$lib/queries/mutations';

	const queryClient = useQueryClient();

	const entryItemVariants = cva(
		'flex grow relative cursor-default focus-visible:outline-none',
		{
			defaultVariants: {
				view: 'list',
			},
			variants: {
				view: {
					kanban:
						'item rounded-lg border bg-card text-card-foreground shadow-sm w-[350px] flex-col p-6',
					list: 'items-center gap-x-4 px-6 py-4',
				},
			},
		},
	);

	export let view: VariantProps<typeof entryItemVariants>['view'] = 'list';

	export let entry: LibraryEntry;

	export let viewPreferences = defaultViewPreferences;

	// Computed
	$: author = entry.bookmark_author || entry.author;
	$: title = entry.bookmark_title || entry.title;

	// export let border = true;

	function getDomain(url: string) {
		const domain = url.replace(/https?:\/\//, '').split('/')[0];
		return domain;
	}

	const dispatch = createEventDispatcher<{
		checked: boolean;
		move: { entries: Array<ListEntry>; status: Status };
		reorder: { entry: ListEntry; position: number };
	}>();

	export let checked = false;

	$: isBookmark = entry.type === 'bookmark';
	$: href = isBookmark ? entry.uri : `/${getType(entry.type)}/${getId(entry)}`;

	// $: tag_ids = entry.tags.map((t) => t.id) || [];

	export let out_key: Status = 'Archive';

	// TODO: Review - is it bad to do createquery for every component in a list?
	// const tagsQuery = createQuery(queryFactory.tags.list());

	// REVIEW should make a single generic type for state
	async function update_entry(
		newData: Partial<LibraryResponse['entries'][number]>,
	) {
		// REVIEW can I get this from queryfactory?
		const queryKey = ['entries', 'list'] as const;
		await queryClient.cancelQueries({
			queryKey,
		});

		// queryClient.getQueryCache().

		queryClient.setQueriesData<InfiniteData<LibraryResponse>>(
			{ queryKey },
			(data) => {
				if (!data) {
					return data;
				}
				return {
					...data,
					pages: data.pages.map((p) => {
						return {
							...p,
							entries: p.entries.map((oldEntry) => {
								if (oldEntry.id === entry.id) {
									return {
										...oldEntry,
										...newData,
									};
								}
								return oldEntry;
							}),
						};
					}),
				};
			},
		);

		// queryClient.
	}

	export async function move_entry(status: Status) {
		out_key = status;
		if (!('sort_order' in entry)) {
			return;
		}
		const { sort_order: old_sort_order, status: old_status } = entry;
		dispatch('move', { entries: [entry], status });
		// optimistic update
		await update_entry({
			status,
		});
		mutation($page, 'update_status', {
			ids: [entry.id],
			status,
		})
			.then(() => {
				toast.success(`Entry moved to ${status}`, {
					// description: `<a href='/library/${status.toLowerCase()}'>View ${status} entries</a>`,
					action: old_status
						? {
								label: 'Undo',
								onClick: () => {
									dispatch('move', {
										entries: [entry],
										status: old_status,
									});
									mutation($page, 'update_status', {
										ids: [entry.id],
										sort_order: old_sort_order ?? 0,
										status: old_status,
									});
								},
						  }
						: undefined,
				});
			})
			.catch(() => {
				// TODO: move back and display error message
			})
			.finally(() => {
				queryClient.invalidateQueries({
					queryKey: ['entries'],
				});
			});

		// toast.promise(
		// 	mutation($page, 'update_status', {
		// 		ids: [entry.id],
		// 		status
		// 	}),
		// 	{
		// 		loading: 'Moving entry...',
		// 		success: 'Entry moved!',
		// 		error: 'Failed to move entry'
		// 	}
		// );

		// await tick();
	}

	$: dispatch('checked', checked);

	let anchor_el: HTMLAnchorElement;

	// ignore this lol
	let data = entry;
	$: data = entry;

	// $: attachment = data.relations.find(
	// 	(r) => r.type === 'Grouped' && r.entry?.type === 'pdf',
	// );

	let tag_state_dirty = false;

	async function setTags() {
		if ('tags' in data) {
			await mutation($page, 'set_tags_on_entry', {
				entries: [entry.id],
				tags: data.tags ?? [],
			});
			tag_state_dirty = false;
			toast.success('Tags updated');
			queryClient.invalidateQueries({
				queryKey: ['entries'],
			});
		}
	}

	$: if (!contextMenuOpen && tag_state_dirty) {
		if ('tags' in data) {
			// eslint-disable-next-line unicorn/prefer-top-level-await
			setTags();
		}
	}

	export let contextMenuOpen = false;

	$: if (contextMenuOpen && isBrowser) {
		document?.body?.classList.add('overflow-hidden');
	} else if (isBrowser) {
		document?.body?.classList.remove('overflow-hidden');
	}

	// let mousemove_timeout: ReturnType<typeof setTimeout>;

	let relationsOpen = writable(false);
	let annotationsOpen = writable(false);

	$: sortedInteractions = sortByDate(entry.interactions, 'finished', 'asc');
	$: finished = sortedInteractions.some((i) => i.finished);
	$: lastUnfinishedInteraction = sortedInteractions.findLast(
		(i) => !i.finished,
	);
	$: progress = lastUnfinishedInteraction?.progress ?? 0;
</script>

<svelte:document />

<a
	bind:this={anchor_el}
	{href}
	target={isBookmark ? '_blank' : undefined}
	rel={isBookmark ? 'noopener noreferrer' : undefined}
	on:click={async () => {
		if (isBookmark) {
			// mutate locally
			entry.seen = true;
			const { reset } = await optimisticUpdateLibrary(queryClient, (_entry) => {
				if (entry.id !== _entry.id) return _entry;
				return {
					..._entry,
					seen: 1,
				};
			});
			mutate('userEntryInsert', {
				entryId: entry.id,
				seen: new Date(),
			}).catch(reset);
			// TODO: mark as seen
		}
	}}
	{...$$restProps}
	class="data-[state=open]:bg-accent flex flex-col h-full cursor-default data-[active=true]:bg-muted/25 group/container focus-visible:outline-none"
	data-sveltekit-preload-data="tap"
	on:focus|once={() => {
		// console.log('preloading')
		// preloadData(href);
	}}
>
	<div
		class={cn(
			entryItemVariants({ view }),
			'bg-[inherit] group-data-[active=true]/container:ring-[0.5px] ring-inset',
			checked && 'bg-primary/20 data-[active=true]:bg-primary/30',
		)}
	>
		{#if view === 'list'}
			{#if viewPreferences.image}
				<Tooltip.Root openDelay={checked ? 1000 : 300}>
					<Tooltip.Trigger asChild let:builder>
						<div
							use:melt={builder}
							class="group/select relative h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-md object-cover ring-offset-background group-focus-within:ring-2 group-focus-within:ring-ring group-focus-within:ring-offset-2"
						>
							{#if entry.image || entry.uri}
								{@const src = entry.image?.startsWith('/')
									? $page.data.S3_BUCKET_PREFIX + entry.image.slice(1)
									: entry.image}
								<!-- use:smoothload -->
								<img
									style:view-transition-name="artwork-{getId(entry)}"
									src={src ??
										`https://icon.horse/icon/${getDomain(entry.uri ?? '')}`}
									on:error={(e) => {
										if (entry.uri) {
											//@ts-expect-error - TODO: fix to avatar
											e.target.src = `https://icon.horse/icon/${getDomain(
												entry.uri,
											)}`;
										}
									}}
									alt=""
									class={clsx(
										'relative h-full w-full rounded-md object-cover',
										checked && 'invisible',
										entry.type === 'movie' && 'border',
									)}
								/>
							{:else}
								<ImageSkeleton class="relative h-16 w-16 object-cover" />
							{/if}
							{#if viewPreferences.progress && entry.interactions}
								{#if finished}
									<div class="absolute -bottom-1 -right-1">
										<CheckCircle2
											class="h-5 w-5 fill-primary text-primary-foreground"
										/>
									</div>
								{:else if lastUnfinishedInteraction}
									<div
										class="absolute rounded-md w-full h-full inset-0 overflow-hidden"
									>
										<Progress
											class="absolute rounded-none bottom-0 w-full h-2 bg-secondary/90"
											value={lastUnfinishedInteraction.progress ?? 0}
											max={1}
										/>
									</div>
								{/if}
							{/if}
							{#if viewPreferences.type}
								<!-- TODO: option to display as icon or text -->
								<!-- <Tooltip.Root>
											<Tooltip.Trigger asChild let:builder>
												<div
													use:melt={builder}
													class="absolute -left-2 transition-opacity duration-75 -top-2 rounded-full border bg-popover p-1 group-hover/select:opacity-0 {checked
														? 'opacity-0'
														: ''}"
												>
													<EntryIcon
														class="h-3 w-3 text-accent-foreground"
														type={entry.type}
													/>
													<span class="sr-only">{entry.type}</span>
												</div>
											</Tooltip.Trigger>
											<Tooltip.Content>
												<span class="text-xs text-muted-foreground"
													>{entry.type}</span
												>
											</Tooltip.Content>
										</Tooltip.Root> -->
							{/if}
							<div
								class="absolute inset-0 h-full w-full overflow-hidden rounded-md"
							>
								<!-- ring-primary if in library, ring-ring otherwise -->
								<input
									bind:checked
									type="checkbox"
									class={cn(
										'relative h-full w-full cursor-pointer appearance-none before:absolute before:inset-2 before:rounded-md checked:bg-primary checked:text-primary-foreground checked:!ring-0 group-hover/select:ring-4 group-hover/select:ring-inset checked:group-hover/select:bg-opacity-80',
										entry.status ? 'ring-blue-400' : 'ring-ring',
									)}
									on:click|stopPropagation
									on:change
									on:focus={() => {
										anchor_el.focus();
									}}
								/>
							</div>
						</div>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>
							Progress: {progress
								? `${Math.round(progress * 100)}%`
								: 'Unstarted'}
						</p>
					</Tooltip.Content>
				</Tooltip.Root>
			{/if}

			<div class="flex flex-col min-w-0 gap-0.5">
				<!-- <Muted class="text-xs">{entry.type}</Muted> -->
				<div class="flex items-center gap-x-1.5 min-w-0">
					{#if viewPreferences.seen && !entry.seen}
						<div class="h-2.5 w-2.5 rounded-full bg-primary shrink-0"></div>
					{/if}
					{#if viewPreferences.status && entry.status}
						<StatusIcon class="h-3.5 w-3.5" status={entry.status} />
					{/if}

					<!-- on:mousemove={() => {
							mousemove_timeout = setTimeout(() => {
								preloadData(href);
							}, 40);
						}}
						on:mouseleave={() => {
							clearTimeout(mousemove_timeout);
						}} -->
					<div
						data-id={entry.id}
						style:view-transition-name="title-{entry.id}"
						class="truncate font-semibold hover:underline focus:outline-none"
					>
						{@html title}
					</div>
					{#if entry.type === 'podcast'}
						<div class="flex">
							<Button
								size="icon"
								variant="ghost"
								class="h-7 w-7"
								on:click={(e) => {
									e.stopPropagation();
									e.preventDefault();
									audioPlayer.load(
										{
											artist: entry.author ?? entry.feed_title ?? '',
											entry_id: entry.id,
											image: entry.image ?? '',
											interaction_id: lastUnfinishedInteraction?.id,
											slug: make_link(entry),
											src: entry.uri ?? '',
											title: entry.title ?? '',
										},
										progress,
										{
											onProgressUpdate(_progress) {
												progress = _progress;
											},
										},
									);
								}}
							>
								<Play class=" w-4 h-4" />
							</Button>
						</div>
					{/if}

					<div class="hidden gap-x-2 sm:flex">
						{#if viewPreferences.annotations && Number(data.num_annotations)}
							<HoverCard.Root bind:open={$annotationsOpen}>
								<HoverCard.Trigger asChild let:builder>
									<div use:melt={builder}>
										<Badge variant="secondary">
											<PencilIcon class="mr-1 h-3 w-3" />
											{data.num_annotations}
										</Badge>
									</div>
								</HoverCard.Trigger>
								<HoverCard.Content>
									<div class="flex flex-col gap-2">
										<span class="font-semibold tracking-tight">Annotations</span
										>
										<EntryItemAnnotations
											enabled={annotationsOpen}
											entryId={entry.id}
										/>
									</div>
								</HoverCard.Content>
							</HoverCard.Root>
						{/if}
						<!-- {#if viewPreferences.attachment && attachment?.entry}
							<Badge as="a" href="/pdf/{attachment.entry.id}">
								<FileTextIcon class="mr-1 h-3 w-3" />
								PDF
							</Badge>
						{/if} -->
					</div>
				</div>
				{#if (viewPreferences.description && entry.summary) || (viewPreferences.date && entry.published)}
					<!-- <div class="py-px"></div> -->
					<div class="flex items-center gap-1">
						{#if viewPreferences.date && entry.published}
							<Muted
								class="text-xs text-muted-foreground/80 tabular-nums shrink-0"
								>{formatDate(
									entry.published,
									entry.type === 'article' ||
										entry.type === 'podcast' ||
										entry.type === 'video'
										? {
												day: 'numeric',
												month: 'short',
												year: '2-digit',
										  }
										: {
												year: 'numeric',
										  },
								)}</Muted
							>
						{/if}
						{#if viewPreferences.type}
							{#if viewPreferences.date && entry.published}
								<span class="text-muted-foreground/80 text-xs">·</span>
							{/if}
							<span class="text-xs text-muted-foreground/80">
								{normalizeCamelCase(entry.type)}
							</span>
						{/if}
						{#if viewPreferences.description && entry.summary}
							{#if (viewPreferences.date && entry.published) || viewPreferences.type}
								<span class="text-muted-foreground/80 text-xs">·</span>
							{/if}
							<span class="truncate text-xs text-muted-foreground">
								{entry.summary}
							</span>
						{/if}
					</div>
					<!-- <div class="py-px"></div> -->
				{/if}
				{#if false}
					<!-- Play Buttn -->
					<div class="flex">
						<Button
							size="icon"
							variant="ghost"
							on:click={(e) => {
								e.stopPropagation();
								e.preventDefault();
								audioPlayer.load(
									{
										artist: entry.author ?? '',
										entry_id: entry.id,
										image: entry.image ?? '',
										interaction_id: lastUnfinishedInteraction?.id,
										src: entry.uri ?? '',
										title: entry.title ?? '',
									},
									progress,
									{
										onProgressUpdate(progress) {
											progress = progress;
										},
									},
								);
							}}
						>
							<Play class=" w-4 h-4" />
						</Button>
					</div>
				{:else}
					<div class="flex gap-1 items-center">
						<!-- TODO: find more sustainable solution for displayiing dot -->
						{#if viewPreferences.url && entry.uri}
							{#if entry.uri?.startsWith('http')}
								{@const hostname = getHostname(entry.uri)}
								<div class="flex items-center gap-1 truncate">
									{#if !isBookmark}
										<img
											src="https://icons.duckduckgo.com/ip3/{hostname}.ico"
											class="w-3 h-3 rounded"
											alt=""
										/>
									{/if}
									<Muted class="text-xs truncate"
										>{hostname.replace('www.', '')}</Muted
									>
								</div>{/if}
						{/if}
						{#if !isBookmark && viewPreferences.author && author}
							{#if viewPreferences.url && entry.uri && entry.uri?.startsWith('http')}
								<span class="text-muted-foreground text-xs">·</span>
							{/if}

							<Muted class="text-xs truncate">{author}</Muted>
						{/if}
						{#if viewPreferences.progress && progress}
							{#if (viewPreferences.url && entry.uri && entry.uri?.startsWith('http')) || (viewPreferences.author && author)}
								<span class="text-muted-foreground text-xs">·</span>
							{/if}
							<span class="text-xs text-primary"
								>{Math.round(progress * 100)}%</span
							>
						{/if}
						{#if !isBookmark && viewPreferences.time && entry.estimatedReadingTime}
							{#if (viewPreferences.url && entry.uri && entry.uri?.startsWith('http')) || (viewPreferences.author && author) || (viewPreferences.progress && progress)}
								<span class="text-muted-foreground text-xs">·</span>
							{/if}
							<span class="text-muted-foreground text-xs tabular-nums">
								{#if progress}
									{formatDuration(
										entry.estimatedReadingTime * (1 - progress),
										'm',
									)} left
								{:else}
									{formatDuration(entry.estimatedReadingTime, 'm')}
								{/if}
							</span>
							<!-- <span
									class="text-xs text-muted-foreground tabular-nums items-center h-9 flex"
								>
									<TimerIcon class="h-3.5 w-3.5" />
									{#if entry.progress}
										{formatDuration(
											entry.estimatedReadingTime * (1 - entry.progress),
											'm',
										)} left
									{:else}
										{formatDuration(entry.estimatedReadingTime, 'm')}
									{/if}
								</span> -->
						{/if}
					</div>
				{/if}
			</div>
			<div class="ml-auto hidden shrink-0 items-center gap-x-2 sm:flex">
				{#if data.tags && viewPreferences.tags}
					{#if data.tags.length > 1}
						<div
							role="generic"
							on:keydown={() => {}}
							on:click|stopPropagation|preventDefault
							class="md:hidden"
							transition:scale
						>
							<Popover.Root
								positioning={{
									placement: 'bottom-start',
									strategy: 'fixed',
								}}
								portal="body"
							>
								<Popover.Trigger asChild let:builder>
									<div use:melt={builder}>
										<Badge class="text-xs" variant="outline">
											<div class="flex -space-x-1">
												{#each data.tags.slice(0, 3) as { color }}
													<TagColorPill
														class="h-2 w-2 border border-background"
														{color}
													/>
												{/each}
											</div>
											{data.tags.length} tags
										</Badge>
									</div>
								</Popover.Trigger>
								<Popover.Content class="w-fit p-0">
									<Command.Root>
										<Command.Input></Command.Input>
										<Command.List>
											<Command.Group>
												{#each data.tags as { color, id, name } (id)}
													<Command.Item
														onSelect={() => {
															goto(`/tag/${name}`);
														}}
													>
														<TagColorPill class="h-2 w-2 mr-2" {color} />
														{name}
													</Command.Item>
												{/each}
											</Command.Group>
										</Command.List>
									</Command.Root>
								</Popover.Content>
							</Popover.Root>
						</div>
					{/if}
					<div
						class="{data.tags.length === 1
							? ''
							: 'hidden'} md:flex gap-x-1 items-center shrink-0"
					>
						{#each data.tags as tag (tag.id)}
							<Badge
								class="text-xs"
								as="a"
								href="/tag/{tag.name}"
								variant="outline"
							>
								<TagColorPill class="mr-1 h-2 w-2" color={tag.color} />
								{tag.name}</Badge
							>
						{/each}
					</div>
				{/if}
				{#if viewPreferences.relations && Number(data.num_relations)}
					<HoverCard.Root bind:open={$relationsOpen}>
						<HoverCard.Trigger asChild let:builder>
							<div use:melt={builder}>
								<Badge variant="outline">
									<ArrowLeftRightIcon class="mr-1 h-3 w-3" />
									{data.num_relations}
								</Badge>
							</div>
						</HoverCard.Trigger>
						<HoverCard.Content>
							<div class="flex flex-col gap-2 bg-card text-card-foreground">
								<span class="font-semibold tracking-tight">Relations</span>
								<EntryItemRelations
									enabled={relationsOpen}
									entryId={entry.id}
								/>
							</div>
						</HoverCard.Content>
					</HoverCard.Root>
				{/if}
				{#if viewPreferences.rating && entry.rating}
					<div>
						<StarRating disabled class="h-3 w-3" rating={entry.rating} />
						<!-- {entry.rating} -->
					</div>
				{/if}
				{#if viewPreferences.savedAt && entry.savedAt}
					<div class="flex items-end flex-col shrink-0 min-w-[56px]">
						<Tooltip.Root>
							<Tooltip.Trigger asChild let:builder>
								<time
									use:melt={builder}
									datetime={new Date(entry.savedAt).toISOString()}
									class="text-xs tabular-nums text-muted-foreground"
								>
									{formatDate(entry.savedAt)}
								</time>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p class="text-xs">
									Saved {formatDate(entry.savedAt, {
										day: 'numeric',
										hour: 'numeric',
										minute: 'numeric',
										month: 'long',
										year: 'numeric',
									})}
								</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</div>
				{/if}
			</div>
		{:else if view === 'kanban'}
			<!-- for now, we use a slot -->
			<slot />
		{/if}
	</div>
	<Separator class="w-full h-[0.5px] bg-border" />
	<!-- {#if border}
			{/if} -->
</a>
