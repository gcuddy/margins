<script lang="ts">
	import { createContextMenu, melt } from '@melt-ui/svelte';
	import { createQuery, InfiniteData, useQueryClient } from '@tanstack/svelte-query';
	import { cva,VariantProps } from 'class-variance-authority';
	import clsx from 'clsx';
	import {
		ArrowLeftRightIcon,
		BoxIcon,
		CheckIcon,
		CircleDashedIcon,
		FileTextIcon,
		Hourglass,
		PencilIcon,
		TagIcon,
		TimerIcon,
		TrendingUpIcon
	} from 'lucide-svelte';
	import { ComponentType, createEventDispatcher, onMount } from 'svelte';
	import { portal } from 'svelte-portal';
	import { toast } from 'svelte-sonner';

	import { preloadData } from '$app/navigation';
	import { page } from '$app/stores';
	import Clamp from '$components/Clamp.svelte';
	import TagCommand from '$components/tags/TagCommand.svelte';
	import * as ContextMenu from '$components/ui/context-menu';
	import ContextMenuIcon from '$components/ui/context-menu/ContextMenuIcon.svelte';
	import { render_html } from '$components/ui/editor/utils';
	import Separator from '$components/ui/Separator.svelte';
	import smoothload from '$lib/actions/smoothload';
	import type { EntryInList } from '$lib/db/selects';
	import { relations_icons } from '$lib/features/relations/icons';
	import { mutation, query,QueryOutput } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';
	import type { LibraryEntry, LibraryResponse } from '$lib/server/queries';
	import { state } from '$lib/state/entries';
	import { Status, statuses, statusesWithIcons } from '$lib/status';
	import { getTargetSelector } from '$lib/utils/annotations';
	import { ago, formatDuration, now } from '$lib/utils/date';
	import { get_image, getId, getType, make_link } from '$lib/utils/entries';
	import { cn } from '$lib/utils/tailwind';

	import Badge from '../ui/Badge.svelte';
	import HoverCard from '../ui/hover-card/HoverCard.svelte';
	import ImageSkeleton from '../ui/skeleton/ImageSkeleton.svelte';
	import { Muted, Small } from '../ui/typography';

	const queryClient = useQueryClient();

	const entryItemVariants = cva('flex grow relative cursor-default focus-visible:outline-none', {
		defaultVariants: {
			view: 'list'
		},
		variants: {
			view: {
				kanban:
					'item rounded-lg border bg-card text-card-foreground shadow-sm w-[350px] flex-col p-6',
				list: 'items-center gap-x-4 px-6 py-4'
			}
		}
	});

	export let view: VariantProps<typeof entryItemVariants>['view'] = 'list';

	export let entry: LibraryEntry;

	// Computed
	$: author = entry.bookmark_author || entry.author;

	export let border = true;

	function getDomain(url: string) {
		const domain = url.replace(/https?:\/\//, '').split('/')[0];
		return domain;
	}

	const dispatch = createEventDispatcher<{
		checked: boolean;
		move: { entries: Array<EntryInList>, status: Status; };
		reorder: { entry: EntryInList, position: number; };
	}>();

	export let checked = false;

	$: href = `/tests/${getType(entry.type)}/${getId(entry)}`;

	$: tag_ids = entry.tags.map((t) => t.id) || [];

	export let out_key: Status = 'Archive';

	// TODO: Review - is it bad to do createquery for every component in a list?
	// const tagsQuery = createQuery(queryFactory.tags.list());

	// REVIEW should make a single generic type for state
	async function update_entry(newData: Partial<LibraryResponse['entries'][number]>) {
		// REVIEW can I get this from queryfactory?
		const queryKey = ['entries', 'list'] as const;
		await queryClient.cancelQueries({
			queryKey
		});
		const previousQueries = queryClient.getQueriesData<InfiniteData<LibraryResponse>>({
			queryKey
		});

		console.log({ previousQueries });

		// queryClient.getQueryCache().

		queryClient.setQueriesData<InfiniteData<LibraryResponse>>({ queryKey }, (data) => {
			if (!data) {return data;}
			return {
				...data,
				pages: data.pages.map((p) => {
					return {
						...p,
						entries: p.entries.map((oldEntry) => {
							if (oldEntry.id === entry.id) {
								return {
									...oldEntry,
									...newData
								};
							}
							return oldEntry;
						})
					};
				})
			};
		});

		// queryClient.
	}

	export async function move_entry(status: Status) {
		out_key = status;
		const { sort_order: old_sort_order, status: old_status } = entry;
		dispatch('move', { entries: [entry], status });
		// optimistic update
		await update_entry({
			status
		});
		mutation($page, 'update_status', {
			ids: [entry.id],
			status
		})
			.then(() => {
				toast.success(`Entry moved to ${  status}`, {
					// description: `<a href='/tests/library/${status.toLowerCase()}'>View ${status} entries</a>`,
					action: old_status
						? {
								label: 'Undo',
								onClick: () => {
									dispatch('move', {
										entries: [entry],
										status: old_status
									});
									mutation($page, 'update_status', {
										ids: [entry.id],
										sort_order: old_sort_order,
										status: old_status
									});
								}
						  }
						: undefined
				});
			})
			.catch(() => {
				// TODO: move back and display error message
			})
			.finally(() => {
				queryClient.invalidateQueries({
					queryKey: ['entries']
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

	const {
		builders: { createCheckboxItem, createMenuRadioGroup, createSubmenu },
		elements: { item, menu, trigger },
		states: { open }
	} = createContextMenu({
		defaultOpen: false
	});

	const {
		elements: { radioGroup, radioItem },
		helpers: { isChecked },
		states: { value }
	} = createMenuRadioGroup({
		defaultValue: entry.status
	});

	let anchor_el: HTMLAnchorElement;

	// ignore this lol
	$: data = entry;

	$: if (data.status) {$value = data.status;}
	$: attachment = data.relations.find((r) => r.type === 'Grouped' && r.entry?.type === 'pdf');

	let tag_state_dirty = false;

	$: if (!$open && tag_state_dirty) {
		console.log(`updating tags on entry ${entry.id}`, data.tags);
		mutation($page, 'set_tags_on_entry', {
			entries: [entry.id],
			tags: data.tags ?? []
		}).then(() => {
			tag_state_dirty = false;
			toast.success('Tags updated');
			queryClient.invalidateQueries({
				queryKey: ['entries']
			});
		});
	}

	export let contextMenuOpen = false;
	$: console.log({ contextMenuOpen });
</script>

<!-- out:send={{
			key: `${out_key.toLowerCase()}-${entry.id}`,
		}} -->
<ContextMenu.Root
	bind:open={contextMenuOpen}
	portal="body"
	positioning={{
		// strategy: "fixed"
	}}
>
	<ContextMenu.Trigger asChild let:builder>
		<a
			bind:this={anchor_el}
			{href}
			use:melt={builder}
			{...$$restProps}
			class="data-[state=open]:bg-accent cursor-default data-[active=true]:bg-muted/25 group/container focus-visible:outline-none overflow-hidden"
			data-sveltekit-preload-data="tap"
		>
			<div
				class={cn(
					entryItemVariants({ view }),
					'bg-[inherit] group-data-[active=true]/container:ring-[0.5px] ring-inset',
					checked && 'bg-primary/20 data-[active=true]:bg-primary/30'
				)}
			>
				{#if view === 'list'}
					<div
						class="group/select relative h-12 w-12 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-md object-cover ring-offset-background group-focus-within:ring-2 group-focus-within:ring-ring group-focus-within:ring-offset-2"
					>
						{#if entry.image || entry.uri}
							{@const src = entry.image?.startsWith('/')
								? $page.data.S3_BUCKET_PREFIX + entry.image.slice(1)
								: entry.image}
							<img
								use:smoothload
								src={src ?? `https://icon.horse/icon/${getDomain(entry.uri ?? '')}`}
								on:error={(e) => {
									if (entry.uri) {
										//@ts-expect-error
										e.target.src = `https://icon.horse/icon/${getDomain(entry.uri)}`;
									}
								}}
								alt=""
								class={clsx(
									'relative h-full w-full rounded-[inherit] object-cover',
									checked && 'invisible'
								)}
							/>
						{:else}
							<ImageSkeleton class="relative h-16 w-16 object-cover" />
						{/if}
						<div class="absolute inset-0 z-[2] h-full w-full overflow-hidden rounded-md">
							<input
								bind:checked
								type="checkbox"
								class="relative h-full w-full cursor-pointer appearance-none before:absolute before:inset-2 before:rounded-md checked:bg-primary checked:text-primary-foreground checked:!ring-0 group-hover/select:ring-8 group-hover/select:ring-inset group-hover/select:ring-ring checked:group-hover/select:bg-opacity-80"
								on:click|stopPropagation
								on:change
								on:focus={() => {
									anchor_el.focus();
								}}
							/>
						</div>
					</div>
					<div class="flex flex-col min-w-0">
						<Muted class="text-xs">{entry.type}</Muted>
						<div class="flex items-center gap-x-4 min-w-0">
							<div
								data-id={entry.id}
								class="truncate font-semibold hover:underline focus:outline-none"
							>
								{entry.title}
							</div>
							<div class="hidden gap-x-2 sm:flex">
								{#if data.annotations && data.annotations.length > 0}
									{@const total = data.num_annotations
										? +data.num_annotations
										: data.annotations.length}
									{@const slice = 3}
									{@const remaining = total - slice}
									<HoverCard>
										<Badge slot="trigger" variant="secondary">
											<PencilIcon class="mr-1 h-3 w-3" />
											{total}
										</Badge>
										<div slot="content" class="flex flex-col gap-2 bg-card text-card-foreground">
											<span class="font-semibold tracking-tight">Notes</span>
											{#each data.annotations.slice(0, slice) as annotation}
												<div class="flex flex-col gap-1 rounded-lg border px-2 py-2 text-xs">
													<div class="flex items-center gap-2 text-muted-foreground">
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
																'TextQuoteSelector'
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
								{#if attachment}
									<Badge as="a" href="/tests/pdf/{attachment.entry.id}">
										<FileTextIcon class="mr-1 h-3 w-3" />
										<!-- {attachment.entry.title} -->
										PDF ->
									</Badge>
								{/if}
								{#if data.relations.length}
									<HoverCard>
										<Badge slot="trigger" variant="secondary">
											<ArrowLeftRightIcon class="mr-1 h-3 w-3" />
											{data.relations.length}
										</Badge>
										<div slot="content" class="flex flex-col gap-2 bg-card text-card-foreground">
											<span class="font-semibold tracking-tight">Relations</span>
											{#each data.relations as relation}
												<a
													href={make_link(relation.entry)}
													class="flex cursor-pointer items-center gap-3 text-xs"
												>
													<svelte:component
														this={relations_icons[relation.type]}
														class="h-3 w-3 shrink-0"
													/>
													<img
														use:smoothload
														src={get_image(relation.entry)}
														class="aspect-square w-10 rounded-full object-cover"
														alt=""
													/>
													<span class="font-semibold"> {relation.entry.title}</span>
												</a>
											{/each}
										</div>
									</HoverCard>
								{/if}
							</div>
						</div>
						<div class="flex">
							{#if author}
								<Muted class="text-xs">{author}</Muted>
							{/if}
						</div>
					</div>
					<div class="ml-auto hidden shrink-0 items-center gap-x-2 md:flex">
						{#if data.tags}
							{#each data.tags as tag (tag.id)}
								<Badge class="text-xs" as="a" href="/tests/tag/{tag.name}" variant="outline"
									>{tag.name}</Badge
								>
							{/each}
						{/if}
						<div class="flex flex-col">
							{#if entry.wordCount}
								<!-- TODO: allow display changes -->
								<!-- <Small class="text-xs">
                                    {entry.wordCount} words
                                </Small> -->
							{/if}
							{#if entry.estimatedReadingTime}
								<Small class="text-xs text-muted-foreground items-center h-9 flex">
									<TimerIcon class="h-3.5 w-3.5" />
									{formatDuration(entry.estimatedReadingTime, 'm')}
								</Small>
							{/if}
							{#if entry.progress}
								<Small class="text-xs">
									{Math.round(entry.progress * 100)}%
								</Small>
							{/if}
						</div>
					</div>
				{:else if view === 'kanban'}
					<!-- for now, we use a slot -->
					<slot />
				{/if}
			</div>
			{#if border}
				<Separator class="w-full h-[0.5px] bg-border" />
			{/if}
		</a>
	</ContextMenu.Trigger>

	<!-- Overlay -->
	{#if contextMenuOpen}
		<div use:portal class="fixed inset-0 z-0" />
	{/if}

	<ContextMenu.Content class="w-52">
		<ContextMenu.Item
			on:m-click={() => {
				// TODO: dispatch and bump to top
				console.log('bump to top');
				dispatch('reorder', {
					entry,
					position: 0
				});
				// REVIEW should this post logic be abstracted to the parent entryList (which is what controls drag-and-drop)?
				// update_status automatically sets sort_order to top if not passed in
				if (!entry.status) {
					throw new Error('Missing status');
				}
				mutation($page, 'update_status', {
					ids: [entry.id],
					status: entry.status
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
							on:m-click={() => {
								// TODO: move entry, update status, etc.
								move_entry(status);
							}}
						>
							<div class="w-4 mr-2.5 flex items-center justify-center">
								<svelte:component this={statusesWithIcons[status]} class="h-3.5 w-3.5" />
							</div>
							<span class="grow inline-flex items-center truncate">{status}</span>
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
