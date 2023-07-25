<script lang="ts">
	import { preloadCode, preloadData } from '$app/navigation';
	import smoothload from '$lib/actions/smoothload';
	import type { EntryInList } from '$lib/db/selects';
	import { getId, getType, get_image, make_link } from '$lib/utils/entries';
	import clsx from 'clsx';
	import ImageSkeleton from '../ui/skeleton/ImageSkeleton.svelte';
	import { Muted, Small } from '../ui/typography';
	import { createEventDispatcher, tick } from 'svelte';
	import Progress from '../ui/Progress.svelte';
	import { receive, send } from '$lib/transitions';
	import Badge from '../ui/Badge.svelte';
	import { page } from '$app/stores';
	import { state, update_entry } from '$lib/state/entries';
	import {
		ArrowLeftRightIcon,
		CheckCircle2Icon,
		CheckIcon,
		CircleDashedIcon,
		CircleIcon,
		FileTextIcon,
		PencilIcon,
		TagIcon,
		TrendingUpIcon
	} from 'lucide-svelte';
	import HoverCard from '../ui/hover-card/HoverCard.svelte';
	import MiniAnnotation from '../MiniAnnotation.svelte';
	import { getTargetSelector } from '$lib/utils/annotations';
	import { ago, now } from '$lib/utils/date';
	import { relations_icons } from '$lib/features/relations/icons';
	import toggle_clamp from '$lib/actions/toggle-clamp';
	import Clamp from '$components/Clamp.svelte';
	import Editor from '$components/ui/editor/Editor.svelte';
	import { createContextMenu } from '@melt-ui/svelte';
	import ContextMenu from '$components/ui/context-menu/ContextMenu.svelte';
	import ContextMenuIcon from '$components/ui/context-menu/ContextMenuIcon.svelte';
	import ContextSubMenu from '$components/ui/context-menu/ContextSubMenu.svelte';
	import { statuses, statusesWithIcons, Status } from '$lib/status';
	import { contextMenuItem } from '$components/ui/context-menu/ContextMenuItem.svelte';
	import { mutation } from '$lib/queries/query';
	import { toast } from 'svelte-sonner';
	import ContextMenuCheckboxItem from '$components/ui/context-menu/ContextMenuCheckboxItem.svelte';

	export let entry: EntryInList;

	function getDomain(url: string) {
		const domain = url.replace(/https?:\/\//, '').split('/')[0];
		return domain;
	}

	const dispatch = createEventDispatcher<{
		checked: boolean;
		move: { status: Status; entries: EntryInList[] };
	}>();

	export let checked = false;

	$: href = `/tests/${getType(entry.type)}/${getId(entry)}`;

	export let out_key: Status = 'Archive';

	export async function move_entry(status: Status) {
		out_key = status;
		const { status: old_status, sort_order: old_sort_order } = entry;
		dispatch('move', { status, entries: [entry] });
		mutation($page, 'update_status', {
			ids: [entry.id],
			status
		})
			.then(() => {
				toast.success('Entry moved to ' + status, {
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

	const { trigger, menu, item, createSubMenu, createMenuRadioGroup, checkboxItem, open } =
		createContextMenu();

	const { radioGroup, radioItem, isChecked } = createMenuRadioGroup({
		value: entry.status
	});

	let anchor_el: HTMLAnchorElement;

	$: data = $state[entry.id];

	$: attachment = data?.relations?.find((r) => r.type === 'Grouped' && r.entry?.type === 'pdf');

	let tag_state_dirty = false;

	$: if (!$open && tag_state_dirty) {
        console.log(`updating tags on entry ${entry.id}`, data.tags)
		mutation($page, 'set_tags_on_entry', {
			entries: [entry.id],
			tags: data.tags ?? []
		}).then(() => {
			tag_state_dirty = false;
			toast.success('Tags updated');
		});
	}
</script>

<!-- out:send={{
			key: `${out_key.toLowerCase()}-${entry.id}`,
		}} -->
<div class="flex grow items-center gap-x-4 px-2 py-4 data-[state=open]:bg-accent" melt={$trigger}>
	<div
		class="group/select relative h-16 w-16 shrink-0 overflow-hidden rounded-md object-cover ring-offset-background group-focus-within:ring-2 group-focus-within:ring-ring group-focus-within:ring-offset-2"
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
					'relative h-16 w-16 shrink-0 overflow-hidden rounded-md object-cover',
					checked && 'invisible'
				)}
			/>
		{:else}
			<!--  -->
			<ImageSkeleton class="relative h-16 w-16 object-cover" />
		{/if}
		<div class="absolute inset-0 z-[2] h-full w-full overflow-hidden rounded-md">
			<input
				bind:checked
				type="checkbox"
				class="relative h-full w-full cursor-pointer appearance-none before:absolute before:inset-2 before:rounded-md checked:bg-input checked:!ring-0 group-hover/select:ring-8 group-hover/select:ring-inset group-hover/select:ring-ring checked:group-hover/select:bg-opacity-80"
				on:focus={() => {
					anchor_el?.focus();
				}}
			/>
		</div>
	</div>
	<div class="flex flex-col">
		<Muted class="text-xs">{entry.type}</Muted>
		<div class="flex items-center gap-x-4">
			<a
				bind:this={anchor_el}
				on:focus|once={(e) => {
					console.log('focused', e);
					console.log({ href });
					preloadData(href);
				}}
				on:focus
				on:keydown={(e) => {
					if (e.key === 'x') {
						e.preventDefault();
						e.stopPropagation();
						checked = !checked;
					}
				}}
				data-id={entry.id}
				class="line-clamp-2 font-semibold hover:underline focus:outline-none"
				{href}
				on:click
			>
				{entry.title}
			</a>
			<div class="hidden gap-x-2 sm:flex">
				{#if data?.annotations && data.annotations.length > 0}
					{@const total = data.num_annotations ? +data.num_annotations : data.annotations.length}
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
											<Editor
												class="line-clamp-2"
												content={annotation.contentData}
												options={{ editable: false }}
											/>
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
			{#if entry.author}
				<Muted class="text-xs">{entry.author}</Muted>
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
</div>

<!-- Context Menu -->
<!-- <div class="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2" melt={$menu}>
	<div class="item" melt={$item}>Bump to top</div>
	<div class="item" melt={$item}>Check for Updates...</div>
</div> -->

<ContextMenu {menu} let:ContextMenuItem>
	<ContextMenuItem
		onSelect={() => {
			// TODO: dispatch and bump to top
		}}
		{item}
		inset
	>
		<ContextMenuIcon icon={TrendingUpIcon} />
		<span>Bump to top</span>
	</ContextMenuItem>
	{#if $page.data.user_data}
		<ContextSubMenu {createSubMenu} inset>
			<ContextMenuIcon icon={TagIcon} />
			<span>Tag</span>
			<svelte:fragment slot="content">
				<!-- TODO: use virtual list component? -->
				{#await $page.data.user_data.tags}
					Loading...
				{:then tags}
					{#each tags || [] as tag}
						<ContextMenuCheckboxItem
							{checkboxItem}
							useCheckbox
							checked={!!entry.tags?.some((t) => t.id === tag.id)}
							onSelect={() => {
								// TODO: update tag
								console.log('update tag');
								// We set the state here so that the UI updates immediately
								update_entry(entry.id, {
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
							}}
						>
							{tag.name}
						</ContextMenuCheckboxItem>
					{/each}
				{/await}
			</svelte:fragment>
		</ContextSubMenu>
	{/if}
	<ContextSubMenu inset {createSubMenu}>
		<!-- Trigger Slot -->
		<ContextMenuIcon icon={CircleDashedIcon} />
		Status
		<svelte:fragment slot="content">
			<!-- TODO: Custom statuses -->
			<div melt={$radioGroup}>
				{#each statuses as status}
					<div
						{...$radioItem({
							value: status
						})}
						use:radioItem={{
							onSelect: () => {
								// TODO: move entry, update status, etc.
								move_entry(status);
							}
						}}
						class={contextMenuItem({ inset: false })}
					>
						<div class="flex shrink-0 items-center justify-center w-4 h-4 mr-0.5 -ml-2">
							{#if $isChecked(status)}
								<CheckIcon class="h-4 w-4" />
							{/if}
						</div>
						<div class="w-4 mr-2.5 flex items-center justify-center">
							<svelte:component this={statusesWithIcons[status]} class="h-3.5 w-3.5" />
						</div>
						<!--  -->
						<span class="grow inline-flex items-center truncate">{status}</span>
					</div>
				{/each}
				<!-- <ContextMenuItem inset {item}>
					<ContextMenuIcon icon={CircleDashedIcon} />
					Backlog
				</ContextMenuItem>
				<ContextMenuItem inset {item}>
					<ContextMenuIcon icon={CircleIcon} />
					Now
				</ContextMenuItem>
				<ContextMenuItem inset {item}>
					<ContextMenuIcon icon={CheckCircle2Icon} />
					Archive
				</ContextMenuItem> -->
			</div>
		</svelte:fragment>
	</ContextSubMenu>
</ContextMenu>

<style lang="postcss">
	.menu {
		@apply z-10 flex max-h-[300px] min-w-[220px] flex-col shadow-lg shadow-neutral-900/30;
		@apply rounded-md bg-white p-1 lg:max-h-none;
		@apply ring-0 !important;
	}
</style>
