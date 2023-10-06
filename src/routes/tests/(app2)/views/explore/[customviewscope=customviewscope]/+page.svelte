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
	import Separator from '$components/ui/Separator.svelte';
	import { goto } from '$app/navigation';

	let ctx = Filter.ctx.set();

	const {
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
			label: $page.params.customviewscope?.toLowerCase() === 'library' ? "Library" : "All",
			value: $page.params.customviewscope?.toLowerCase(),
		};
	});
</script>

<div class="transition-[padding] p-2 w-full sticky top-0 bg-background z-[1]">
	<div class="shadow w-full border rounded-lg overflow-hidden sticky top-0">
		<Header>New view</Header>
		<Filter.Root {ctx}>
			<Filter.Row alwaysShow showSaveView={false}>
				<svelte:fragment slot="start">
					<Select.Root selected={$selectedScope} positioning={{
                        placement: "bottom-start",
                        strategy: "fixed",
                    }} onSelectedChange={(val) => {
                        if (val) {
                            goto(`/tests/views/explore/${val.value}${$page.url.search}`)
                        }
                    }}>
						<Select.Trigger class="h-9">
							<Select.Value placeholder="Select scope" />
						</Select.Trigger>
						<Select.Content>
                            <Select.Group>
                                <Select.Label>Scope</Select.Label>
							<Select.Item label="Library" value="library">Library</Select.Item>
							<Select.Item label="All" value="all">All</Select.Item>
                            </Select.Group>
						</Select.Content>
					</Select.Root>
                    <Separator orientation="vertical" class="h-7" />
				</svelte:fragment>
			</Filter.Row>
		</Filter.Root>
	</div>
</div>
{#if $hasFilters}
	<List opts={entryQueryOpts} />
{/if}
