<script lang="ts">
	import { H1 } from '$components/ui/typography';
	import LibraryTabs from './library-tabs.svelte';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { cn } from '$lib/utils/tailwind';
	import Button, { buttonVariants } from '$components/ui/Button.svelte';
	import Badge from '$components/ui/Badge.svelte';
	import {
		ArrowDownUpIcon,
		CalendarPlusIcon,
		Check,
		FileIcon,
		FilterIcon,
		Loader2Icon,
		XIcon,
		TagIcon,
		ClockIcon,
		GlobeIcon
	} from 'lucide-svelte';
	import { types } from '$lib/types';
	import debounce from 'just-debounce-it';
	import Filter from '$components/ui/filters/Filter.svelte';
	import * as AlertDialog from '$components/ui/alert-dialog';

	import {
		Command,
		CommandInput,
		CommandGroup,
		CommandItem,
		CommandLoading,
		CommandList,
		CommandIcon
	} from '$components/ui/command2';
	import {
		DropdownMenu,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuRadioGroup,
		DropdownMenuRadioItem,
		DropdownMenuSeparator,
		DropdownMenuLabel
	} from '$components/ui/dropdown-menu';
	// import DropdownMenu from '$components/ui/dropdown-menu/DropdownMenu.svelte';
	// import DropdownMenuTrigger from '$components/ui/dropdown-menu/DropdownMenuTrigger.svelte';
	// import DropdownMenuContent from '$components/ui/dropdown-menu/DropdownMenuContent.svelte';
	// import DropdownMenuItem from '$components/ui/dropdown-menu/DropdownMenuItem.svelte';
	import { page, navigating } from '$app/stores';
	import { afterNavigate, goto } from '$app/navigation';
	import Input from '$components/ui/Input.svelte';
	import Kbd from '$components/ui/KBD.svelte';
	import Header from '$components/ui/Header.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { derived, writable } from 'svelte/store';
	import { queryFactory } from '$lib/queries/querykeys';
	import type { LibrarySortType } from '$lib/server/queries';
	import { LoaderIcon } from 'svelte-french-toast';
	import Cmd from '$components/ui/cmd/Cmd.svelte';
	import {
		changeSearch,
		createChangeSearch,
		defaultParseSearch,
		defaultStringifySearch
	} from '$lib/utils/search-params';
	import {
		filterLibrarySchema,
		LibraryGroupType,
		type FilterLibrarySchema
	} from '$lib/schemas/library';
	import FilterBadge from '$components/ui/filters/FilterBadge.svelte';
	import { createParamsStore, createSearchParamsStore } from '$lib/stores/search-params';
	import { tweened } from 'svelte/motion';
	import { cubicInOut, cubicOut, quintIn } from 'svelte/easing';
	import { afterUpdate } from 'svelte';
	import { deepWriteable } from '$lib/helpers/object';
	import { createPageData, createPageItemList } from '$components/ui/command2/utils';
	import { statusesWithIcons } from '$lib/status';
	import { entryTypeIcon } from '$components/entries/icons';
	import { isHTMLElement } from '$lib/helpers';
	import { createFilterDialogStore } from '$lib/stores/filters';

	let filter: Input;
	let form: HTMLFormElement;
	let value = $page.url.searchParams.get('search') ?? '';

	const entryCount = createQuery(
		derived(page, ($page) => ({
			...queryFactory.entries.count({
				status: $page.data.Status,
				filter: {
					type: $page.data.type,
					search: $page.url.searchParams.get('search') ?? undefined
				}
			}),
			select: (data: { count: number }) => data.count
		}))
	);

	const tagsQuery = createQuery(queryFactory.tags.list());

	const filterChange = createChangeSearch<FilterLibrarySchema>();

	const count = tweened(0, {
		duration: 200
	});

	export function setCount(newCount: number) {
		count.set(newCount, {
			duration: 200
		});
	}

	// afterNavigate(() => {
	// 	if ($entryCount.data) {
	// 		const newCount = parseInt($entryCount.data, 10);
	// 		count.set(newCount, {
	// 			duration: 200
	// 		});
	// 	}
	// });

	$: if ($entryCount.data) {
		count.set($entryCount.data, {
			duration: 500
			// easing: quintIn
		});
	}

	$: console.log({ $count });

	// $: if ($entryCount.data) {
	// 	console.log('setting count');
	// 	const newCount = parseInt($entryCount.data, 10);
	// 	console.log({ newCount });
	// 	count.set(newCount, {
	// 		duration: 200
	// 	});
	// 	console.log({ $count });
	// }

	const debounced_submit = debounce(() => {
		if (typeof HTMLFormElement.prototype.requestSubmit === 'function') {
			form.requestSubmit();
		}
	}, 200);

	const handle_filter_input = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const value = target.value;
		// TODO optimistic update by filtering the entries in js first
		// const regexQuery = new RegExp(value, 'i');
		// filtered_entries = data.entries?.filter((entry) => entry.title?.match(regexQuery));
		debounced_submit();
	};

	function handle_keydown(e: KeyboardEvent) {
		if (e.key === '/') {
			e.preventDefault();
			filter.focus();
		}
		// let 1 2 and 3 move you to backlog, now, and archive
		if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
		if (e.target instanceof HTMLInputElement) return;
		if (e.key === '1') {
			e.preventDefault();
			goto(`/tests/library/backlog`);
		}
		if (e.key === '2') {
			e.preventDefault();
			goto(`/tests/library/now`);
		}
		if (e.key === '3') {
			e.preventDefault();
			goto(`/tests/library/archive`);
		}
	}

	$: is_searching = $navigating?.to?.url.pathname === $page.url.pathname;
	$: filter_type = $page.url.searchParams.get('type');

	export let sort: NonNullable<LibrarySortType> = 'manual';
	export let dir: 'asc' | 'desc' | undefined = 'asc';
	export let grouping: LibraryGroupType = undefined;
	export let loading = false;

	// const filters = writable<FilterLibrarySchema>({});

	const filters = derived(page, ($page) => {
		const rawObj = defaultParseSearch($page.url.search);
		const parsed = filterLibrarySchema.safeParse(rawObj);

		if (parsed.success) {
			return parsed.data;
		} else {
			return {};
		}
	});

	// const filterStore = createParamsStore(filterLibrarySchema);

	// $: console.log({ $filterStore });

	const filterStore = createSearchParamsStore(filterLibrarySchema);

	const hasFilters = derived(filters, ($filters) => {
		return Object.keys($filters).length > 0;
	});

	// const searchStr = derived([filters, page], [$filters, $page] => {
	//     // const
	// })

	const filterDialogStore = createFilterDialogStore();

	// TODO: these should affect the url params
	const sortTypes: { label: string; type: NonNullable<LibrarySortType> }[] = [
		{
			label: 'Manual',
			type: 'manual'
		},
		{
			label: 'Title',
			type: 'title'
		},
		{
			label: 'Author',
			type: 'author'
		},
		{
			label: 'Date Updated',
			type: 'updatedAt'
		},
		{
			label: 'Time',
			type: 'time'
		}
	];
	const filterOpen = writable(false);

	const filterPageData = createPageData([
		{
			name: 'Type',
			placeholder: 'Filter by type...',
			icon: FileIcon
		},
		{
			name: 'Tags',
			placeholder: 'Filter by tag...',
			icon: TagIcon
		},
		{
			name: 'Reading Time',
			placeholder: 'Filter by reading time...',
			icon: ClockIcon
		},
		{
			name: 'Domain',
			icon: GlobeIcon,
			action: () => {
				filterOpen.set(false);
				filterDialogStore.open({
					title: 'Filter by domain',
					value: '',
					action(val) {
						console.log(`Setting domain to ${val}`);
						filterChange($page.url, (data) => {
							data.domain = val;
							return data;
						});
					}
				});
			}
		}
	]);
</script>

<svelte:window on:keydown={handle_keydown} />
<!--  -->
<Header class="max-sm:static max-sm:flex-col max-sm:h-max max-sm:items-start max-sm:py-2">
	<!-- class="flex flex-1 items-center justify-start gap-x-4" -->
	<div class="flex items-center gap-3 flex-1 min-w-0 max-sm:flex-col max-sm:items-start">
		<h1 class="font-extrabold tracking-tight text-2xl sm:text-3xl md:text-4xl">Library</h1>
		<!-- <H1>{data.Status}</H1> -->
		<div class="flex items-center gap-3 flex-1 min-w-0">
			<LibraryTabs />
			<noscript>
				<!-- hm -->
			</noscript>

			<Popover
				bind:open={$filterOpen}
				positioning={{
					placement: 'bottom-start'
				}}
			>
				<PopoverTrigger
					class={cn(!filter_type && buttonVariants({ variant: 'outline' }), 'border-dashed')}
				>
					{#if filter_type}
						<Badge variant="secondary" class="">
							{filter_type}
						</Badge>
					{:else}
						<FilterIcon class="lg:mr-2 h-4 w-4" />
						<span class="lg:inline hidden">Filter</span>
					{/if}
				</PopoverTrigger>
				<PopoverContent class="w-[200px] p-0">
					<Command pages={filterPageData} let:pages let:page={currentPage} let:createPageItems>
						<CommandInput onKeydown={pages.handlers.keydown} placeholder="Filter..." />
						<CommandList>
							<CommandGroup>
								{#if !currentPage}
									{@const filterTypes = createPageItems()}
									{#each filterTypes as { addPage, icon, name }}
										<CommandItem containsPages onSelect={addPage}>
											<CommandIcon {icon} />
											<span>{name}</span>
										</CommandItem>
									{/each}
								{:else if currentPage.name === 'Type'}
									{#each types as type}
										<CommandItem
											onSelect={() => {
												filterChange($page.url, (data) => {
													if (data.type) {
														data.type = undefined;
													} else {
														data.type = type;
													}
													return data;
												});
												filterOpen.set(false);
											}}
										>
											<CommandIcon icon={entryTypeIcon[type]} />
											{type}
										</CommandItem>
									{/each}
								{:else if currentPage.name === 'Tags'}
									{#if $tagsQuery.isLoading}
										<CommandLoading>Loading...</CommandLoading>
									{:else if $tagsQuery.isSuccess}
										<!-- TODO: Behavior of this section of Commands should mimic multiple... hm. Maybe can add a data-multiple attribute on the commanditem that the store can check for. -->
										{#each $tagsQuery.data as tag}
											<!-- TODO: virtualization -->
											<CommandItem
												onSelect={() => {
													filterChange($page.url, (data) => {
														console.log({ data });
														if (data.tags?.ids?.includes(tag.id)) {
															data.tags = {
																...data.tags,
																ids: data.tags.ids.filter((t) => t !== tag.id)
															};
														} else {
															data.tags = {
																ids: [...(data.tags?.ids ?? []), tag.id]
															};
														}
														return data;
													});
													filterOpen.set(false);
													// filterChange($page.url, (data) => {
													//     if (data.tags) {
													//         data.tags = data.tags.filter((t) => t !== tag.name);
													//     } else {
													//         data.tags = [tag.name];
													//     }
													//     return data;
													// });
													// filterOpen.set(false);
												}}
											>
												<CommandIcon icon={TagIcon} />
												{tag.name}
											</CommandItem>
										{/each}
									{/if}
								{:else if currentPage.name === 'Reading Time'}
									{#each [{ name: '5 Minutes', time: 5 }, { name: '15 Minutes', time: 15 }, { name: '30 Minutes', time: 30 }, { name: '1 Hour', time: 60 }] as { name, time }}
										<CommandItem
											onSelect={() => {
												filterChange($page.url, (data) => {
													data.readingTime = {
														max: time
													};
													return data;
												});
												filterOpen.set(false);
											}}>{name}</CommandItem
										>
									{/each}
									<!-- TODO: Custom -->
								{/if}
							</CommandGroup>
						</CommandList>
					</Command>
					<!-- open={filterOpen} -->
					<!-- open={filterOpen} -->
					<!-- <Cmd
						bounce={false}
						items={[
							{
								items: [
									{
										name: 'Type',
                                        icon: FileIcon,
                                        props: {
                                            class: "opacity-40"
                                        },
										addPage() {
											return [
												{
													items: types.map((type) => ({
														name: type,
														action() {
															const selected = filter_type === type.toLowerCase();
															filter_type = selected ? '' : type.toLowerCase();
															// if ($filterStore.type) {
															//     $filterStore.type = undefined
															// } else {
															//     $filterStore.type = type;
															// }
															const url = $page.url;
															if (filter_type) url.searchParams.set('type', filter_type);
															else url.searchParams.delete('type');
															goto(url, {
																keepFocus: true,
																replaceState: true,
																noScroll: true,
																invalidateAll: true
															});
															filterOpen.set(false);
														}
													}))
												}
											];
										}
									},
									{
										name: 'Saved Date',
                                        icon: CalendarPlusIcon,
                                        props: {
                                            class: "opacity-40"
                                        },
										addPage() {
											return {
												page: [
													{
														items: [
															{
																name: '1 week ago',
																action() {
																	const url = $page.url;
																	const exisiting = defaultParseSearch($page.url.search);
																	const newSearch = defaultStringifySearch({
																		...exisiting,
																		createdAt: {
																			gte: {
																				num: 1,
																				unit: 'week'
																			}
																		}
																	});
																	url.search = newSearch;
																	goto(url, {
																		keepFocus: true,
																		replaceState: true,
																		noScroll: true,
																		invalidateAll: true
																	});
																	filterOpen.set(false);
																}
															}
														]
													}
												]
											};
										}
									},
                                    {
                                        name: "Tag",
                                        icon: TagIcon,
                                        props: {
                                            class: "opacity-40"
                                        },
                                        addPage() {
                                            // TODO only show tags that are in current view
                                            tagsQueryEnabled.set(true);
                                            return {
                                                page: [
                                                    {
                                                        // items:
                                                        items: []
                                                    }
                                                ],
                                                destroy() {
                                                    tagsQueryEnabled.set(false);
                                                }
                                            }
                                        }
                                    }
								]
							}
						]}
					/> -->
					<!-- <Command>
						<CommandInput placeholder="Filter..." />
						<CommandList>
							<CommandGroup>
								{#each types as type}
									{@const selected = filter_type === type.toLowerCase()}
									<CommandItem
										onSelect={() => {
											filter_type = selected ? '' : type.toLowerCase();
											const url = $page.url;
											if (filter_type) url.searchParams.set('type', filter_type);
											else url.searchParams.delete('type');
											goto(url, {
												keepFocus: true,
												replaceState: true,
												noScroll: true,
												invalidateAll: true
											});
										}}
									>
										<div
											class={cn(
												'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
												selected
													? 'bg-primary text-primary-foreground'
													: 'opacity-50 [&_svg]:invisible'
											)}
										>
											<Check class={cn('h-4 w-4')} />
										</div>
										<span>
											{type}
										</span>
									</CommandItem>
								{/each}
							</CommandGroup>
						</CommandList>
					</Command> -->
				</PopoverContent>
			</Popover>
			{#if filter_type}
				<div class="flex">
					<Button href={$page.url.pathname} variant="ghost" size="sm">
						<span class="lg:inline hidden">Reset</span>
						<XIcon class="lg:ml-2 h-4 w-4" />
					</Button>
				</div>
			{/if}
			<span class="text-xs hidden xl:inline text-muted-foreground">
				<span class="tabular-nums">{Math.round($count)}</span> entries
			</span>
		</div>
	</div>
	<div class="flex shrink justify-end items-center gap-2">
		{#if loading}
			<Loader2Icon class="h-4 w-4 animate-spin text-muted-foreground" />
		{/if}
		<div class="hidden md:block">
			<DropdownMenu
				positioning={{
					placement: 'bottom'
				}}
			>
				<DropdownMenuTrigger class={buttonVariants({ variant: 'secondary' })}>
					<ArrowDownUpIcon class="h-4 w-4 lg:mr-2" />
					<span class="hidden lg:inline">Sort</span>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Sort</DropdownMenuLabel>
					<DropdownMenuRadioGroup bind:value={sort}>
						{#each sortTypes as { label, type }}
							<DropdownMenuRadioItem value={type}>{label}</DropdownMenuRadioItem>
						{/each}
					</DropdownMenuRadioGroup>
					<DropdownMenuSeparator />
					<DropdownMenuRadioGroup bind:value={dir}>
						<DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
					<DropdownMenuSeparator />
					<DropdownMenuLabel>Grouping</DropdownMenuLabel>
					<DropdownMenuRadioGroup bind:value={grouping}>
						<DropdownMenuRadioItem value="none">None</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="type">Type</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
		<form
			bind:this={form}
			class="group shrink hidden md:flex relative"
			data-sveltekit-keepfocus
			data-sveltekit-replacestate
		>
			<Input
				bind:this={filter}
				{value}
				on:input={handle_filter_input}
				placeholder="Filter in list..."
				type="text"
				name="search"
				class="shrink w-fit"
			/>
			<Kbd class="absolute bottom-0 right-1.5 top-0 my-auto group-focus-within:hidden">/</Kbd>
			{#if is_searching}
				<div
					class="absolute bottom-0 right-1.5 top-0 my-auto flex flex-col items-center justify-center"
				>
					<Loader2Icon class="h-4 w-4 animate-spin text-muted-foreground" />
				</div>
			{/if}
		</form>
	</div>
</Header>

<Filter />
<!-- TODO: Alert Dialog Should Go Inside Filter -->
{#if $filterDialogStore.open}
	<AlertDialog.Root bind:open={$filterDialogStore.open}>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>{$filterDialogStore.title}</AlertDialog.Title>
			</AlertDialog.Header>
			<form class="contents" on:submit|preventDefault>
				<Input bind:value={$filterDialogStore.value} />
				<AlertDialog.Footer>
					<AlertDialog.Cancel on:m-click={filterDialogStore.reset}>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action
						type="submit"
						on:m-click={() => {
							filterDialogStore.action();
						}}>Continue</AlertDialog.Action
					>
				</AlertDialog.Footer>
			</form>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/if}
