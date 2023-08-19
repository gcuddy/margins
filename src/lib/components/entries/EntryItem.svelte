<script lang="ts">
	import { preloadData } from '$app/navigation';
	import { page } from '$app/stores';
	import Clamp from '$components/Clamp.svelte';
	import type ContextMenu from '$components/ui/context-menu/ContextMenu.svelte';
	import type ContextMenuCheckboxItem from '$components/ui/context-menu/ContextMenuCheckboxItem.svelte';
	import type ContextMenuIcon from '$components/ui/context-menu/ContextMenuIcon.svelte';
	import type ContextSubMenu from '$components/ui/context-menu/ContextSubMenu.svelte';
	import type ContextMenuItem from '$components/ui/context-menu/ContextMenuItem.svelte';
	import { contextMenuItem as contextMenuItemClass } from '$components/ui/context-menu/ContextMenuItem.svelte';
	import smoothload from '$lib/actions/smoothload';
	import type { EntryInList } from '$lib/db/selects';
	import { relations_icons } from '$lib/features/relations/icons';
	import { QueryOutput, mutation, query } from '$lib/queries/query';
	import { state } from '$lib/state/entries';
	import { Status, statuses, statusesWithIcons } from '$lib/status';
	import { getTargetSelector } from '$lib/utils/annotations';
	import { ago, now } from '$lib/utils/date';
	import { getId, getType, get_image, make_link } from '$lib/utils/entries';
	import { createContextMenu, melt } from '@melt-ui/svelte';
	import { VariantProps, cva } from 'class-variance-authority';
	import clsx from 'clsx';
	import {
		ArrowLeftRightIcon,
		BoxIcon,
		CheckIcon,
		CircleDashedIcon,
		FileTextIcon,
		PencilIcon,
		TagIcon,
		TrendingUpIcon
	} from 'lucide-svelte';
	import { ComponentType, createEventDispatcher, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import Badge from '../ui/Badge.svelte';
	import HoverCard from '../ui/hover-card/HoverCard.svelte';
	import ImageSkeleton from '../ui/skeleton/ImageSkeleton.svelte';
	import { Muted, Small } from '../ui/typography';
	import { render_html } from '$components/ui/editor/utils';
	import { portal } from 'svelte-portal';
	import { InfiniteData, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import type { LibraryEntry, LibraryResponse } from '$lib/server/queries';
	import { queryFactory } from '$lib/queries/querykeys';
	import { cn } from '$lib/utils/tailwind';
	import Separator from '$components/ui/Separator.svelte';

	const queryClient = useQueryClient();

	const entryItemVariants = cva('flex grow relative cursor-default focus-visible:outline-none', {
		variants: {
			view: {
				list: 'items-center gap-x-4 px-6 py-4',
				kanban:
					'item rounded-lg border bg-card text-card-foreground shadow-sm w-[350px] flex-col p-6'
			}
		},
		defaultVariants: {
			view: 'list'
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
		move: { status: Status; entries: EntryInList[] };
		reorder: { position: number; entry: EntryInList };
	}>();

	export let checked = false;

	$: href = `/tests/${getType(entry.type)}/${getId(entry)}`;

	$: tag_ids = entry.tags?.map((t) => t.id) || [];

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
			if (!data) return data;
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
		const { status: old_status, sort_order: old_sort_order } = entry;
		dispatch('move', { status, entries: [entry] });
		// optimistic update
		await update_entry({
			status
		});
		mutation($page, 'update_status', {
			ids: [entry.id],
			status
		})
			.then(() => {
				toast.success('Entry moved to ' + status, {
					// description: `<a href='/tests/library/${status.toLowerCase()}'>View ${status} entries</a>`,
					action: old_status
						? {
								label: 'Undo',
								onClick: () => {
									dispatch('move', {
										status: old_status,
										entries: [entry]
									});
									mutation($page, 'update_status', {
										ids: [entry.id],
										status: old_status,
										sort_order: old_sort_order
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
		elements: { trigger, menu, item },
		builders: { createSubmenu, createCheckboxItem, createMenuRadioGroup },
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

	$: if (data?.status) $value = data.status;
	$: attachment = data?.relations?.find((r) => r.type === 'Grouped' && r.entry?.type === 'pdf');

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

	let contextMenu: ComponentType<ContextMenu>;
	let contextMenuItem: ComponentType<ContextMenuItem>;
	let contextMenuCheckboxItem: ComponentType<ContextMenuCheckboxItem>;
	let contextMenuIcon: ComponentType<ContextMenuIcon>;
	let contextMenuSubmenu: ComponentType<ContextSubMenu>;

	onMount(async () => {
		// dynamically import context menu (to avoid jank)
		//     import ContextMenu from '$components/ui/context-menu/ContextMenu.svelte';
		// import ContextMenuCheckboxItem from '$components/ui/context-menu/ContextMenuCheckboxItem.svelte';
		// import ContextMenuIcon from '$components/ui/context-menu/ContextMenuIcon.svelte';
		// import { contextMenuItem } from '$components/ui/context-menu/ContextMenuItem.svelte';
		// import ContextSubMenu from '$components/ui/context-menu/ContextSubMenu.svelte';
		console.log(`Mounting context menu for entry ${entry.id}`);
		contextMenu = (await import('$components/ui/context-menu/ContextMenu.svelte')).default;
		contextMenuItem = (await import('$components/ui/context-menu/ContextMenuItem.svelte')).default;
		contextMenuCheckboxItem = (
			await import('$components/ui/context-menu/ContextMenuCheckboxItem.svelte')
		).default;
		contextMenuIcon = (await import('$components/ui/context-menu/ContextMenuIcon.svelte')).default;
		contextMenuSubmenu = (await import('$components/ui/context-menu/ContextSubMenu.svelte'))
			.default;
	});
</script>

<!-- out:send={{
			key: `${out_key.toLowerCase()}-${entry.id}`,
		}} -->
<a
	bind:this={anchor_el}
	{href}
	use:melt={$trigger}
	{...$$restProps}
	class="data-[state=open]:bg-accent cursor-default data-[active=true]:bg-muted/25 group/container focus-visible:outline-none overflow-hidden"
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
								//@ts-ignore
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
							anchor_el?.focus();
						}}
					/>
				</div>
			</div>
			<div class="flex flex-col">
				<Muted class="text-xs">{entry.type}</Muted>
				<div class="flex items-center gap-x-4">
					<div
						data-id={entry.id}
						class="line-clamp-2 font-semibold hover:underline focus:outline-none"
					>
						{entry.title}
					</div>
					<div class="hidden gap-x-2 sm:flex">
						{#if data?.annotations && data.annotations.length > 0}
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
												<time datetime={annotation.createdAt?.toString()}>
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
						{#if data?.relations?.length}
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
				{#if entry.wordCount}
					<Small class="text-xs">
						{entry.wordCount} words
					</Small>
				{/if}
				{#if entry.progress}
					<Small class="text-xs">
						{Math.round(entry.progress * 100)}%
					</Small>
				{/if}
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

<!-- Context Menu -->
<!-- <div class="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2" use:melt={$menu}>
	<div class="item" use:melt={$item}>Bump to top</div>
	<div class="item" use:melt={$item}>Check for Updates...</div>
</div> -->

<!-- <div use:melt={$menu}>
    <div class="item" use:melt={$item}>About Melt UI</div>
    <div class="item" use:melt={$item}>Check for Updates...</div>
</div> -->

<!-- Overlay -->
{#if $open}
	<div use:portal class="fixed inset-0" />
{/if}

<svelte:component this={contextMenu} {menu} class="w-52">
	<svelte:component
		this={contextMenuItem}
		onSelect={() => {
			// TODO: dispatch and bump to top
			console.log('bump to top');
			dispatch('reorder', {
				position: 0,
				entry
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
		{item}
		inset
	>
		<svelte:component this={contextMenuIcon} icon={TrendingUpIcon} />
		<span>Bump to top</span>
	</svelte:component>
	<svelte:component this={contextMenuSubmenu} {createSubmenu} inset>
		<svelte:component this={contextMenuIcon} icon={TagIcon} />
		<span>Tag</span>
		<svelte:fragment slot="content">
            <!-- REVIEW: is this more performant than createquery? -->
			{#await queryClient.ensureQueryData(queryFactory.tags.list()) then tags}
				{#each tags || [] as tag}
					<svelte:component
						this={contextMenuCheckboxItem}
						{createCheckboxItem}
						useCheckbox
						defaultChecked={!!entry.tags?.some((t) => t.id === tag.id)}
						onCheckedChange={({ next }) => {
							// TODO: update tag
							console.log('update tag');
							// We set the state here so that the UI updates immediately
							update_entry({
								tags: data.tags?.some((t) => t.id === tag.id)
									? data.tags?.filter((t) => t.id !== tag.id)
									: [...(data.tags || []), tag]
							});
							// We set tag_state_dirty to let the context menu know that when it closes, we should call the mutation on the server
							// TODO or should it be debounced?
							tag_state_dirty = true;

							// mutation($page, 'update_tags_on_entry', {
							//     entries: [entry.id],
							//     tags: [tag.id]
							// })
							return next;
						}}
					>
						{tag.name}
					</svelte:component>
				{/each}
			{/await}
		</svelte:fragment>
	</svelte:component>
	<svelte:component this={contextMenuSubmenu} {createSubmenu} inset>
		<svelte:component this={contextMenuIcon} icon={CircleDashedIcon} />
		Status
		<svelte:fragment slot="content">
			<div use:melt={$radioGroup}>
				{#each statuses as status}
					<div
						use:melt={$radioItem({
							value: status
						})}
						on:m-click={() => {
							// TODO: move entry, update status, etc.
							move_entry(status);
						}}
						class={contextMenuItemClass({ inset: false })}
					>
						<div class="flex shrink-0 items-center justify-center w-4 h-4 mr-0.5 -ml-2">
							{#if $isChecked(status)}
								<CheckIcon class="h-4 w-4" />
							{/if}
						</div>
						<div class="w-4 mr-2.5 flex items-center justify-center">
							<svelte:component this={statusesWithIcons[status]} class="h-3.5 w-3.5" />
						</div>
						<span class="grow inline-flex items-center truncate">{status}</span>
					</div>
				{/each}
			</div>
		</svelte:fragment>
	</svelte:component>
	<svelte:component this={contextMenuSubmenu} {createSubmenu} inset>
		<svelte:component this={contextMenuIcon} icon={BoxIcon} />
		Collections
		<svelte:fragment slot="content" let:open>
			{#await open ? query($page, 'collections', {}, { cache: true }) : []}
				Loading...
			{:then collections}
				{#each collections || [] as collection}
					{@const checked = !!data.collections?.some((c) => c.id === collection.id)}
					<svelte:component
						this={contextMenuCheckboxItem}
						{createCheckboxItem}
						useCheckbox
						defaultChecked={checked}
						onCheckedChange={({ next }) => {
							// TODO: update tag
							console.log('update collection');
							if (!checked) {
								mutation($page, 'addToCollection', {
									collectionId: collection.id,
									entryId: entry.id
								});
							} else {
								mutation($page, 'removeEntryFromCollection', {
									collectionId: collection.id,
									entryId: entry.id
								});
							}
							update_entry({
								collections: data.collections?.some((c) => c.id === collection.id)
									? data.collections?.filter((c) => c.id !== collection.id)
									: [...(data.collections || []), collection]
							});
							return next;
							// We set the state here so that the UI updates immediately
							// update_entry(entry.id, {
							// 	tags: data.tags?.some((t) => t.id === tag.id)
							// 		? data.tags?.filter((t) => t.id !== tag.id)
							// 		: [...(data.tags || []), tag]
							// });
							// We set tag_state_dirty to let the context menu know that when it closes, we should call the mutation on the server
							// TODO or should it be debounced?
							// tag_state_dirty = true;

							// mutation($page, 'update_tags_on_entry', {
							//     entries: [entry.id],
							//     tags: [tag.id]
							// })
						}}
					>
						{collection.name}
					</svelte:component>
				{/each}
			{/await}
		</svelte:fragment>
	</svelte:component>
</svelte:component>

<style lang="postcss">
	.menu {
		@apply z-10 flex max-h-[300px] min-w-[220px] flex-col shadow-lg shadow-neutral-900/30;
		@apply rounded-md bg-white p-1 lg:max-h-none;
		@apply ring-0 !important;
	}
</style>
