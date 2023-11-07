<script lang="ts">
	import {
		CommandGroup,
		CommandItem,
		CommandSeparator,
		ctx,
	} from '$components/ui/command2';
	import {
		ArrowRightLeft,
		TagIcon,
		TrashIcon,
		PenSquare,
		ClipboardList,
	} from 'lucide-svelte';
	import {
		Circle,
		Group,
		Half2,
		CardStackPlus,
		ClipboardCopy,
	} from 'radix-icons-svelte';
	import { derived, writable } from 'svelte/store';
	import Tags from './Tags.svelte';
	import alertDialogStore from '$lib/stores/alert-dialog';
	import AnnotationForm from '$components/annotations/annotation-form.svelte';
	import {
		checkedEntries,
		checkedEntryIds,
	} from '$components/entries/multi-select';
	import { createEventDispatcher } from 'svelte';
	import { statusesToDisplay, statusesWithIcons } from '$lib/status';
	import { objectEntries } from '$lib/helpers';
	import { checkedTagsState, entryState } from '$lib/stores/entry-state';
	import { mutate } from '$lib/queries/query';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { invalidateEntries } from '$lib/queries/mutations';
	import { StatusCommands, Entries, Collections } from '.';
	import { toast } from 'svelte-sonner';
	import { make_url } from '$lib/utils/entries';

	export let entryIds: number[] = [];
	export let open = false;
	export let inPage = false;
	export let shouldFilter = writable(true);

	const pages = writable<string[]>([]);
	const activePage = derived(pages, ($pages) => $pages[$pages.length - 1]);
	const isHome = derived(activePage, ($activePage) => !$activePage);

	const {
		state: { placeholder },
	} = ctx.get();

	const dispatch = createEventDispatcher();

	$: if ($activePage !== undefined) {
		inPage = true;
		shouldFilter.set(true);
	} else {
		inPage = false;
	}


	$: console.log({ $shouldFilter });

	const queryClient = useQueryClient();

	const addPage = (page: string, _placeholder?: string) => {
		$pages = [...$pages, page];
		if (_placeholder) {
			$placeholder = _placeholder;
		}
		dispatch('transition');
	};

    const close = () => {
        open = false;
        checkedEntryIds.clear();
        inPage = false;
    }

	export const back = () => {
		pages.update(($pages) => {
			$pages.pop();
			return $pages;
		});
	};
</script>

{#if $isHome}
	<!-- <div class="p-1">
		<div
			class="px-2 py-1.5 text-xs font-medium text-muted-foreground"
			data-command-group-heading
			aria-hidden
		>
			Actions
		</div>
	</div> -->
	<CommandGroup heading="Actions">
		<CommandItem
			onSelect={() => {
				addPage('set-tags');
			}}
		>
			<TagIcon class="h-4 w-4 mr-2 stroke-[1.5]" />
			Set tags
		</CommandItem>
		<CommandItem
			onSelect={() => {
				close();
				alertDialogStore.open({
					title: 'Add page note',
					component: AnnotationForm,
					props: {
						class:
							'p-0 bg-transparent border-0 shadow-none focus-within:shadow-none',
						entryId: entryIds,
						onCancel: () => {
							alertDialogStore.close();
							checkedEntryIds.clear();
						},
						onSave: () => {
							alertDialogStore.close();
							checkedEntryIds.clear();
						},
						type: 'note',
					},
				});
			}}
		>
			<PenSquare class="h-4 w-4 mr-2 stroke-[1.5]" />
			Add Page Note
		</CommandItem>
		<CommandItem
			onSelect={() => {
				addPage('change-status');
			}}
		>
			<Half2 class="h-4 w-4 mr-2 stroke-[1.5]" />
			Change Status
		</CommandItem>
		<CommandItem
			onSelect={() => {
                const length = entryIds.length;
				checkedEntryIds.clear();
				close();
				mutate('markAllAsRead', {
					entryIds,
				}).then(() => {
                    toast.success(`Marked ${length} entries as read`);
					invalidateEntries(queryClient);
				});
			}}
		>
			<Circle class="h-4 w-4 mr-2 stroke-[1.5]" />
			Mark as read
		</CommandItem>
		<!-- <CommandItem
			onSelect={() => {
				// addPage('change-status');
			}}
		>
			<Half2 class="h-4 w-4 mr-2 stroke-[1.5]" />
			Mark as unread
		</CommandItem> -->
	</CommandGroup>
	<CommandSeparator />
	<CommandGroup>
		{#if entryIds.length > 1}
			<!-- TODO: not yet implemented -->
			<!-- <CommandItem>
				<Group class="h-4 w-4 mr-2 stroke-[1.5]" />
				Group
			</CommandItem> -->
		{/if}
		<CommandItem
			onSelect={() => {
				addPage('create-relation', 'Search for entry to create relation with');
			}}
		>
			<ArrowRightLeft class="h-4 w-4 mr-2 stroke-[1.5]" />
			Create relation
		</CommandItem>
		<CommandItem
			onSelect={() => {
				addPage('add-to-collection', 'Search for collection to add entries to');
			}}
		>
			<CardStackPlus class="h-4 w-4 mr-2 stroke-[1.5]" />
			Add to Collection
		</CommandItem>
	</CommandGroup>
	<CommandSeparator />

	<CommandGroup>
		<CommandItem
			onSelect={() => {
				const urls = $checkedEntryIds
					.map((id) => {
						const entry = $entryState[id];
						return make_url(entry);
					})
					.filter(Boolean)
					.join('\n');
				navigator.clipboard.writeText(urls);
                close();
                toast.success('Copied entry URLs');
			}}
		>
			<ClipboardCopy class="h-4 w-4 mr-2 stroke-[1.5]" />
			Copy entry URLs
		</CommandItem>
		<CommandItem
			onSelect={() => {
				const md = $checkedEntryIds
					.map((id) => {
						const entry = $entryState[id];
                        if (!entry) return;
						const url = make_url(entry);
                        if (url) {
                            return `[${entry.title}](${url})`;
                        }
					})
					.filter(Boolean)
					.join('\n');

                navigator.clipboard.writeText(md);
                close();

                toast.success('Copied entries as Markdown');
			}}
		>
			<ClipboardList class="h-4 w-4 mr-2 stroke-[1.5]" />
			Copy entries as Markdown
		</CommandItem>
	</CommandGroup>
	<CommandSeparator />

	<CommandGroup>
		<CommandItem
			onSelect={() => {
				close();
				alertDialogStore.open({
					title: 'Delete entries',
					description: 'Are you sure you want to delete these entries?',
					action: () => {
						console.log('running action');
						mutate('bookmarkDelete', {
							entryIds,
						}).then(() => {
							checkedEntryIds.clear();
							invalidateEntries(queryClient);
						});
					},
				});
			}}
		>
			<TrashIcon class="h-4 w-4 mr-2 stroke-[1.5]" />
			Delete
		</CommandItem>
	</CommandGroup>
	<CommandSeparator />
{/if}
{#if $activePage === 'set-tags'}
	<Tags
		bind:isOpen={open}
		onSelect={(_, selected, indeterminate, removed) => {
			// console.log({ selected, _ });
            // TODO: optimistic update
            // console.log({selected, indeterminate, removed})
            close();
			mutate('bulkTagInsert', {
				entryIds,
				tagIds: selected,
                tagIdsToRemove: removed,
			}).then(() => {
				invalidateEntries(queryClient);
				queryClient.invalidateQueries({
					queryKey: ['tags'],
				});
			});
		}}
		multiple
		selected={$checkedTagsState.checkedTags}
		indeterminate={$checkedTagsState.indeterminateTags}
	/>
{/if}

{#if $activePage === 'change-status'}
	<StatusCommands
		{entryIds}
		onSelect={() => {
			console.log('onselect');
			checkedEntryIds.clear();
			close();
			console.log('clearing checked entries');
		}}
	/>
{/if}
{#if $activePage === 'create-relation'}
	<Entries
		excludeIds={entryIds}
		bind:isOpen={open}
		onSelect={(e) => {
			close();
			mutate('addRelation', {
				entryId: entryIds,
				relatedEntryId: e.id,
			}).then(() => {
				toast.success('Created relation');
				checkedEntryIds.clear();
				invalidateEntries(queryClient);
			});
		}}
	/>
{/if}

{#if $activePage === 'add-to-collection'}
	<!-- TODO: create new collections -->
	<Collections
		onSelect={(c) => {
			checkedEntryIds.clear();
			close();
			mutate('addToCollection', {
				collectionId: c.id,
				entryId: entryIds,
			}).then(() => {
				toast.success('Added to collection');
				invalidateEntries(queryClient);
				queryClient.invalidateQueries({
					queryKey: ['collections'],
				});
			});
		}}
	/>
{/if}

<!-- x Add page note -->
<!-- x Tag (change, set, remove?) -->
<!-- x Delete -->
<!-- x Change status -->
<!-- x (Multi) group -->
<!-- x Create relation -->
<!-- x Add to collection -->
<!-- Download notes -->
<!-- Copy URLs -->
<!-- Copy URLs as Markdown -->
