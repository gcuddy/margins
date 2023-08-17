<script lang="ts">
	import { ctx } from './ctx';
	import Header from '$components/ui/Header.svelte';
	import FilterBadge from './FilterBadge.svelte';

	const {
		state: { filterStore, hasFilters },
		elements: { container }
	} = ctx.set();
</script>

<!--

 -->

{#if $hasFilters}
	<Header class="static">
		<div bind:this={$container}>
			{#each Object.entries($filterStore) as [type, filter]}
				<FilterBadge {type} {filter} />
				<!-- <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">{key}</span>
                <span class="text-xs text-muted-foreground">{value}</span>
            </div> -->
			{/each}
		</div>
	</Header>
	<slot />
{/if}
