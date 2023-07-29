<script lang="ts">
	import { H1 } from '$lib/components/ui/typography';

	import { page } from '$app/stores';
	import Annotation from '$lib/components/notebook/Annotation.svelte';
	import { query } from '$lib/queries/query';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import type { PageData } from './$types';
	import Skeleton from '$lib/components/ui/skeleton/Skeleton.svelte';
	import Intersector from '$lib/components/Intersector.svelte';

	export let data: PageData;

	// const notebook = createInfiniteQuery({
	// 	queryKey: ['notebook'],
	// 	queryFn: ({ pageParam }) => query($page, 'notebook', { cursor: pageParam ?? undefined }),
	// 	staleTime: 1000 * 60 * 2,
	// 	defaultPageParam: <Date | null>null,
	// 	getNextPageParam: (lastpage) => {
	// 		console.log({ lastpage });
	// 		return (lastpage as any).nextCursor ?? undefined;
	// 	}
	// });
</script>

<H1>Annotations</H1>

{#each data.notes.notes as annotation (annotation.id)}
	<Annotation {annotation} />
{/each}
<!-- <div class="grid-cols mt-4 grid gap-4 md:grid-cols-2">
	{#if $notebook.isLoading}
		<Skeleton class="h-36 w-full" />
		<Skeleton class="h-36 w-full" />
		<Skeleton class="h-36 w-full" />
		<Skeleton class="h-36 w-full" />
	{:else if $notebook.isError}
		<p>{$notebook.error.message}</p>
	{:else if $notebook.isSuccess}
		{#each $notebook.data.pages as page}
			{#each page.notes as annotation (annotation.id)}
				<Annotation {annotation} />
			{/each}
		{/each}
		{#if $notebook.isFetchingNextPage}
			{#each Array(10) as _}
				<Skeleton class="h-36 w-full" />
			{/each}
		{/if}
		<Intersector
			cb={() => {
				if ($notebook.hasNextPage && !$notebook.isFetchingNextPage) {
					$notebook.fetchNextPage();
				}
			}}
		/>
	{/if}
</div> -->
