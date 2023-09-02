<script lang="ts">
	import { page } from '$app/stores';
	import { query } from '$lib/queries/query';
	import { create_query } from '$lib/state/query-state';
	import Skeleton from './ui/skeleton/Skeleton.svelte';
	import Entry from '../../routes/tests/(app2)/(listables)/[type=type]/[id]/+page.svelte';
	import { setContext } from 'svelte';
	import type { Type } from '$lib/types';

	export let id: number;
	export let type: Type;

	const q = create_query({
		key: `entry:${id}`,
		fn: async () => query($page, 'get_entry', { id, type }),
		stale_time: 1000 * 60 * 5
	});


    setContext('hover_entry', true)
</script>

{#if $q.isLoading}
	<Skeleton class="h-6 w-2/3" />
	<Skeleton class="mt-4 h-16 w-full" />
{:else if $q.isSuccess}
	<div class="max-h-64 overflow-y-auto">
		<div class="hover-entry">

			{JSON.stringify($q.data)}
			<!-- <Entry
				data={{
					entry: $q.data,
					type: $q.data.type
				}}
			/> -->
		</div>
	</div>
{/if}


<style lang="postcss">
    .hover-entry :global(*) {
        font-size: .9em !important;
    }
    .hover-entry :global(p) {
        font-size: .8em;
    }
</style>
