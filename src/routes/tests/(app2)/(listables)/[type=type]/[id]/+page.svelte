<script lang="ts">
	import {
		createQuery,
	} from '@tanstack/svelte-query';
	import { onMount, setContext } from 'svelte';
	import { derived, writable } from 'svelte/store';

	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Skeleton from '$components/ui/skeleton/Skeleton.svelte';
	import { queryFactory } from '$lib/queries/querykeys';
	import { recents } from '$lib/stores/recents';
	import { numberOrString } from '$lib/utils/misc';
	import { cn } from '$lib/utils/tailwind';

	import { getEntryContext } from '../ctx';
	import type { PageData } from './$types';
	import { get_module } from './module';
	// import Mentions from './Mentions.svelte';

	export let data: PageData;

	$: ({ type } = data);

	const query = createQuery(
		derived(page, ($page) => {
			return {
				...(typeof $page.params.id === 'string'
					? queryFactory.entries.detail({
							id: numberOrString($page.params.id),
							type: data.type,
					  })
					: {}),
				placeholderData: undefined,
			};
		}),
	);

	afterNavigate(() => {
		// push to recents
		// save interaction
		if (!$query.data?.entry) return;
		if ($query.data.entry.title) {
			recents.add_entry($query.data.entry);
		}
		if ($query.data.entry.type !== 'article') return;
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


	const { rightSidebar } = getEntryContext();

	onMount(async () => {
		// try to get component if it doesn't exist, for example we're mounting this component elsewhere
		if (!data.component) {
			const module = await get_module(data.type);
			data.component = module?.default;
		}
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
			? 'w-full md:w-[calc(100%-(var(--right-sidebar-width)))]'
			: 'w-full', // width is 100% - right sidebar width + 64px (to account for padding) if showing, otherwise just 100%

		// current_list && 'rounded-lg border bg-card text-card-foreground shadow-lg h-full  grow'
	)}
>
	{#if $query.isPlaceholderData || $query.isLoading}
		<Skeleton class="w-full h-[300px]" />
	{:else if $query.isSuccess}
		{#if type === 'article'}
			<svelte:component
				this={data.component}
				data={{
					...data,
					...$query.data,
				}}
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags-->
				{@html $query.data.entry?.html}
			</svelte:component>
		{:else}
			<svelte:component this={data.component} {data} />
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
