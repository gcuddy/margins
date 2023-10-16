<script lang="ts">
	// Get from search params, build and go

	import * as Filter from '$components/ui/filters';
	import { mutate, type QueryInput } from '$lib/queries/query';
	import { derived } from 'svelte/store';
	import List from '$components/entries/list.svelte';
	import {
		type FilterLibrarySchema,
		parseFilterFromSearchParams,
	} from '$lib/schemas/library';
	import { page } from '$app/stores';

	import * as Select from '$components/ui/select';

	import Separator from '$components/ui/Separator.svelte';
	import { goto } from '$app/navigation';
	import { Button } from '$components/ui/button';

	export let name = '';
	export let id: number | undefined = undefined;
	export let filterData: FilterLibrarySchema | undefined = undefined;
	let localFilterData = filterData ? { ...filterData } : null;
	export let scope: 'library' | 'all' = 'library';

	// TODO: redirect to search params, or contain mode that doesn't use seach params
	// should this happen in load? onmoun?
	// if (filterData) {
	//     goto($page.url.origin + $page.url.pathname + defaultStringifySearch(filterData))
	// }

    // This is one solution, which would be good, but current setup that makes search params source of truth makes this finicky
	// let ctx = Filter.ctx.set({ initialValue: filterData });
	let ctx = Filter.ctx.set();
    // so instead we'll use onmount and goto
    onMount(() => {
        if (filterData) {
            goto($page.url.origin + $page.url.pathname + defaultStringifySearch(filterData), {
                invalidateAll: false,
                keepFocus: true,
                replaceState: true,
            })
        }
    })

	import { Layers } from 'radix-icons-svelte';
	import { toast } from 'svelte-sonner';
	import { defaultStringifySearch } from '$lib/utils/search-params';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher<{
		scopechange: { scope: 'library' | 'all' };
	}>();

	function changeScope() {
		dispatch('scopechange', { scope });
	}
	const {
		helpers: { navigateSearch },
		state: { hasFilters, filterStore },
	} = ctx;

	const entryQueryOpts = derived(
		[filterStore, hasFilters, page],
		([$filterStore, $hasFilters, $page]) => {
			console.log({ $filterStore });
			console.log({ localFilterData });
			// use search params as source of truth...
			const filter = localFilterData
				? localFilterData
				: parseFilterFromSearchParams($page.url.search);
			if (localFilterData) {
				// now set it undefined so it doesn't get used again
				localFilterData = null;
			}
			console.log({ filter });
			return {
				dir: 'desc',
				filter,
				library: scope === 'library' ? true : false,
				sort: 'published',
				status: null,
			} satisfies QueryInput<'get_library'>;
		},
	);

	const selectedScope = derived(page, ($page) => {
		return {
			label: scope === 'library' ? 'Library' : 'Everything',
			value: scope,
		};
	});
</script>

<!-- TODO: fix weird shadows, idk what I was thinking -->
<div class="transition-[padding] p-2 w-full sticky top-0 bg-background z-[1]">
	<div
		class="shadow w-full border rounded-lg overflow-hidden sticky top-0 flex flex-col"
	>
		<div class="px-6 pt-4">
			<input
				bind:value={name}
				type="text"
				class="grow w-full placeholder:text-muted-foreground font-medium"
				placeholder={'Untitled new view'}
			/>
		</div>
		<Filter.Root context={ctx}>
			<div class="flex justify-between items-center px-6 pt-4 pb-2">
				<div class="flex gap-x-4 items-center">
					<div class="flex flex-col gap-1">
						<!-- <Label for="scope">Scope</Label> -->
						<Select.Root
							selected={$selectedScope}
							positioning={{
								placement: 'bottom-start',
								strategy: 'fixed',
							}}
							onSelectedChange={(val) => {
								if (val) {
									// @ts-expect-error
									scope = val.value;
									changeScope();
								}
							}}
						>
							<Select.Trigger class="h-9 w-fit" id="scope">
								<Select.Value placeholder="Select scope" />
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									<Select.Label>Scope</Select.Label>
									<Select.Item label="Library" value="library"
										>Library</Select.Item
									>
									<Select.Item label="Everything" value="all"
										>Everything</Select.Item
									>
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>
					<Separator orientation="vertical" class="h-7" />
					If <Select.Root
						selected={{
							label: $entryQueryOpts?.filter?.any ? 'Any' : 'All',
							value: $entryQueryOpts?.filter?.any ? true : false,
						}}
						positioning={{
							placement: 'bottom-start',
							strategy: 'fixed',
						}}
						onSelectedChange={(val) => {
							if (val?.value) {
								navigateSearch((data) => ({
									...data,
									any: true,
								}));
							} else {
								navigateSearch((data) => {
									const { any, ...rest } = data;
									return rest;
								});
							}
						}}
					>
						<Select.Trigger class="w-fit">
							<Select.Value />
						</Select.Trigger>
						<Select.Content class="w-fit">
							<Select.Group>
								<Select.Item value={false} label="All">All</Select.Item>
								<Select.Item value={true} label="Any">Any</Select.Item>
							</Select.Group>
						</Select.Content>
					</Select.Root>
					of the following are true
				</div>
				<div>
					<Button
                        disabled={!$hasFilters}
						on:click={async () => {
							const filterData = parseFilterFromSearchParams($page.url.search);
							if (filterData) {
								toast.promise(
									mutate('viewUpsert', {
										//@ts-expect-error idk
										filterData,
										name,
										id,
										type: scope === 'library' ? 'Library' : 'All',
									}),
									{
										loading: 'Saving view...',
										success: (data) => {
											goto(`/views/${data.id}`);
											return 'View saved';
										},
										error: 'Failed to save view',
										info: '',
										warning: '',
									},
								);
							}
						}}
						variant="default"
						size="sm"
					>
						<Layers class="mr-1" />
						Save view
					</Button>
				</div>
			</div>
			<Filter.Row alwaysShow showSaveView={false}>
				<svelte:fragment slot="start"></svelte:fragment>
			</Filter.Row>
		</Filter.Root>
	</div>
</div>
{#if $hasFilters}
	<List opts={entryQueryOpts} />
{/if}
