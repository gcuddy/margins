<script lang="ts">
	import { H1 } from '$components/ui/typography';
	import LibraryTabs from './library-tabs.svelte';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover2';
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
		TagIcon
	} from 'lucide-svelte';
	import { types } from '$lib/types';
	import debounce from 'just-debounce-it';
	import Filter from '$components/ui/filters/Filter.svelte';
	import {
		Command,
		CommandInput,
		CommandGroup,
		CommandItem,
		CommandList
	} from '$components/ui/command2';
	import {
		DropdownMenu,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuRadioGroup,
		DropdownMenuRadioItem
	} from '$components/ui/dropdown-menu2';
	// import DropdownMenu from '$components/ui/dropdown-menu/DropdownMenu.svelte';
	// import DropdownMenuTrigger from '$components/ui/dropdown-menu/DropdownMenuTrigger.svelte';
	// import DropdownMenuContent from '$components/ui/dropdown-menu/DropdownMenuContent.svelte';
	// import DropdownMenuItem from '$components/ui/dropdown-menu/DropdownMenuItem.svelte';
	import { page, navigating } from '$app/stores';
	import { goto } from '$app/navigation';
	import Input from '$components/ui/Input.svelte';
	import Kbd from '$components/ui/KBD.svelte';
	import Header from '$components/ui/Header.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { derived, writable } from 'svelte/store';
	import { queryFactory } from '$lib/queries/querykeys';
	import type { LibrarySortType } from '$lib/server/queries';
	import { LoaderIcon } from 'svelte-french-toast';
	import Cmd from '$components/ui/cmd/Cmd.svelte';
	import { defaultParseSearch, defaultStringifySearch } from '$lib/utils/search-params';
	import { filterLibrarySchema, type FilterLibrarySchema } from '$lib/schemas/library';
	import FilterBadge from '$components/ui/filters/FilterBadge.svelte';
	import { createParamsStore, createSearchParamsStore } from '$lib/stores/search-params';
	import { tweened } from 'svelte/motion';
	import { cubicInOut, cubicOut } from 'svelte/easing';
	import { afterUpdate } from 'svelte';
	import { deepWriteable } from '$lib/helpers/object';

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

	const tagsQueryEnabled = writable(false);
	const tagsQuery = createQuery(
		derived(tagsQueryEnabled, ($tagsQueryEnabled) => ({
			...queryFactory.tags.list(),
			enabled: $tagsQueryEnabled
		}))
	);

	const count = tweened(0, {
		duration: 200
	});

	$: if ($entryCount.data) {
		console.log('setting count');
		const newCount = parseInt($entryCount.data, 10);
		console.log({ newCount });
		count.set(newCount, {
			duration: 200
		});
		console.log({ $count });
	}

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
		}
	];
	const filterOpen = writable(false);

	const filterPages = [
		{
			name: 'Types',
			placeholder: 'Filter by type...'
		}
	] as const;
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
					<Command pages={deepWriteable(filterPages)} let:pages let:page>
						<CommandInput onKeydown={pages.handlers.keydown} placeholder="Filter..." />
						<CommandList>
							<CommandGroup>
								{#if !page}
									<CommandItem
										containsPages
										onSelect={() => {
											pages.add('Types');
										}}
									>
										Type
									</CommandItem>
								{:else if page.name === 'Types'}
									{#each types as type}
										<CommandItem>
											{type}
										</CommandItem>
									{/each}
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
					<DropdownMenuRadioGroup bind:value={sort}>
						{#each sortTypes as { label, type }}
							<!-- TODO: Checkbox Item -->
							<DropdownMenuRadioItem value={type}>{label}</DropdownMenuRadioItem>
						{/each}
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
{#if /*$hasFilters*/ false}
	<Header class="static">
		{#each Object.entries($filters) as [type, filter]}
			<FilterBadge {type} {filter} />
			<!-- <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">{key}</span>
                <span class="text-xs text-muted-foreground">{value}</span>
            </div> -->
		{/each}
	</Header>
{/if}

<Filter />
<!-- TODO: Show FIlter bar here -->
