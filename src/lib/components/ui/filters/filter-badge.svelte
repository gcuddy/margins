<script lang="ts">
	import { objectEntries, objectKeys, omit } from '$lib/helpers';

	import {
		comparatorToDisplay,
		stringComparatorSchema,
	} from '$lib/schemas/inputs/comparators';

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		filterLibrarySchema,
		type FilterLibrarySchema,
	} from '$lib/schemas/library';
	import {
		createChangeSearch,
		defaultStringifySearch,
		parseSearchWithSchema,
	} from '$lib/utils/search-params';

	import Badge, { badgeVariants } from '../Badge.svelte';
	import CreatedAt from './conditions/CreatedAt.svelte';
	import { ctx } from './ctx';

	import { TypeIcon, XIcon } from 'lucide-svelte';
	import BadgeSelect from './badge-select.svelte';
	import ReadingTime from './conditions/ReadingTime.svelte';
	import Tags from './conditions/Tags.svelte';
	import Type from './conditions/Type.svelte';
	import ConditionLayout from './helpers/ConditionLayout.svelte';
	import { cn } from '$lib/utils';

	type FilterKeys = keyof FilterLibrarySchema;

	type T = $$Generic<FilterKeys>;

	export let type: T;
	export let filter: FilterLibrarySchema[T];

	const filterChange = createChangeSearch<FilterLibrarySchema>();

	// TODO: these types are all messed up
	function getFilter<TKey extends keyof FilterLibrarySchema>(
		_type: TKey,
		_filter: typeof filter,
	) {
		return _filter as FilterLibrarySchema[TKey];
	}
	function getKeys<T extends object>(obj: T): Array<keyof T> {
		return Object.keys(obj) as Array<keyof T>;
	}

	const container = writable<HTMLElement | null>(null);
	setContext('filterContainer', container);

	const {
		state: { dialogStore, filterStore },
	} = ctx.get();
</script>

<!-- Here lies dragons... -->
<div bind:this={$container}>
	{#if type === 'createdAt'}
		<!-- filter should equal FilterLibrarySchema["createdAt"] -->
		{@const _f = getFilter('createdAt', filter)}
		{@const filters = Array.isArray(_f) ? _f : [_f]}
		{#each filters.filter(Boolean) as filter, idx}
			{@const key =
				'gte' in filter ? 'gte' : 'lte' in filter ? 'lte' : 'equals'}
			<CreatedAt
				on:delete={() => {
					console.log(`deleting`);
					const search = parseSearchWithSchema(
						$page.url.search,
						filterLibrarySchema,
					);
					const { createdAt } = search;
					const createdAts = [...filters];
					createdAts[idx] = undefined;
					const newSearch = {
						...search,
						createdAt: createdAts.filter(Boolean).length
							? createdAts
							: undefined,
					};
					for (const key in newSearch) {
						if (newSearch[key] === undefined) {
							delete newSearch[key];
						}
					}
					const newStr = defaultStringifySearch(newSearch);
					console.log({ createdAts, newSearch, newStr });
					const url = $page.url.pathname + newStr;
					goto(url, {
						keepFocus: true,
						noScroll: true,
						replaceState: true,
					});
				}}
				on:change={({ detail }) => {
					console.log({ detail });
					const search = parseSearchWithSchema(
						$page.url.search,
						filterLibrarySchema,
					);
					const { createdAt } = search;
					const createdAts = [...filters];
					createdAts[idx] = detail;
					// const createdAts = createdAt ? (Array.isArray(createdAt) ? createdAt : [createdAt]) : [];
					const newSearch = {
						...search,
						createdAt: createdAts,
					};
					console.log({ newSearch });
					const newStr = defaultStringifySearch(newSearch);
					const url = $page.url.pathname + newStr;
					goto(url, {
						keepFocus: true,
						noScroll: true,
						replaceState: true,
					});
				}}
				{filter}
			/>
		{/each}
	{:else if type === 'type' && filter}
		{@const type = getFilter('type', filter)}
		{#if type}
			<Type {type} />
		{/if}
	{:else if type === 'tags' && filter}
		{@const tags = getFilter('tags', filter)}
		{#if tags}
			<div class="flex flex-wrap">
				<Tags {...tags} />
			</div>
		{/if}
	{:else if type === 'readingTime'}
		{@const readingTime = getFilter('readingTime', filter)}
		{#if readingTime}
			<div class="flex flex-wrap">
				<ReadingTime {readingTime} />
			</div>
		{/if}
	{:else if type === 'title'}
		{@const title = getFilter('title', filter)}
		{#if title}
			{#each objectEntries(title) as [key, value]}
				<div class="flex h-6 min-w-0">
					<Badge
						variant="outline"
						class="rounded-r-none border-r-0 flex gap-1 pl-0"
					>
						<TypeIcon class="h-3 w-" />
						Title</Badge
					>
					<BadgeSelect
						class="rounded-none border"
						choices={objectKeys(
							omit(stringComparatorSchema.shape, 'in', 'nin', 'search'),
						).map((key) => ({
							label: comparatorToDisplay[key],
							value: key,
						}))}
						selected={{
							label: comparatorToDisplay[key],
							value: key,
						}}
						onSelectedChange={(val) => {
							filterChange($page.url, (data) => {
								if (data.title) {
									delete data.title[key];
									// TODO: fix
									data.title[val.value] = value;
								}
								console.log({ data });
								return data;
							});
						}}
					/>
					<Badge
						on:click={() => {
							if (typeof value === 'string') {
								dialogStore.open({
									action: (value) => {
										filterChange($page.url, (data) => {
											data.title[key] = value;
											console.log({ data });
											return data;
										});
									},
									title: 'Filter by title',
									value,
								});
							}
						}}
						variant="outline"
						class="rounded-none min-w-0 border-x-0 cursor-pointer max-w-[80px] truncate"
					>
						<span class="truncate">{value}</span>
					</Badge>
					<button
						on:click={() => {
							filterChange($page.url, (data) => {
                                if (data.title) {
                                    delete data.title[key];
                                    console.log({data})
                                    if (objectKeys(data.title).length === 0) {
                                        console.log('deleting title')
                                        delete data.title;
                                    }
                                }
                                console.log(`setting to`, {data})
								return data;
							});
						}}
						class={cn(badgeVariants({ variant: 'outline' }), 'rounded-l-none')}
					>
						<XIcon class="w-3 h-3" />
					</button>
				</div>
			{/each}
			<div class="flex">
				<!-- <Badge variant="outline" class="rounded-r-none border-r-0">"Title"</Badge>
                <Badge variant="outline" class="rounded-none border">{title}</Badge>
                <Badge variant="outline" class="rounded-r-none border-r-0">"Title"</Badge> -->
			</div>
		{/if}
	{:else if type === 'domain'}
		<!-- TODO: scope alert dialog into Filter so that we can set it from here with ctx -->
		<ConditionLayout
			name="Domain"
			on:delete={() => filterStore.delete('domain')}
		>
			<svelte:fragment slot="value">
				{filter}
			</svelte:fragment>
		</ConditionLayout>
	{:else if type === 'feed'}
		{@const feed = getFilter('feed', filter)}
		{#if feed}
			{#each objectEntries(feed) as [key, value]}
				{#if value}
					<div class="flex h-6 min-w-0">
						<Badge
							variant="outline"
							class="rounded-r-none border-r-0 flex gap-1 pl-0"
						>
							<TypeIcon class="h-3 w-" />
							Feed</Badge
						>
						<Badge class="rounded-none border">
							{comparatorToDisplay[key]}
						</Badge>
						<Badge
							on:click={() => {
								if (typeof value === 'string') {
									dialogStore.open({
										action: (value) => {
											filterChange($page.url, (data) => {
												data.title[key] = value;
												console.log({ data });
												return data;
											});
										},
										title: 'Filter by title',
										value,
									});
								}
							}}
							variant="outline"
							class="rounded-none min-w-0 border-x-0 cursor-pointer max-w-[80px] truncate"
						>
							<span class="truncate">{value}</span>
						</Badge>
						<button
							on:click={() => {
								filterChange($page.url, (data) => {
									delete data.title[key];
									return data;
								});
							}}
							class={cn(
								badgeVariants({ variant: 'outline' }),
								'rounded-l-none',
							)}
						>
							<XIcon class="w-3 h-3" />
						</button>
					</div>
				{/if}
			{/each}
		{/if}
	{/if}
</div>
