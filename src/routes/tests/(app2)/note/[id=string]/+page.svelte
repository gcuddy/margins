<script lang="ts">
	import { page } from '$app/stores';
	import { queryFactory } from '$lib/queries/querykeys';
	import { createQuery } from '@tanstack/svelte-query';
    import { Note } from "$lib/components/notes";
	import Skeleton from '$components/ui/skeleton/Skeleton.svelte';

    export let data;

	const query = createQuery(
		queryFactory.notes.detail({
			id: data.id
		})
	);
</script>


{#if $query.isPending}
    <Skeleton class="h-10" />

    <Skeleton class="h-full" />
{:else if $query.isSuccess}
    <Note {...$query.data} />
{/if}
