<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { type InfiniteData, useQueryClient } from '@tanstack/svelte-query';
	import { cva, type VariantProps } from 'class-variance-authority';
	import clsx from 'clsx';
	import {
		ArrowLeftRightIcon,
		BoxIcon,
		CheckCircle,
		CheckCircle2,
		CircleDashedIcon,
		FileTextIcon,
		PencilIcon,
		PlayCircleIcon,
		PlayIcon,
		TagIcon,
		TimerIcon,
		TrendingUpIcon,
	} from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { portal } from 'svelte-portal';
	import { toast } from 'svelte-sonner';

	import { goto, preloadData } from '$app/navigation';
	import { page } from '$app/stores';
	import { audioPlayer } from '$components/AudioPlayer.svelte';
	import Clamp from '$components/Clamp.svelte';
	import { TagColorPill } from '$components/tags/tag-color';
	import TagCommand from '$components/tags/TagCommand.svelte';
	import { Button } from '$components/ui/button';
	import * as Command from '$components/ui/command2';
	import * as ContextMenu from '$components/ui/context-menu';
	import ContextMenuIcon from '$components/ui/context-menu/ContextMenuIcon.svelte';
	import { render_html } from '$components/ui/editor/utils';
	import * as Popover from '$components/ui/popover';
	import Separator from '$components/ui/Separator.svelte';
	import * as Tooltip from '$components/ui/tooltip';
	import { defaultViewPreferences } from '$components/view-preferences';
	import smoothload from '$lib/actions/smoothload';
	import { Progress } from '$lib/components/ui/progress';
	import type { ListEntry } from '$lib/db/selects';
	import { relations_icons } from '$lib/features/relations/icons';
	import { isBrowser } from '$lib/helpers';
	import { mutation } from '$lib/queries/query';
	import type { LibraryEntry, LibraryResponse } from '$lib/server/queries';
	import { type Status, statuses, statusesWithIcons } from '$lib/status';
	import { getHostname, normalizeCamelCase } from '$lib/utils';
	import { getTargetSelector } from '$lib/utils/annotations';
	import { ago, formatDate, formatDuration, now } from '$lib/utils/date';
	import { get_image, getId, getType, make_link } from '$lib/utils/entries';
	import { cn } from '$lib/utils/tailwind';

	import Badge from '../ui/Badge.svelte';
	import HoverCard from '../ui/hover-card/HoverCard.svelte';
	import ImageSkeleton from '../ui/skeleton/ImageSkeleton.svelte';
	import { Muted, Small } from '../ui/typography';
	import EntryIcon from './EntryIcon.svelte';
	import StatusIcon from './StatusIcon.svelte';

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

	$: href = `/tests/${getType(entry.type)}/${getId(entry)}`;

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
					// description: `<a href='/tests/library/${status.toLowerCase()}'>View ${status} entries</a>`,
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

	$: attachment = data.relations.find(
		(r) => r.type === 'Grouped' && r.entry?.type === 'pdf',
	);

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
</script>

<svelte:document />

<!-- out:send={{
			key: `${out_key.toLowerCase()}-${entry.id}`,
		}} -->
<ContextMenu.Root
	bind:open={contextMenuOpen}
	portal="body"
	preventScroll={false}
>
	<ContextMenu.Trigger asChild let:builder>
		<a
			bind:this={anchor_el}
			{href}
			use:melt={builder}
			{...$$restProps}
			class="data-[state=open]:bg-accent flex flex-col h-full cursor-default data-[active=true]:bg-muted/25 group/container focus-visible:outline-none"
			data-sveltekit-preload-data="hover"
			on:focus|once={() => {
				// console.log('preloading')
				preloadData(href);
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
									class="group/select relative h-12 w-12 sm:h-16 sm:w-16 shrink-0 rounded-md object-cover ring-offset-background group-focus-within:ring-2 group-focus-within:ring-ring group-focus-within:ring-offset-2"
								>
									{#if entry.image || entry.uri}
										{@const src = entry.image?.startsWith('/')
											? $page.data.S3_BUCKET_PREFIX + entry.image.slice(1)
											: entry.image}
										<img
											style:view-transition-name="artwork-{getId(entry)}"
											use:smoothload
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
												'relative h-full w-full rounded-md object-cover border',
												checked && 'invisible',
											)}
										/>
									{:else}
										<ImageSkeleton class="relative h-16 w-16 object-cover" />
									{/if}
									{#if viewPreferences.progress && entry.progress}
										{#if entry.progress === 1 || entry.finished}
											<div class="absolute -bottom-1 -right-1">
												<CheckCircle2
													class="h-5 w-5 fill-primary text-primary-foreground"
												/>
											</div>
										{:else}
											<div
												class="absolute rounded-md w-full h-full inset-0 overflow-hidden"
											>
												<Progress
													class="absolute rounded-none bottom-0 w-full h-2 bg-secondary/90"
													value={entry.progress}
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
										class="absolute inset-0 z-[2] h-full w-full overflow-hidden rounded-md"
									>
										<!-- ring-primary if in library, ring-ring otherwise -->
										<input
											bind:checked
											type="checkbox"
											class={cn(
												'relative h-full w-full cursor-pointer appearance-none before:absolute before:inset-2 before:rounded-md checked:bg-primary checked:text-primary-foreground checked:!ring-0 group-hover/select:ring-8 group-hover/select:ring-inset checked:group-hover/select:bg-opacity-80',
												entry.status ? 'ring-primary' : 'ring-ring',
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
									Progress: {entry.progress
										? `${Math.round(entry.progress * 100)}%`
										: 'Unstarted'}
								</p>
							</Tooltip.Content>
						</Tooltip.Root>
					{/if}

					<div class="flex flex-col min-w-0 gap-0.5">
						<!-- <Muted class="text-xs">{entry.type}</Muted> -->
						<div class="flex items-center gap-x-2 min-w-0">
							{#if viewPreferences.status && entry.status}
								<StatusIcon class="h-3.5 w-3.5" status={entry.status} />
							{/if}
							{#if viewPreferences.seen && !entry.seen}
								<div class="h-3 w-3 rounded-full bg-primary"></div>
							{/if}
							<div
								data-id={entry.id}
								class="truncate font-semibold hover:underline focus:outline-none"
							>
								{title}
							</div>
							<div class="hidden gap-x-2 sm:flex">
								{#if viewPreferences.annotations && data.annotations && data.annotations.length > 0}
									{@const total = data.num_annotations
										? Number(data.num_annotations)
										: data.annotations.length}
									{@const slice = 3}
									{@const remaining = total - slice}
									<HoverCard>
										<Badge slot="trigger" variant="secondary">
											<PencilIcon class="mr-1 h-3 w-3" />
											{total}
										</Badge>
										<div
											slot="content"
											class="flex flex-col gap-2 bg-card text-card-foreground"
										>
											<span class="font-semibold tracking-tight">Notes</span>
											{#each data.annotations.slice(0, slice) as annotation}
												<div
													class="flex flex-col gap-1 rounded-lg border px-2 py-2 text-xs"
												>
													<div
														class="flex items-center gap-2 text-muted-foreground"
													>
														<span class="font-medium">
															{annotation.username}
														</span>
														<time datetime={annotation.createdAt.toString()}>
															{ago(new Date(annotation.createdAt), $now)}
														</time>
													</div>
													<div class="space-y-1 font-normal">
														{#if annotation.target}
															{@const text_quote = getTargetSelector(
																annotation.target,
																'TextQuoteSelector',
															)}
															{#if text_quote}
																<Clamp clamp={2} class="border-l px-3 italic">
																	{text_quote.exact}
																</Clamp>
																<!-- <div class="line-clamp-2 border-l px-3 italic">
                                                        {text_quote.exact}
                                                    </div> -->
															{:else}
																{JSON.stringify(annotation.target)}
															{/if}
														{/if}
														{#if annotation.body}
															<Clamp clamp={2}>
																{annotation.body}
															</Clamp>
														{:else if annotation.contentData}
															<!-- eslint-disable-next-line svelte/no-at-html-tags -->
															{@html render_html(annotation.contentData)}
															<!-- <Editor
                                                        class="line-clamp-2"
                                                        content={annotation.contentData}
                                                        options={{ editable: false }}
                                                    /> -->
														{/if}
													</div>
												</div>
											{/each}
											{#if remaining > 0}
												<div class="text-xs text-gray-500">
													+{remaining} more
												</div>
											{/if}
										</div>
									</HoverCard>
								{/if}
								{#if viewPreferences.attachment && attachment?.entry}
									<Badge as="a" href="/tests/pdf/{attachment.entry.id}">
										<FileTextIcon class="mr-1 h-3 w-3" />
										<!-- {attachment.entry.title} -->
										PDF ->
									</Badge>
								{/if}
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
											entry.type === 'article' || entry.type === 'podcast'
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
						{#if entry.type === 'podcast'}
							<!-- Play Buttn -->
							<div class="flex">
								<Button
									size="icon"
									class="h-8 w-8 rounded-full"
									variant="outline"
									on:click={(e) => {
										e.stopPropagation();
										e.preventDefault();
										audioPlayer.load(
											{
												artist: entry.author,
												entry_id: entry.id,
												image: entry.image,
												interaction_id: entry.interaction?.id,
												src: entry.uri,
												title: entry.title,
											},
											entry.progress,
											{
												onProgressUpdate(progress) {
													entry.progress = progress;
												},
											},
										);
									}}
								>
									<PlayIcon
										class="fill-accent text-accent-foreground w-6 h-6"
									/>
								</Button>
							</div>
						{:else}
							<div class="flex gap-1 items-center">
								<!-- TODO: find more sustainable solution for displayiing dot -->
								{#if viewPreferences.url && entry.uri}
									{#if entry.uri?.startsWith('http')}
										{@const hostname = getHostname(entry.uri)}
										<div class="flex items-center gap-1 truncate">
											<img
												src="https://icons.duckduckgo.com/ip3/{hostname}.ico"
												class="w-3 h-3 rounded"
												alt=""
											/>
											<Muted class="text-xs truncate"
												>{hostname.replace('www.', '')}</Muted
											>
										</div>{/if}
								{/if}
								{#if viewPreferences.author && author}
									{#if viewPreferences.url && entry.uri && entry.uri?.startsWith('http')}
										<span class="text-muted-foreground text-xs">·</span>
									{/if}

									<Muted class="text-xs truncate">{author}</Muted>
								{/if}
								{#if viewPreferences.time && entry.estimatedReadingTime}
									{#if (viewPreferences.url && entry.uri && entry.uri?.startsWith('http')) || (viewPreferences.author && author)}
										<span class="text-muted-foreground text-xs">·</span>
									{/if}
									<span class="text-muted-foreground text-xs tabular-nums">
										{#if entry.progress}
											{formatDuration(
												entry.estimatedReadingTime * (1 - entry.progress),
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
					<div class="ml-auto hidden shrink-0 items-center gap-x-1 sm:flex">
						{#if data.tags && viewPreferences.tags}
							{#if data.tags.length > 1}
								<!-- eslint-disable-next-line svelte/valid-compile -->
								<div on:click|stopPropagation|preventDefault class="md:hidden">
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
																	goto(`/tests/tag/${name}`);
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
										href="/tests/tag/{tag.name}"
										variant="outline"
									>
										<TagColorPill class="mr-1 h-2 w-2" color={tag.color} />
										{tag.name}</Badge
									>
								{/each}
							</div>
						{/if}
						{#if viewPreferences.relations && data.relations.length}
							<HoverCard>
								<Badge slot="trigger" variant="outline">
									<ArrowLeftRightIcon class="mr-1 h-3 w-3" />
									{data.relations.length}
								</Badge>
								<div
									slot="content"
									class="flex flex-col gap-2 bg-card text-card-foreground"
								>
									<span class="font-semibold tracking-tight">Relations</span>
									{#each data.relations as relation}
										{#if relation.entry}
											<a
												href={make_link(relation.entry)}
												class="flex cursor-pointer items-center gap-3 text-xs"
											>
												<svelte:component
													this={relations_icons[relation.type]}
													class="h-3 w-3 shrink-0"
												/>
                                                <!-- use:smoothload -->
												<img
													src={get_image(relation.entry)}
													class="aspect-square w-10 rounded-full object-cover"
													alt=""
												/>
												<span class="font-semibold">
													{relation.entry.title}</span
												>
											</a>
										{/if}
									{/each}
								</div>
							</HoverCard>
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
	</ContextMenu.Trigger>

	<!-- Overlay -->
	{#if contextMenuOpen}
		<div use:portal class="fixed inset-0 z-0" />
	{/if}

	<ContextMenu.Content class="w-52">
		<ContextMenu.Item
			on:click={() => {
				// TODO: dispatch and bump to top
				// console.log('bump to top');
				dispatch('reorder', {
					entry,
					position: 0,
				});
				// REVIEW should this post logic be abstracted to the parent entryList (which is what controls drag-and-drop)?
				// update_status automatically sets sort_order to top if not passed in
				if (!entry.status) {
					throw new Error('Missing status');
				}
				mutation($page, 'update_status', {
					ids: [entry.id],
					status: entry.status,
				});
			}}
			inset
		>
			<ContextMenuIcon icon={TrendingUpIcon} />
			<span>Bump to top</span>
		</ContextMenu.Item>
		<ContextMenu.Sub>
			<ContextMenu.SubTrigger inset>
				<ContextMenuIcon icon={TagIcon} />
				<span>Tag</span>
				<ContextMenu.SubContent class="w-48 p-0">
					<TagCommand
						autofocus
						bind:selectedTags={entry.tags}
						shouldMutate
						entryId={[entry.id]}
						bind:open={contextMenuOpen}
					/>
					<!-- {#await queryClient.ensureQueryData(queryFactory.tags.list()) then tags}
						{#each tags || [] as tag}
							<ContextMenu.CheckboxItem
								checked={!!entry.tags?.some((t) => t.id === tag.id)}
								onCheckedChange={(value) => {
									// We set the state here so that the UI updates immediately
									update_entry({
										tags: data.tags?.some((t) => t.id === tag.id)
											? data.tags?.filter((t) => t.id !== tag.id)
											: [...(data.tags || []), tag]
									});
									// We set tag_state_dirty to let the context menu know that when it closes, we should call the mutation on the server
									// TODO or should it be debounced?
									tag_state_dirty = true;
								}}
							>
								{tag.name}
							</ContextMenu.CheckboxItem>
						{/each}
					{/await} -->
				</ContextMenu.SubContent>
			</ContextMenu.SubTrigger>
		</ContextMenu.Sub>
		<ContextMenu.Sub>
			<ContextMenu.SubTrigger inset>
				<ContextMenuIcon icon={CircleDashedIcon} />
				Status
			</ContextMenu.SubTrigger>
			<ContextMenu.SubContent>
				<ContextMenu.RadioGroup bind:value={entry.status}>
					{#each statuses as status}
						<ContextMenu.RadioItem
							value={status}
							on:click={() => {
								// TODO: move entry, update status, etc.
								move_entry(status);
							}}
						>
							<div class="w-4 mr-2.5 flex items-center justify-center">
								<svelte:component
									this={statusesWithIcons[status]}
									class="h-3.5 w-3.5"
								/>
							</div>
							<span class="grow inline-flex items-center truncate"
								>{status}</span
							>
						</ContextMenu.RadioItem>
					{/each}
				</ContextMenu.RadioGroup>
			</ContextMenu.SubContent>
		</ContextMenu.Sub>
		<ContextMenu.Sub>
			<ContextMenu.SubTrigger>
				<ContextMenuIcon icon={BoxIcon} />
				Collections
			</ContextMenu.SubTrigger>
			<ContextMenu.SubContent>yeahahh</ContextMenu.SubContent>
		</ContextMenu.Sub>
	</ContextMenu.Content>
</ContextMenu.Root>

<style lang="postcss">
	.menu {
		@apply z-10 flex max-h-[300px] min-w-[220px] flex-col shadow-lg shadow-neutral-900/30;
		@apply rounded-md bg-white p-1 lg:max-h-none;
		@apply ring-0 !important;
	}
</style>
