<script lang="ts">
	// Get from search params, build and go

	import * as Filter from '$components/ui/filters';
	import Header from '$components/ui/Header.svelte';
	import type { QueryInput } from '$lib/queries/query';
	import { derived } from 'svelte/store';
	import List from '$components/entries/list.svelte';
	import { parseFilterFromSearchParams } from '$lib/schemas/library';
	import { page } from '$app/stores';

	import * as Select from '$components/ui/select';
	import Label from '$lib/components/ui/Label.svelte';

	import Separator from '$components/ui/Separator.svelte';
	import { goto } from '$app/navigation';

	let ctx = Filter.ctx.set();

	const {
        helpers: { navigateSearch },
		state: { hasFilters, filterStore },
	} = ctx;

	const entryQueryOpts = derived(
		[filterStore, hasFilters, page],
		([$filterStore, $hasFilters, $page]) => {
			console.log({ $filterStore });
			// use search params as source of truth...
			const filter = parseFilterFromSearchParams($page.url.search);
			console.log({ filter });
			return {
				dir: 'desc',
				filter,
				library:
					$page.params.customviewscope?.toLowerCase() === 'library'
						? true
						: false,
				sort: 'published',
				status: null,
			} satisfies QueryInput<'get_library'>;
		},
	);

	const selectedScope = derived(page, ($page) => {
		return {
			label:
				$page.params.customviewscope?.toLowerCase() === 'library'
					? 'Library'
					: 'Everything',
			value: $page.params.customviewscope?.toLowerCase(),
		};
	});
</script>

<div class="transition-[padding] p-2 w-full sticky top-0 bg-background z-[1]">
	<div class="shadow w-full border rounded-lg overflow-hidden sticky top-0">
		<Header>New view</Header>
		<Filter.Root context={ctx}>
			<div class="flex gap-x-4 items-center px-6 pt-4 pb-2">
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
								goto(`/tests/views/explore/${val.value}${$page.url.search}`);
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
                            navigateSearch(data => ({
                                ...data,
                                any: true
                            }))
                        } else {
                            navigateSearch(data => {
                                const { any, ...rest } = data;
                                return rest;
                            })
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
			<Filter.Row alwaysShow showSaveView={false}>
				<svelte:fragment slot="start"></svelte:fragment>
			</Filter.Row>
		</Filter.Root>
	</div>
</div>
{#if $hasFilters}
	<List opts={entryQueryOpts} />
{/if}
