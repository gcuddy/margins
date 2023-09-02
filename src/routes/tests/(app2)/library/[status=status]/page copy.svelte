<script lang="ts">
	import { page } from '$app/stores';
	import EntryList from '$lib/components/entries/EntryList.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/Button.svelte';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog';
	import { H1, Small } from '$lib/components/ui/typography';
	import { getCurrentListContext } from '$lib/stores/currentList';
	import { FilterIcon, Plus } from 'lucide-svelte';
	import LibraryTabs from './LibraryTabs.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { toast } from 'svelte-sonner';
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { statusLookup, types } from '$lib/types';
	import { toggleParam } from '$lib/utils/url';
	import type { Snapshot } from './$types';
	import { Query, QueryOutput, query as qquery } from '$lib/queries/query';
	import {
		CreateInfiniteQueryOptions,
		createInfiniteQuery,
		keepPreviousData,
		useQueryClient
	} from '@tanstack/svelte-query';
	import type { ListInput } from '../fetch.server';
	import { Writable, writable } from 'svelte/store';
	import type { Bookmark } from '@prisma/client';
	import EntryItemSkeleton from '$lib/components/entries/EntryItemSkeleton.svelte';
	import { queryKeys } from '$lib/queries/keys';
	import { useLibrary, useLibraryOptions } from '$lib/queries/queries';
	import Kbd from '$lib/components/ui/KBD.svelte';
	import { cn } from '$lib/utils/tailwind';
	import Cluster from '$lib/components/helpers/Cluster.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { tick } from 'svelte';

	export let data;
	const queryClient = useQueryClient();

	$: console.log({queryClient})
	// $: query = createInfiniteQuery(options);
	$: status = statusLookup[$page.params.status.toLowerCase() as keyof typeof statusLookup];

	let filter_type: string | undefined;

	$: filter_type = $page.url.searchParams.get('type') ?? undefined;

	// $: query = data.query();

	const options = writable({
		...useLibraryOptions(data.Status),
		// staleTime: 0,
		// placeholderData: (previousData) => {
		// 	console.log({ previousData });
		// 	if (!previousData) return undefined;
		// 	if ($options.queryKey[3]?.search) {
		// 		// loop over all entries and filter out ones that don't match the search
		// 		// create copy of previousData
		// 		const filteredData = { ...previousData };
		// 		filteredData.pages.forEach((page) => {
		// 			page.entries = page.entries.filter((entry) => {
		// 				return entry.title.toLowerCase().includes($options.queryKey[3].search.toLowerCase());
		// 			});
		// 		});
		// 		return filteredData;
		// 	}
		// }
		placeholderData: undefined
	});


	// page.subscribe($page => {
	// 	console.log({ $page })
	// 	options.update(o => {
	// 		o.queryKey[2] = statusLookup[$page.params.status.toLowerCase() as keyof typeof statusLookup];
	// 		o.queryKey[3] = {
	// 			...o.queryKey[3],
	// 			type: $page.url.searchParams.get('type') ?? undefined
	// 		}
	// 		return o;
	// 	}
	// })


	let query = createInfiniteQuery(options);
	// $: data.Status, update_status();

	$: console.log({ $query, $options });

	$: {
		console.log('changing status on queryKey')
		const new_status = statusLookup[$page.params.status.toLowerCase() as keyof typeof statusLookup];
		$options.queryKey[2] = new_status;
		query = query;

	}

	$: {
		console.log("setting new filter_type on queryKey")
		// $options.queryKey[3] = {
		// 	...$options.queryKey[3],
		// 	type: filter_type
		// };
		// console.log({$options, $query})
		// query = query;
		// console.log({$query})
	}

	// $: {
	// 	let changed = false;
	// 	const new_status = statusLookup[$page.params.status.toLowerCase() as keyof typeof statusLookup];
	// 	const prev_status = $options.queryKey[2];
	// 	if (new_status !== prev_status) {
	// 		$options.queryKey[2] = new_status;
	// 		changed = true;
	// 	}
	// 	console.log(filter_type);
	// 	const prev_type = $options.queryKey[3]?.type;
	// 	if (filter_type !== prev_type) {
	// 		$options.queryKey[3] = {
	// 			...$options.queryKey[3],
	// 			type: filter_type
	// 		};
	// 		changed = true;
	// 	}
	// 	if (changed) query = query;
	// }
	// const query_options = writable({
	// 	queryKey: ['library', $page.params.status],
	// 	queryFn: async ({ queryKey, pageParam }) => {
	// 		const response = await fetch(`/api/entries/library/${queryKey[1]}.json?after_sort=${pageParam?.sort_order ?? ''}&after=${pageParam?.after ?? ''}`);
	// 		if (!response.ok) {
	// 			throw new Error('Network response was not ok');
	// 		}
	// 		const data = await response.json();
	// 		return data;
	// 	},
	// 	initialPageParam: undefined,
	// 	getNextPageParam: (lastPage) => lastPage.nextCursor
	// 	// meta: $page
	// });

	// const query = createInfiniteQuery(query_options);

	// $: {
	// 	$query_options.queryKey[1] = $page.params.status;
	// }

	let active_id: number | undefined = undefined;

	export const snapshot: Snapshot = {
		capture: () => active_id,
		restore: (id) => (active_id = id)
	};

	// $: currentList.set({
	// 	entries: data.entries.entries,
	// 	slug: $page.url.pathname,
	// 	cursor: data.entries.nextCursor,
	// 	context: "bookmarks",
	// });

	const { enhance } = superForm(data.urlForm, {
		invalidateAll: false,
		onSubmit: () => {
			add_url_promise = new Promise((resolve) => {
				resolve_add_url_promise = resolve;
			});
			toast.promise(add_url_promise, {
				loading: 'Adding URL...',
				success: 'URL added!',
				error: 'Failed to add URL.'
			});
		},
		onResult: async () => {
			console.log('HELLLOOOOO');
			url_modal = false;
			resolve_add_url_promise({});
			console.log({ add_url_promise });
			invalidate('entries');
			// queryClient.invalidateQueries({
			// 	queryKey: ['library']
			// });
			queryClient.invalidateQueries({
				queryKey: queryKeys.entries._def
			});
		},
		taintedMessage: null
	});

	let add_url_promise: Promise<any> | null = null;
	let resolve_add_url_promise: (value: any) => void;
	let url_modal = false;

	let filter: Input;
	function handle_keydown(e: KeyboardEvent) {
		if (e.key === '/') {
			e.preventDefault();
			filter.focus();
		}
		// let 1 2 and 3 move you to backlog, now, and archive
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

	let library_tabs: LibraryTabs;

	const search = (e: Event) => {
		$options.queryKey[3] = {
			...$options.queryKey[3],
			search: (e.target as HTMLInputElement).value
		};
		query = query;
	};
</script>

<svelte:window on:keydown={handle_keydown} />

<div class="flex items-center justify-between">
	<H1>Library</H1>
	<div class="flex items-center gap-x-2">
		<Dialog bind:isOpen={url_modal}>
			<svelte:fragment slot="trigger">
				<Button size="sm" class="relative">
					<Plus class="mr-2 h-4 w-4" />
					Add URL
				</Button>
			</svelte:fragment>
			<DialogContent>
				<form action="/tests?/addUrl" method="post" use:enhance>
					<DialogHeader>
						<DialogTitle>Add URL</DialogTitle>
						<DialogDescription>Copy and paste the URL to add.</DialogDescription>
					</DialogHeader>
					<div class="grid gap-4 py-4">
						<div class="grid gap-2">
							<Label for="url">URL</Label>
							<Input name="url" id="url" placeholder="https://example.com/article" />
						</div>
					</div>
					<DialogFooter>
						<Button>Save</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	</div>
</div>
<!-- tabs -->
<div class="z-10 mt-4 flex items-center gap-x-4">
	<LibraryTabs bind:this={library_tabs} />
	<Popover let:close>
		<PopoverTrigger class={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-dashed')}>
			<FilterIcon class="h-4 w-4" />
		</PopoverTrigger>
		<PopoverContent>
			<Small>Filter</Small>
			<!-- <div class="flex gap-x-1 overflow-x-auto scrollbar-hide">
			</div> -->
			<Cluster class="gap-1">
				{#each types as type}
					{@const selected = filter_type === type.toLowerCase()}
					<Button
						on:click={async () => {
							filter_type = selected ? undefined : type.toLowerCase();
							const url = $page.url;
							if (filter_type) url.searchParams.set('type', filter_type);
							else url.searchParams.delete('type');
							goto(url, {
								keepFocus: true,
								replaceState: true,
								noScroll: true,
								invalidateAll: false
							});
							close(null);
							// invalidate('entries');
						}}
						variant={selected ? 'secondary' : 'outline'}
						size="sm"
					>
						{type}
					</Button>
				{/each}
			</Cluster>
		</PopoverContent>
	</Popover>
	{#if filter_type}
		<Badge variant="secondary" class="">
			{filter_type}
		</Badge>
	{/if}
</div>
<form
	on:submit|preventDefault
	class="group relative mt-4 max-w-xs"
	data-sveltekit-keepfocus
	data-sveltekit-replacestate
>
	<Input
		bind:this={filter}
		on:input={search}
		placeholder="Filter in list..."
		type="text"
		name="search"
	/>

	<Kbd class="absolute bottom-0 right-1.5 top-0 my-auto group-focus-within:hidden">/</Kbd>
</form>
{filter_type}
{JSON.stringify($options)}
<!-- {#key $options.queryKey} -->
	{#if $query.isLoading}
		<div class="flex flex-col">
			<EntryItemSkeleton />
			<EntryItemSkeleton />
			<EntryItemSkeleton />
			<EntryItemSkeleton />
			<EntryItemSkeleton />
		</div>
	{:else if $query.isSuccess}
		<EntryList
			bind:active_id
			class="mt-4"
			status={data.status}
			bulkForm={data.bulkForm}
			on:move={(e) => {
				library_tabs.move_entries(e.detail.entries, e.detail.status)
			}}
			entries={$query.data?.pages.flatMap((page) => page.entries) ?? []}
			on:end={async () => {
				console.log('end', $query);
				$query.fetchNextPage();
			}}
		/>
	{/if}
<!-- on:end={async () => {
			console.log('end', $query);
			$query.fetchNextPage();
		}} -->
<!-- <EntryList
		bind:active_id
		class="mt-8"
		status={data.status}
		bulkForm={data.bulkForm}
		entries={data.entries.entries.filter((entry) => entry.status === statusLookup[data.status])}
		on:move={(e) => {
			for (const entry of data.entries.entries) {
				if (entry.id === e.detail.id) {
					entry.status = e.detail.status;
				}
			}
		}}
		on:end={async () => {
			console.log('end', data.entries.nextCursor, appending);
			if (!data.entries.nextCursor) return;
			if (appending) return;
			try {
				const { entries, nextCursor } = await client.query('fetch_list', {
					cursor: data.entries.nextCursor,
					status: statusLookup[data.status],
					take: 25,
					filter: {
						type: data.type
					}
				});
				appending = true;
				console.log({ entries, nextCursor });
				data.entries.entries = [...data.entries.entries, ...entries];
				data.entries.nextCursor = nextCursor;
			} finally {
				appending = false;
				const url = $page.url;
			}
		}}
	/> -->
