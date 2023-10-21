<script lang="ts">
	import { queryFactory } from '$lib/queries/querykeys';
	import { createQuery } from '@tanstack/svelte-query';
	import Header from '$components/ui/Header.svelte';
	import Pins from '$components/pins/pins.svelte';
	import { Skeleton } from '$components/ui/skeleton';
	import { Button } from '$components/ui/button';
	import { FolderPlusIcon } from 'lucide-svelte';

	const query = createQuery(queryFactory.pins.list());

    let pins: Pins;
</script>

<Header>
    <h2 class="text-3xl font-bold tracking-tight">
        Pins
    </h2>
    <svelte:fragment slot="end">
        <Button on:click={pins.addFolder} variant="secondary">
            <FolderPlusIcon class="w-4 h-4 mr-2" />
            Add folder
        </Button>
    </svelte:fragment>

</Header>

<div class="">
    {#if $query.data}
        <Pins type="pins-page" bind:this={pins} size="lg" pins={$query.data} />
    {:else if $query.isError}
        Error Loading Pins
    {:else}
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-10 w-full" />
    {/if}
</div>
