<script lang="ts">
	import {
		createMutation,
		createQuery,
		type InfiniteData,
		useQueryClient,
	} from '@tanstack/svelte-query';
	import { onMount, setContext } from 'svelte';
	import { derived, writable } from 'svelte/store';

	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Skeleton from '$components/ui/skeleton/Skeleton.svelte';
	import {
		mutate,
		type MutationInput,
		type QueryOutput,
	} from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';
	import { recents } from '$lib/stores/recents';
	import { numberOrString } from '$lib/utils/misc';
	import { cn } from '$lib/utils/tailwind';

	import { getEntryContext } from '../ctx';
	import type { PageData } from './$types';
	import { get_module } from './module';
	import ProgressForm from './ProgressForm.svelte';
	import { entryDetailsQuery } from './query';
	import {
		initUpdateBookmarkMutation,
		setGetLibraryData,
	} from '$lib/queries/mutations';
	// import Mentions from './Mentions.svelte';

	export let data: PageData;

	$: ({ type, queryKey } = data);

	$: query = createQuery({
		...queryFactory.entries.detail({
			type,
			id: data.id,
		}),
		initialData: data.queryData,
	});

	// Mark as seen mutation

	const queryClient = useQueryClient();

	const markAsSeenMutation = createMutation({
		mutationFn: (input: MutationInput<'userEntryInsert'>) =>
			mutate('userEntryInsert', input),
		onMutate(variables) {
			const {
				seen,
			} = variables;
			if (seen === undefined) return;
			// edit entries->list and entries-> details with this data
			setGetLibraryData(queryClient, (entry) => {
				if (entry.id === variables.entryId) {
					return {
						...entry,
						seen,
					};
				}
				return entry;
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries(queryFactory.entries.list());
			queryClient.invalidateQueries(queryFactory.subscriptions.all());
		},
	});

	const saveInteractionMutation = createMutation({
		mutationFn: (data: MutationInput<'saveInteraction'>) => {
			return mutate('saveInteraction', data);
		},
		onMutate(variables) {
			// TODO: try to set query data
			// queryClient.setQueriesData<InfiniteData<QueryOutput<'get_library'>>>(
			// 	{
			// 		queryKey: ['entries', 'list'],
			// 	},
			// 	(old) => {
			//         console.log(`setquerydata`, { old } )
			// 		if (!old) {
			// 			return old;
			// 		}
			//         console.log({variables})
			//         // const { finished, is_read, last_viewed, progress, seen } = variables;
			// 		const newData = {
			// 			...old,
			// 			pages: old.pages.map((page) => {
			// 				return {
			// 					...page,
			// 					entries: page.entries.map((entry) => {
			// 						if (entry.id === variables.entryId) {
			// 							return {
			// 								...entry,
			// 								// ...variables,
			// 								seen: +variables.seen,
			// 							};
			// 						}
			// 						return entry;
			// 					}),
			// 				};
			// 			}),
			// 		};
			// 		// console.log({ newData });
			// 		return newData;
			// 	},
			// );
		},
		onSuccess: () => {
			queryClient.invalidateQueries(queryFactory.entries.list());
			// queryClient.invalidateQueries(data.query);
		},
	});

	afterNavigate(() => {
		// push to recents
		// save interaction
		const entryId = data.entry?.id;
		const bookmarkId = data.entry?.bookmark?.id;
		if (entryId) {
			// if (!data.entry?.) {
			// mark as seen
			$markAsSeenMutation.mutate({
				entryId,
                seen: new Date()
			});
			// data.entry.seen = true;
			// }
		}
		if (!$query.data?.entry) {
			return;
		}
		if ($query.data.entry.title) {
			recents.add_entry($query.data.entry);
		}
		if ($query.data.entry.type !== 'article') {
			return;
		}

		// void mutation($page, 'saveInteraction', {
		// 	entryId: $query.data.entry.id,
		// 	last_viewed: new Date(),
		// 	is_read: 1,
		// })
	});

	// sync();
	//
	setContext('pdf', writable(null));

	// function sync() {
	// 	if (!$query.data?.entry) return;
	// 	update_entry($query.data.entry.id, $query.data.entry);
	// }

	const { isSetProgressModalOpen, rightSidebar } = getEntryContext();

	onMount(async () => {
		// try to get component if it doesn't exist, for example we're mounting this component elsewhere
		if (!data.component) {
			const module = await get_module(data.type);
			data.component = module?.default;
		}
	});

	// $: console.log(`Here's the data that's getting passed:`, {
	// 	...data,
	// 	...$query.data,
	// });

	$: console.log({
		data,
		$query,
	});
</script>

<svelte:head>
	<title>
		{$query.data?.entry?.title} | {$query.data?.entry?.type}
	</title>
</svelte:head>

<div
	class={cn(
		'grow transition-[width] duration-300',
		type !== 'pdf' && 'mt-[calc(var(--nav-height)+24px)] sm:px-6 px-4', // margin top is nav height + 24px (to account for header) (pdf handles this itself)
		$rightSidebar
			? 'w-full lg:w-[calc(100%-(var(--right-sidebar-width)))]'
			: 'w-full', // width is 100% - right sidebar width + 64px (to account for padding) if showing, otherwise just 100%

		// current_list && 'rounded-lg border bg-card text-card-foreground shadow-lg h-full  grow'
	)}
>
	{#if $query.isPlaceholderData || $query.isLoading}
		<Skeleton class="w-full h-[300px]" />
	{:else if $query.data}
		{#if type === 'article'}
			<svelte:component
				this={data.component}
				{query}
				data={{
					...data,
					// ...$query.data,
				}}
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags-->
				{@html $query.data.entry?.html}
			</svelte:component>
		{:else}
			<!-- <pre> -->

			<!-- {JSON.stringify($query.data, null, 2)} -->
			<!-- </pre> -->
			<svelte:component
				this={data.component}
				data={{
					...data,
					...$query.data,
				}}
			/>
			<!-- data={{
					...data,
					// ...$query.data,
				}} -->
		{/if}
	{/if}
</div>

{#if data.entry?.title}
	<!-- <Mentions
		entry={{
			id: data.entry.id,
			title: data.entry.title
		}}
	/> -->
{/if}

<!-- Modals -->
<ProgressForm
	bind:isOpen={$isSetProgressModalOpen}
	progress={$query.data?.entry?.interaction?.progress ?? 0}
	on:save={({ detail }) => {
		const { progress } = detail;
		const entryId = data.entry?.id;
		const interactionId = data.entry?.interaction?.id;
		$saveInteractionMutation.mutate({
			entryId,
			id: interactionId,
			progress,
		});
	}}
/>
