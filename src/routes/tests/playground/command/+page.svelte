<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { checkedEntryIds } from '$components/entries/multi-select';
	import { getCheckedEntriesFromQueryCache } from '$components/entries/multi-select/utils';
	import type Cmd from '$components/ui/cmd/Cmd.svelte';
	import type { CommandGroup } from '$components/ui/cmd/Cmd.svelte';
	import CmdDialog from '$components/ui/cmd/CmdDialog.svelte';
	import { updateEntries } from '$lib/queries/mutations/index';
	import { mutation, type QueryOutput } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';
	import { statuses, statusesWithIcons } from '$lib/status';
	import { recents } from '$lib/stores/recents';
	import { createStack } from '$lib/stores/undo';
	import { make_link } from '$lib/utils/entries';
	import { confetti } from '@neoconfetti/svelte';
	import { createQuery, keepPreviousData, useQueryClient } from '@tanstack/svelte-query';

	import {
		ArrowRight,
		CalculatorIcon,
		CalendarIcon,
		CircleIcon,
		CreditCard,
		PartyPopperIcon,
		Settings,
		SmileIcon,
		User
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { derived, writable } from 'svelte/store';

	let pages = [];

	let cmd: Cmd;

	let term = writable('');

	$: console.log({ term });

	let enableEntriesSearchQuery = writable(false);
	$: console.log({ $enableEntriesSearchQuery });

	const entriesSearchQuery = createQuery(
		derived([enableEntriesSearchQuery, term], ([$enableEntriesSearchQuery, $term]) => ({
			...queryFactory.entries.search({
				q: $term
			}),
			enabled: $enableEntriesSearchQuery && $term.length > 0,
			select: (data: QueryOutput<'search_titles'>) => {
				return data.map((e) => ({
					name: e.title ? e.title : 'Untitled',
					description: e.author,
					img: e.image,
					terms: e.author,
					action: () => goto(make_link(e))
				}));
			},
			placeholderData: keepPreviousData
		}))
	);

	const queryClient = useQueryClient();
	const items: CommandGroup[] = [
		derived(checkedEntryIds, ($checkedEntryIds) => {
			return {
				group: 'Actions',
				disabled: $checkedEntryIds.length === 0,
				items: [
					{
						name: 'Move to…',
						icon: CircleIcon,
						addPage() {
							const entries = getCheckedEntriesFromQueryCache(queryClient);
							const selectedStatus = entries
								.map((e) => e.status)
								.every((status) => status === statuses[0])
								? statuses[0]
								: undefined;
							return {
								page: [
									{
										group: 'Status',
										items: statuses.map((status) => ({
											name: status,
											icon: statusesWithIcons[status],
											selected: selectedStatus ? status === selectedStatus : undefined,
											async action() {
												console.log({ status });
												const { previousQueries, queryKey } = await updateEntries(
													queryClient,
													$checkedEntryIds,
													{
														status
													}
												);
												mutation($page, 'update_status', {
													ids: $checkedEntryIds,
													status
												})
													.catch(() => queryClient.setQueriesData({ queryKey }, previousQueries))
													.then(() => {
														checkedEntryIds.clear();
														toast.success(`${$checkedEntryIds.length > 1 ? 'Entries' : 'Entry'} moved to ${status}`, {
															// description: `<a href='/tests/library/${status.toLowerCase()}'>View ${status} entries</a>`,
															action: selectedStatus
																? {
																		label: 'Undo',
																		onClick: () => {
                                                                            // TODO
																			// dispatch('move', {
																			// 	status: old_status,
																			// 	entries: [entry]
																			// });
																			// mutation($page, 'update_status', {
																			// 	ids: $checked,
																			// 	status: old_status,
																			// 	sort_order: old_sort_order
																			// });
																		}
																  }
																: undefined
														});
													})
													.finally(() => {
														queryClient.invalidateQueries({
															queryKey: ['entries']
														});
													});
											}
											// async action() {
											// const { previousQueries, queryKey } = await updateEntries(
											// 	queryClient,
											// 	$checkedEntryIds,
											// 	{
											// 		status
											// 	}
											// );
											// mutation($page, 'update_status', {
											// 	ids: $checkedEntryIds,
											// 	status
											// })
											// 	.catch((err) => {
											// 		queryClient.setQueriesData({ queryKey }, previousQueries);
											// 	})
											// 	.finally(() => {
											// 		queryClient.invalidateQueries({
											// 			queryKey: ['entries']
											// 		});
											// 	});
											// TODO immediate mutation
											// }
										}))
									}
								]
							};
						}
					}
				]
			};
		}),
		{
			group: 'Navigation',
			items: [
				{
					name: 'Open item',
					icon: ArrowRight,
					addPage() {
						enableEntriesSearchQuery.set(true);
						return {
							page: derived(entriesSearchQuery, ($entriesSearchQuery) => {
								return [
									{
										group: $term ? 'Search' : 'Recents',
                                        // loading: $entriesSearchQuery.isLoading,
										items: $term
											? $entriesSearchQuery.data ?? []
											: $recents.entries.map((e) => ({
													name: e.title ? e.title : 'Untitled',
													description: e.author,
													img: e.image,
													terms: e.author,
													action: () => goto(make_link(e))
											  }))
									}
								];
							}),
							destroy() {
								enableEntriesSearchQuery.set(false);
							}
						};
					}
				}
			]
		},
		{
			group: 'Suggestions',
			items: [
				{
					name: 'Calendar',
					icon: CalendarIcon
				},
				{
					name: 'Search Emoji',
					icon: SmileIcon
				},
				{
					name: 'Calculator',
					icon: CalculatorIcon
				}
			]
		},
		{
			group: 'Settings',
			items: [
				{
					name: 'Profile',
					icon: User,
					kbd: '⌘P'
				},
				{
					name: 'Billing',
					icon: CreditCard,
					kbd: '⌘B'
				},
				{
					name: 'Settings',
					icon: Settings,
					kbd: '⌘S'
				}
			]
		},
		{
			group: 'Extras',
			items: [
				{
					name: 'Confetti',
					icon: PartyPopperIcon,
					action() {
						_confetti++;
					}
				}
			]
		}
	];

	let _confetti = 0;

	// TODO make stack managed internally
</script>

<CmdDialog loading={$entriesSearchQuery.isLoading} showSelectActions bind:term={$term} bind:cmd {items} onChange={() => {}} />
{#if _confetti}
	{#key _confetti}
		<div
			class="fixed w-full h-full left-1/2 top-1/3 pointer-events-none"
			use:confetti={{ stageWidth: innerWidth, stageHeight: innerHeight }}
		/>
	{/key}
{/if}
