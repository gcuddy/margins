<script lang="ts">
	import { getId } from '$lib/utils/entries';

	import { createEventDispatcher } from 'svelte';

	import smoothload from '$lib/actions/smoothload';
	import Button from '$lib/components/ui/Button.svelte';

	import type { Entry, Status } from '@prisma/client';
	import type { EntryInList } from '$lib/db/selects';
	import Intersector from '../Intersector.svelte';
	import { Muted } from '../ui/typography';
	import { flip } from 'svelte/animate';
	import { fly, scale } from 'svelte/transition';
	import Checkbox from '../ui/Checkbox.svelte';
	import { popoverVariants } from '../ui/popover/PopoverContent.svelte';
	import { cn } from '$lib/utils/tailwind';
	import { Portal } from '@rgossiaux/svelte-headlessui';
	import EntryItem from './EntryItem.svelte';
	import type { Validation } from 'sveltekit-superforms/index';
	import type { BulkEntries } from '$lib/schemas';
	import { superForm } from 'sveltekit-superforms/client';

	export let view = 'List';

	// type EntryInList = Pick<
	// 	Entry,
	// 	| "id"
	// 	| "title"
	// 	| "type"
	// 	| "image"
	// 	| "googleBooksId"
	// 	| "tmdbId"
	// 	| "uri"
	// 	| "podcastIndexId"
	// >;

	// type T = $$Generic<EntryIn_List>;

	let entryItems: {
		[id: number]: EntryItem;
	} = {};

	export let entries: EntryInList[];
	$: console.log({ entries });

	export let endpoint: string | undefined = undefined;
	export let cursor_param = 'cursor';

	let className = '';
	export { className as class };

	// shjould allow this to be passed into bookmarks as well
	export let status: 'backlog' | 'now' | 'archive' | undefined = undefined;

	export let active_id: number | undefined = undefined;

	$: console.log({ active_id });

	export const capture = () => {
		const scroll = window.scrollY;
		return {
			scroll,
			active_id
		};
	};
	export const restore = async (state: { scroll: number; active_id: number }) => {
		console.log({ state });
		await tick();
		active_id = state.active_id;
		window.scrollTo(0, state.scroll);
	};

	export const snapshot: Snapshot = {
		capture,
		restore
	};

	const dispatch = createEventDispatcher<{
		end: void;
		move: {
			status: Status;
			entries: EntryInList[];
		};
	}>();

	function getDomain(url: string) {
		const domain = url.replace(/https?:\/\//, '').split('/')[0];
		return domain;
	}

	// id => checked

	export let bulkForm: Validation<BulkEntries>;

	$: dndEnabled = entries.every((e) => e.sort_order !== undefined);

	$: init_entries(entries);

	const {
		form,
		enhance: bulkEnhance,
		submitting
	} = superForm(bulkForm, {
		dataType: 'json'
	});
	import { enhance } from '$app/forms';
	import rover from '$lib/actions/rover';
	import { CheckCircle2, Circle, HelpCircle, PackagePlusIcon, TagIcon } from 'lucide-svelte';
	import { getCommanderContext } from '$lib/commands/GenericCommander.svelte';
	import Collections from '$lib/commands/Collections.svelte';
	import { mutation, type MutationInput } from '$lib/queries/query';
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import { tick } from 'svelte';
	import { dndzone } from 'svelte-dnd-action';
	// import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { queryKeys } from '$lib/queries/keys';
	import type { Snapshot } from '@sveltejs/kit';
	import { receive, send } from '$lib/transitions';
	import { init_entries, state } from '$lib/state/entries';
	import { invalidate } from '$app/navigation';
	import { cmd_open } from '../ui/command/stores';
	import autoAnimate from '@formkit/auto-animate';
	import { writable } from 'svelte/store';
	import NativeSelect from '$components/ui/NativeSelect.svelte';
	import KanbanList from './KanbanList.svelte';

	const statuses = {
		Backlog: HelpCircle,
		Now: Circle,
		Archive: CheckCircle2
	} as const;

	// const queryClient = useQueryClient();

	// const updateBookmark = createMutation({
	// 	mutationFn: (data: MutationInput<'updateBookmark'>) => mutation($page, 'updateBookmark', data),
	// 	onSettled: (data) => {
	// 		console.log('onSettled', data);

	// 		// queryClient.invalidateQueries({
	// 		// 	queryKey: queryKeys.entries._def
	// 		// });
	// 		// queryClient.invalidateQueries(undefined);
	// 		// queryClient
	// 		// 	.invalidateQueries({
	// 		// 		queryKey: ['library']
	// 		// 	})
	// 		// 	.then(() => {
	// 		// 		toast.success('Updated bookmark');
	// 		// 	});
	// 	},
	// 	onMutate: (vars) => {
	// 		queryClient.setQueriesData(
	// 			{ queryKey: ['entries'] },
	// 			(
	// 				oldData:
	// 					| {
	// 							pages: {
	// 								entries: EntryInList[];
	// 							};
	// 					  }
	// 					| { entries: EntryInList[] }
	// 					| undefined
	// 			) => {
	// 				console.log({ oldData });
	// 				if (!oldData) return oldData;
	// 				if ('pages' in oldData) {
	// 					const { pages } = oldData;
	// 					const { entries } = pages;
	// 					if ('entryId' in vars) {
	// 						const { entryId, data } = vars;
	// 						const entry = entries.find((e) => e.id === entryId);
	// 						if (!entry) return oldData;
	// 						Object.assign(entry, data);
	// 						return oldData;
	// 					}
	// 					// const { id, status } = args[0];
	// 					// const entry = entries.find((e) => e.id === id);
	// 					// if (!entry) return oldData;
	// 					// entry.status = status;
	// 					return oldData;
	// 				}
	// 				const { entries } = oldData;

	// 				return oldData;
	// 			}
	// 		);
	// 	}
	// });

	const updateSortOrder = writable({
		mutate: (data: MutationInput<'updateBookmarkSortOrder'>) => {
			mutation($page, 'updateBookmarkSortOrder', data).finally(() => {
				// invalidate
			});
		}
	});

	const kbds = {
		Backlog: 'b',
		Now: 'n',
		Archive: 'e'
	} as const;

	let actions_div: HTMLDivElement;

	const statusKeys = Object.keys(statuses) as (keyof typeof statuses)[];

	const commander_store = getCommanderContext();

	let render_menu = false;

	$: if ($form.ids?.length) {
		render_menu = true;
	} else {
		render_menu = false;
	}

	// hack-y way to have cool animations
	let removed_ids: number[] = [];

	function addToCollection() {
		render_menu = false;
		commander_store.open({
			component: Collections,
			placeholder: 'Add to collection...',
			props: {
				onSelect: (c) => {
					commander_store.close();
					mutation($page, 'addToCollection', {
						entryId: $form.ids,
						collectionId: c.id
					}).then(() => {
						toast.success('Added to collection');
						tick().then(() => ($form.ids = []));
					});
				}
			}
		});
	}
</script>

<svelte:window
	on:keydown={(e) => {
		if ($cmd_open) return;
		if ($form.ids?.length) {
			// This is a bit of a hack, but it works
			if (e.key === 'b') {
				const button = actions_div.querySelector('#move-to-backlog');
				if (button instanceof HTMLButtonElement) {
					button.click();
				}
				$form.ids = [];
			} else if (e.key === 'n') {
				const button = actions_div.querySelector('#move-to-now');
				if (button instanceof HTMLButtonElement) {
					button.click();
				}
				$form.ids = [];
			} else if (e.key === 'e') {
				const button = actions_div.querySelector('#move-to-archive');
				if (button instanceof HTMLButtonElement) {
					button.click();
				}
				$form.ids = [];
			} else if (e.key === 'c') {
				e.preventDefault();
				addToCollection();
			}
		}
	}}
/>

<!-- use:rover={{
		linkSelector: 'a[data-id]',
		idAttr: 'data-id',
		initialId: active_id
	}} -->

{#if view === 'List'}
	<ul
		class={cn('divide-y divide-border', className)}
		use:dndzone={{
			items: entries,
			flipDurationMs: 200,
			dragDisabled: !dndEnabled,
			dropTargetStyle: {}
		}}
		on:consider={(e) => (entries = e.detail.items)}
		on:finalize={(e) => {
			entries = e.detail.items;
			console.log(e.detail);
			const moved_id = e.detail.info.id;
			const idx = entries.findIndex((e) => e.id === Number(moved_id));
			const moved = entries[idx];
			// we have to ensure all previous items have a sort_order less than the moved item
			// and all items after have a sort_order greater than the moved item
			const prev = entries.slice(0, idx);
			const next = entries.slice(idx + 1);

			let new_sort_order = 0;

			console.log({ idx });
			if (idx === 0) {
				// we're at the top - get the next item's sort_order, and subtract 100
				new_sort_order = (next[0]?.sort_order ?? 0) - 100;
				$updateSortOrder.mutate({
					data: [
						{
							id: moved.id,
							sort_order: new_sort_order
						}
					]
				});
				moved.sort_order = new_sort_order;
				return;
			} else if (idx === entries.length - 1) {
				// we're at the bottom - get the previous item's sort_order, and add 100
				new_sort_order = (prev[prev.length - 1]?.sort_order ?? 0) + 100;
				$updateSortOrder.mutate({
					data: [
						{
							id: moved.id,
							sort_order: new_sort_order
						}
					]
				});
				moved.sort_order = new_sort_order;
				return;
			} else {
				console.log({ prev, next });
				// we're in the middle - this is a more complex calculation
				// let's first check the previous item and next item. if they have a gap of more than 10, we can just put it in the middle
				const prev_sort_order = prev[prev.length - 1]?.sort_order ?? 0;
				const next_sort_order = next[0]?.sort_order ?? 0;

				console.log({
					prev_sort_order,
					next_sort_order
				});
				if (next_sort_order - prev_sort_order > 10) {
					new_sort_order = Math.round(prev_sort_order + (next_sort_order - prev_sort_order) / 2);
					$updateSortOrder.mutate({
						data: [
							{
								id: moved.id,
								sort_order: new_sort_order
							}
						]
					});
					moved.sort_order = new_sort_order;
					return;
				} else {
					console.log('we have to change all the sort_orders');
					// we're going to have to change all the sort_orders on *one* side of the moved item
					// let's find out which side has less items, so that we can make the least amount of changes
					if (prev.length < next.length) {
						// we're going to have to change the sort_orders of the previous items
						// we'll start with the previous item's sort_order, and add 100 to each item
						new_sort_order = prev_sort_order + 1;
						let data = [
							{
								id: moved.id,
								sort_order: new_sort_order
							}
						];
						let running_sort_order = new_sort_order;
						for (let i = prev.length - 1; i >= 0; i--) {
							running_sort_order -= 100;
							entries[i].sort_order = running_sort_order;
							data.push({
								id: entries[i].id,
								sort_order: running_sort_order
							});
						}
						$updateSortOrder.mutate({
							data
						});
					} else {
						console.log('next is shorter');
						// we're going to have to change the sort_orders of the next items
						// we'll start with the next item's sort_order, and subtract 100 to each item
						new_sort_order = prev_sort_order + 100;
						let data = [
							{
								id: moved.id,
								sort_order: new_sort_order
							}
						];
						console.log({ data });
						entries[idx].sort_order = new_sort_order;
						let running_sort_order = new_sort_order;
						for (let i = 0; i < next.length; i++) {
							running_sort_order += 100;
							entries[idx + i + 1].sort_order = running_sort_order;
							data.push({
								id: next[i].id,
								sort_order: running_sort_order
							});
						}
						$updateSortOrder.mutate({
							data
						});
					}
				}
			}
		}}
	>
		<!-- .filter((e) => !removed_ids.includes(e.id)) -->
		{#each entries as entry (entry.id)}
			<li
				animate:flip={{ duration: 200 }}
				class="group flex !cursor-default items-center space-x-4 bg-background"
			>
				<!-- <input
				bind:group={$form.ids}
				tabindex="-1"
				value={entry.id}
				type="checkbox"
				class="opacity-0 transition checked:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100"
			/> -->
				<!-- {entry.sort_order} -->
				<EntryItem
					on:move
					on:reorder={(e) => {
						const { entry, position } = e.detail;
						const idx = entries.findIndex((e) => e.id === entry.id);
						const moved = entries[idx];
						entries.splice(idx, 1);
						entries.splice(position, 0, moved);
						entries = entries;
					}}
					bind:this={entryItems[entry.id]}
					checked={$form.ids?.includes(entry.id)}
					on:focus={() => (active_id = entry.id)}
					on:checked={(e) => {
						if (e.detail) {
							$form.ids = [...($form.ids ?? []), entry.id];
						} else {
							$form.ids = $form.ids?.filter((id) => id !== entry.id);
						}
					}}
					{entry}
				/>
			</li>
		{/each}
		<Intersector
			cb={() => {
				dispatch('end');
				if (!endpoint) return;
			}}
		/>
	</ul>
{:else if view === 'Grid'}{:else if view === 'Kanban'}
	<KanbanList {entries} />
{/if}

<!-- TODO: a11y -->

{#if render_menu}
	<Portal>
		<div
			class={cn(
				popoverVariants(),
				'fixed bottom-10 left-0 right-0 mx-auto w-max bg-popover/90 backdrop-blur-sm'
			)}
			transition:fly={{ y: 30 }}
			bind:this={actions_div}
		>
			<div class="flex flex-col gap-4">
				<Muted>{$form.ids?.length} items</Muted>
				<div class="flex items-center gap-2">
					<Button>Relate</Button>
					<div class="flex items-center gap-2">
						<form
							action="/tests/library/?/update_status"
							use:enhance={() => {
								// parent component handles state mngmt, we'll just check for errors
								return ({ result }) => {
									if (result.type !== 'success') {
										// reset (invalidate) -> or save prev state?
										invalidate('entries');
										toast.error(`Error updating status. Check console.`);
										console.error(result);
									}
								};
							}}
							method="post"
						>
							{#each $form.ids as id}
								<input type="hidden" name="id" value={id} />
							{/each}
							{#each statusKeys as _status}
								{@const formaction = `/tests/library/?/update_status&status=${_status}`}
								{#if status !== _status.toLowerCase()}
									<Button
										id="move-to-{_status.toLowerCase()}"
										class="relative"
										size="lg"
										disabled={$submitting}
										name="status"
										{formaction}
										value={_status}
										on:click={() => {
											// $form.data = {
											// 	status: _status
											// };
											dispatch('move', {
												entries: $form.ids
													.map((id) => entries.find((e) => e.id === id))
													.filter(Boolean),
												status: _status
											});
											$form.ids = [];
											// $form.ids.forEach((id) => {
											// 	entryItems[id]?.move_entry(_status);
											// });
											// removed_ids = [...removed_ids, ...$form.ids];
											// $updateBookmark.mutate({
											// 	entryId: $form.ids,
											// 	data: {
											// 		status: _status
											// 	}
											// });
											// dispatch('move', {
											// 	entries: $form.ids
											// 		.map((id) => entries.find((e) => e.id === id))
											// 		.filter(Boolean),
											// 	status: _status
											// });
											// $form.ids = [];
										}}
									>
										<svelte:component this={statuses[_status]} class="mr-2 h-4 w-4 shrink-0" />
										Move to {_status}
										<kbd
											class="absolute right-1 top-1 text-xs uppercase tracking-widest opacity-60"
										>
											{kbds[_status]}
										</kbd>
									</Button>
									<!-- <Button
									on:click={async () => {
										$form.ids.forEach((id) => {
											entryItems[id]?.move_entry(_status);
										});
										removed_ids = [...removed_ids, ...$form.ids];
										dispatch('move', {
											entries: $form.ids
											.map((id) => entries.find((e) => e.id === id))
											.filter(Boolean),
											status: _status
										});
										$form.ids = [];
									}}>Special {_status}</Button
								> -->
								{/if}
							{/each}
						</form>
						<Button
							size="lg"
							on:click={async () => {
								const tags = await $page.data.user_data?.tags;
								if (!tags) return;
								commander_store.open_items(tags, {
									render: (tag) => tag.name
									// onclose: () => {
									// 	// console.log('closed');
									// 	// commander_store.close();
									// },
								});
							}}
						>
							<TagIcon class="mr-2 h-4 w-4 shrink-0" />
							Tag
						</Button>
					</div>
					<Button class="relative" size="lg" on:click={addToCollection}>
						<PackagePlusIcon class="mr-2 h-4 w-4 shrink-0" />
						Add to collection
						<kbd class="absolute right-1 top-1 text-xs uppercase tracking-widest opacity-60">
							c
						</kbd>
					</Button>
				</div>
			</div>
		</div>
	</Portal>
{/if}
