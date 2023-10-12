<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import debounce from 'just-debounce-it';
	import {
		ArrowDownUpIcon,
		BookIcon,
		ClockIcon,
		FileIcon,
		FilterIcon,
		GlobeIcon,
		Loader2Icon,
		TagIcon,
		TypeIcon,
		XIcon,
	} from 'lucide-svelte';
	import { tweened } from 'svelte/motion';
	import { derived, writable } from 'svelte/store';

	import { goto } from '$app/navigation';
	// import DropdownMenu from '$components/ui/dropdown-menu/DropdownMenu.svelte';
	// import DropdownMenuTrigger from '$components/ui/dropdown-menu/DropdownMenuTrigger.svelte';
	// import DropdownMenuContent from '$components/ui/dropdown-menu/DropdownMenuContent.svelte';
	// import DropdownMenuItem from '$components/ui/dropdown-menu/DropdownMenuItem.svelte';
	import { navigating, page } from '$app/stores';
	import { Button } from '$components/ui/button';
	import { createPageData } from '$components/ui/command2/utils';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuLabel,
		DropdownMenuRadioGroup,
		DropdownMenuRadioItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger,
	} from '$components/ui/dropdown-menu';
	import * as Filter from '$components/ui/filters';
	import Header from '$components/ui/Header.svelte';
	import Input from '$components/ui/input/input.svelte';
	import Kbd from '$components/ui/KBD.svelte';
	import {
		defaultViewPreferences,
		ViewPreferences,
	} from '$components/view-preferences';
	import { queryFactory } from '$lib/queries/querykeys';
	import {
		filterLibrarySchema,
		type FilterLibrarySchema,
		type LibraryGroupType,
	} from '$lib/schemas/library';
	import type { LibrarySortType } from '$lib/server/queries';
	import { createFilterDialogStore } from '$lib/stores/filters';
	import {
		createChangeSearch,
		defaultParseSearch,
	} from '$lib/utils/search-params';

	let filter: Input;
	let form: HTMLFormElement;
	const value = $page.url.searchParams.get('search') ?? '';

	// const entryCount = createQuery(
	// 	derived(page, ($page) => ({
	// 		...queryFactory.entries.count({
	// 			filter: {
	// 				search: $page.url.searchParams.get('search') ?? undefined,
	// 				type: $page.data.type,
	// 			},
	// 			status: $page.data.Status,
	// 		}),
	// 		select: (data: { count: number }) => data.count,
	// 	})),
	// );

	const tagsQuery = createQuery(queryFactory.tags.list());

	const filterChange = createChangeSearch<FilterLibrarySchema>();

	const count = tweened(0, {
		duration: 200,
	});

	export function setCount(newCount: number) {
		count.set(newCount, {
			duration: 200,
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

	// $: if ($entryCount.data) {
	// 	count.set($entryCount.data, {
	// 		duration: 500,
	// 		// easing: quintIn
	// 	});
	// }

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
		if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
			return;
		}
		if (e.target instanceof HTMLInputElement) {
			return;
		}
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

		return parsed.success ? parsed.data : {};
	});

	// const filterStore = createParamsStore(filterLibrarySchema);

	// $: console.log({ $filterStore });

	// const searchStr = derived([filters, page], [$filters, $page] => {
	//     // const
	// })

	const filterDialogStore = createFilterDialogStore();

	export let saveViewUrl: string | undefined = undefined;

	// TODO: these should affect the url params
	const sortTypes: Array<{
		label: string;
		type: NonNullable<LibrarySortType>;
	}> = [
		{
			label: 'Manual',
			type: 'manual',
		},
		{
			label: 'Title',
			type: 'title',
		},
		{
			label: 'Author',
			type: 'author',
		},
		{
			label: 'Date Updated',
			type: 'updatedAt',
		},
		{
			label: 'Date Saved',
			type: 'createdAt',
		},
		{
			label: 'Time',
			type: 'time',
		},
	];
	const filterOpen = writable(false);

	const filterPageData = createPageData([
		{
			icon: FileIcon,
			name: 'Type',
			placeholder: 'Filter by type...',
		},
		{
			icon: TagIcon,
			name: 'Tags',
			placeholder: 'Filter by tag...',
			shouldFilter: false,
		},
		{
			icon: ClockIcon,
			name: 'Reading Time',
			placeholder: 'Filter by reading time...',
		},
		{
			action: () => {
				filterOpen.set(false);
				filterDialogStore.open({
					action(val) {
						filterChange($page.url, (data) => {
							data.domain = val;
							return data;
						});
					},
					title: 'Filter by domain',
					value: '',
				});
			},
			icon: GlobeIcon,
			name: 'Domain',
		},
		{
			action: () => {
				filterOpen.set(false);
				filterDialogStore.open({
					action(val) {
						filterChange($page.url, (data) => {
							console.log({ data });
							data.title = {
								contains: val,
							};
							return data;
						});
					},
					title: 'Filter by title',
					value: '',
				});
			},
			icon: TypeIcon,
			name: 'Title',
		},
		{
			icon: BookIcon,
			name: 'Book Genre',
			placeholder: 'Choose genre…',
		},
	]);

	export let viewPreferences = defaultViewPreferences;
	export let viewPreferencesId: string;
</script>

<svelte:window on:keydown={handle_keydown} />
<!--  -->
<Filter.Root let:hasFilters let:reset>
	<Header
		class="max-sm:static max-sm:flex-col max-sm:h-max max-sm:items-start max-sm:py-2"
	>
		<!-- class="flex flex-1 items-center justify-start gap-x-4" -->
		<div
			class="flex items-center gap-3 flex-1 min-w-0 max-sm:flex-col max-sm:items-start"
		>
			<slot name="title">
				<h1 class="font-bold text-base">Library</h1>
			</slot>
			<!-- <H1>{data.Status}</H1> -->
			<div class="flex items-center gap-3 flex-1 min-w-0">
				<slot name="buttons" />
				<noscript>
					<!-- hm -->
				</noscript>

				{#if hasFilters}
					<Button
						on:click={reset}
						size="sm"
						class="border-dashed"
						variant="outline"
					>
						<span class="lg:inline hidden">Clear filters</span>
						<XIcon class="lg:ml-2 h-4 w-4" />
					</Button>
				{:else}
					<Filter.Button>
						<FilterIcon class="lg:mr-2 h-4 w-4" />
						<span class="lg:inline hidden">Filter</span>
					</Filter.Button>
				{/if}
				<!-- {#if filter_type}
					<div class="flex">
						<Button href={$page.url.pathname} variant="ghost" size="sm">
							<span class="lg:inline hidden">Reset</span>
							<XIcon class="lg:ml-2 h-4 w-4" />
						</Button>
					</div>
				{/if} -->
				<!-- <span class="text-xs hidden xl:inline text-muted-foreground">
				<span class="tabular-nums">{Math.round($count)}</span> entries
			</span> -->
			</div>
		</div>
		<div class="flex shrink justify-end items-center gap-2">
			{#if loading}
				<Loader2Icon class="h-4 w-4 animate-spin text-muted-foreground" />
			{/if}
			<ViewPreferences bind:viewPreferences id={viewPreferencesId} />
			<div class="hidden md:block">
				<DropdownMenu
					positioning={{
						placement: 'bottom',
					}}
				>
					<DropdownMenuTrigger asChild let:builder>
						<Button builders={[builder]} variant="outline" size="sm">
							<ArrowDownUpIcon class="h-4 w-4 lg:mr-2" />
							<span class="hidden lg:inline">Sort</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Sort</DropdownMenuLabel>
						<DropdownMenuRadioGroup bind:value={sort}>
							{#each sortTypes as { label, type }}
								<DropdownMenuRadioItem value={type}
									>{label}</DropdownMenuRadioItem
								>
							{/each}
						</DropdownMenuRadioGroup>
						<DropdownMenuSeparator />
						<DropdownMenuRadioGroup bind:value={dir}>
							<DropdownMenuRadioItem value="asc"
								>Ascending</DropdownMenuRadioItem
							>
							<DropdownMenuRadioItem value="desc"
								>Descending</DropdownMenuRadioItem
							>
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
				<Kbd
					class="absolute bottom-0 right-1.5 top-0 my-auto group-focus-within:hidden"
					>/</Kbd
				>
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

	<Filter.Row {saveViewUrl} />
</Filter.Root>
