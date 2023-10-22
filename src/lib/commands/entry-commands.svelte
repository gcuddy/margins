<script lang="ts">
	import {
		CommandGroup,
		CommandItem,
		CommandSeparator,
	} from '$components/ui/command2';
	import {
		ArrowRightLeft,
		TagIcon,
		TrashIcon,
		PenSquare,
		ClipboardList,
	} from 'lucide-svelte';
	import {
		Group,
		Half2,
		CardStackPlus,
		ClipboardCopy,
	} from 'radix-icons-svelte';
	import { derived, writable } from 'svelte/store';
	import Tags from './Tags.svelte';
	import alertDialogStore from '$lib/stores/alert-dialog';
	import AnnotationForm from '$components/annotations/annotation-form.svelte';
	import { checkedEntries, checkedEntryIds } from '$components/entries/multi-select';
	import { createEventDispatcher } from 'svelte';
	import { statusesToDisplay, statusesWithIcons } from '$lib/status';
	import { objectEntries } from '$lib/helpers';
	import { checkedTagsState, entryState } from '$lib/stores/entry-state';
	import { mutate } from '$lib/queries/query';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { invalidateEntries } from '$lib/queries/mutations';
	import { StatusCommands } from '.';

	export let entryIds: number[] = [];
	export let open = false;
	export let inPage = false;
	export let shouldFilter = writable(true);

	const pages = writable<string[]>([]);
	const activePage = derived(pages, ($pages) => $pages[$pages.length - 1]);
	const isHome = derived(activePage, ($activePage) => !$activePage);

	const dispatch = createEventDispatcher();

	$: if ($activePage !== undefined) {
		inPage = true;
		shouldFilter.set(true);
	} else {
		inPage = false;
	}

	$: console.log({ $shouldFilter });

	const queryClient = useQueryClient();

	const addPage = (page: string) => {
		$pages = [...$pages, page];
		dispatch('transition');
	};

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
				open = false;
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
	</CommandGroup>
	<CommandSeparator />
	<CommandGroup>
		{#if entryIds.length > 1}
			<CommandItem>
				<Group class="h-4 w-4 mr-2 stroke-[1.5]" />
				Group
			</CommandItem>
		{/if}
		<CommandItem>
			<ArrowRightLeft class="h-4 w-4 mr-2 stroke-[1.5]" />
			Create relation
		</CommandItem>
		<CommandItem>
			<CardStackPlus class="h-4 w-4 mr-2 stroke-[1.5]" />
			Add to Collection
		</CommandItem>
	</CommandGroup>
	<CommandSeparator />

	<CommandGroup>
		<CommandItem>
			<ClipboardCopy class="h-4 w-4 mr-2 stroke-[1.5]" />
			Copy entry URLs
		</CommandItem>
		<CommandItem>
			<ClipboardList class="h-4 w-4 mr-2 stroke-[1.5]" />
			Copy entries as Markdown
		</CommandItem>
	</CommandGroup>
	<CommandSeparator />

	<CommandGroup>
		<CommandItem onSelect={() => {
            open = false;
            alertDialogStore.open({
                title: 'Delete entries',
                description: 'Are you sure you want to delete these entries?',
                action: () => {
                    checkedEntryIds.clear();
                    mutate('bookmarkDelete', {
                        entryIds,
                    }).then(() => {
                        invalidateEntries(queryClient);
                    });
                },
            })
        }}>
			<TrashIcon class="h-4 w-4 mr-2 stroke-[1.5]" />
			Delete
		</CommandItem>
	</CommandGroup>
	<CommandSeparator />
{/if}
{#if $activePage === 'set-tags'}
	<Tags
		bind:isOpen={open}
		onSelect={(_, selected) => {
			console.log({ selected, _ });
			mutate('bulkTagInsert', {
				entryIds,
				tagIds: selected,
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
            console.log('onselect')
			checkedEntryIds.clear();
			open = false;
            console.log('clearing checked entries')
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
