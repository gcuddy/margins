<script lang="ts">
	import { ctx } from './ctx';
	import Header from '$components/ui/Header.svelte';
	import FilterBadge from './FilterBadge.svelte';

	const {
		state: { filterStore, hasFilters },
		elements: { container }
	} = ctx.set();

	type Entries<T> = {
		[K in keyof T]: [K, T[K]];
	}[keyof T][];

	$: filters = (Object.entries($filterStore) as Entries<typeof $filterStore>).filter(Boolean);
</script>

<!--

 -->

{#if $hasFilters}
	<Header class="static">
		<div bind:this={$container}>
			{#each filters as [type, filter]}
				<FilterBadge {type} {filter} />
			{/each}
		</div>
	</Header>
	<slot />
{/if}
