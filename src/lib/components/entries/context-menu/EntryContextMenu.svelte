<script lang="ts">
	import type { createContextMenu } from '@melt-ui/svelte';
	import ContextMenu from '$components/ui/context-menu/ContextMenu.svelte';
	import ContextMenuIcon from '$components/ui/context-menu/ContextMenuIcon.svelte';
	import ContextSubMenu from '$components/ui/context-menu/ContextSubMenu.svelte';
	import { statuses, statusesWithIcons, Status } from '$lib/status';
	import { contextMenuItem } from '$components/ui/context-menu/ContextMenuItem.svelte';
	import { mutation } from '$lib/queries/query';
	import { toast } from 'svelte-sonner';
	import ContextMenuCheckboxItem from '$components/ui/context-menu/ContextMenuCheckboxItem.svelte';
	import type { EntryInList } from '$lib/db/selects';
	import { page } from '$app/stores';
	import { CheckIcon, CircleDashedIcon, TagIcon, TrendingUpIcon } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { state, update_entry } from '$lib/state/entries';



	type ContextMenuReturn = Omit<ReturnType<typeof createContextMenu>, 'trigger'>;

	let context_menu: ContextMenuReturn;
	export { context_menu as menu };
	let { menu, item, createSubMenu, createMenuRadioGroup, checkboxItem, open } = context_menu;

	export let entry: EntryInList;

	$: data = $state[entry.id];

	const { radioGroup, radioItem, isChecked } = createMenuRadioGroup({
		value: entry.status
	});

	const dispatch = createEventDispatcher<{
		reorder: {
			position: number;
			entry: EntryInList;
		};
        move: {
            status: Status;
            entries: EntryInList[];
        }
	}>();

    let tag_state_dirty = false;

	$: if (!$open && tag_state_dirty) {
		console.log(`updating tags on entry ${entry.id}`, data.tags);
		mutation($page, 'set_tags_on_entry', {
			entries: [entry.id],
			tags: data.tags ?? []
		}).then(() => {
			tag_state_dirty = false;
			toast.success('Tags updated');
		});
	}

    export async function move_entry(status: Status) {
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

	}
</script>

<ContextMenu {menu} let:ContextMenuItem>
	<ContextMenuItem
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
