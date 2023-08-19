<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';

	import { defaultStringifySearch, parseSearchWithSchema } from '$lib/utils/search-params';

	import CreatedAt from './conditions/CreatedAt.svelte';

	import { setContext } from 'svelte';

	import { writable } from 'svelte/store';

	import { melt } from '@melt-ui/svelte';

	import { cn } from '$lib/utils';

	import { buttonVariants } from '../Button.svelte';

	import { filterLibrarySchema, type FilterLibrarySchema } from '$lib/schemas/library';
	import { formatDate } from '$lib/utils/date';
	import Badge, { badgeVariants } from '../Badge.svelte';
	type TFilterKey = $$Generic<keyof FilterLibrarySchema>;
	import { Select, SelectContent, SelectItem, SelectGroup } from '$components/ui/select';
	import { Select as SelectPrimitive } from '@huntabyte/primitives';
	import Type from './conditions/Type.svelte';
	import Tags from './conditions/Tags.svelte';
	import ReadingTime from './conditions/ReadingTime.svelte';

	export let type: TFilterKey;
	export let filter: FilterLibrarySchema[TFilterKey];

	// TODO: these types are all messed up
	function getFilter<TKey extends keyof FilterLibrarySchema>(_type: TKey, _filter: typeof filter) {
		return _filter as FilterLibrarySchema[TKey];
	}
	function getKeys<T extends object>(obj: T): Array<keyof T> {
		return Object.keys(obj) as Array<keyof T>;
	}

	const container = writable<HTMLElement | null>(null);
	setContext('filterContainer', container);
</script>

<!-- Here lies dragons... -->
<div bind:this={$container}>
	{#if type === 'createdAt'}
		<!-- filter should equal FilterLibrarySchema["createdAt"] -->
		{@const _f = getFilter('createdAt', filter)}
		{@const filters = Array.isArray(_f) ? _f : [_f]}
		{#each filters.filter(Boolean) as filter, idx}
			{@const key = 'gte' in filter ? 'gte' : 'lte' in filter ? 'lte' : 'equals'}
			<CreatedAt
				on:delete={() => {
					console.log(`deleting`);
					const search = parseSearchWithSchema($page.url.search, filterLibrarySchema);
					const { createdAt } = search;
					const createdAts = [...filters];
					createdAts[idx] = undefined;
					const newSearch = {
						...search,
						createdAt: createdAts.filter(Boolean).length ? createdAts : undefined
					};
					for (const key in newSearch) {
						if (newSearch[key] === undefined) {
							delete newSearch[key];
						}
					}
					const newStr = defaultStringifySearch(newSearch);
					console.log({ newSearch, createdAts, newStr });
					const url = $page.url.pathname + newStr;
					goto(url, {
						replaceState: true,
						noScroll: true,
						keepFocus: true
					});
				}}
				on:change={({ detail }) => {
					console.log({ detail });
					const search = parseSearchWithSchema($page.url.search, filterLibrarySchema);
					const { createdAt } = search;
					const createdAts = [...filters];
					createdAts[idx] = detail;
					// const createdAts = createdAt ? (Array.isArray(createdAt) ? createdAt : [createdAt]) : [];
					const newSearch = {
						...search,
						createdAt: createdAts
					};
					console.log({ newSearch });
					const newStr = defaultStringifySearch(newSearch);
					const url = $page.url.pathname + newStr;
					goto(url, {
						replaceState: true,
						noScroll: true,
						keepFocus: true
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
				<Tags ids={tags.ids} />
			</div>
		{/if}
	{:else if type === 'readingTime'}
		{@const readingTime = getFilter('readingTime', filter)}
		{#if readingTime}
			<div class="flex flex-wrap">
				<ReadingTime {readingTime} />
			</div>
		{/if}
	{/if}
</div>
