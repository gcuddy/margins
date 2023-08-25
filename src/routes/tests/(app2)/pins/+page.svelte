<script lang="ts">
	import { queryFactory } from '$lib/queries/querykeys';
	import { createQuery } from '@tanstack/svelte-query';
	import Header from '$components/ui/Header.svelte';
	import Pins from '$components/pins/pins.svelte';
	import Skeleton from '$lib/components/ui/skeleton/Skeleton.svelte';

	const query = createQuery(queryFactory.pins.list());
</script>

<Header>Pins</Header>

<div class="">
    {#if $query.data}
        <Pins size="lg" pins={$query.data} />
    {:else if $query.isError}
        Error Loading Pins
    {:else}
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-10 w-full" />
    {/if}
</div>
