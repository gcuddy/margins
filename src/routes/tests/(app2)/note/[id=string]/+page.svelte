<script lang="ts">
	import { page } from '$app/stores';
	import { queryFactory } from '$lib/queries/querykeys';
	import { createQuery } from '@tanstack/svelte-query';
	import { Note } from '$lib/components/notes';
	import Skeleton from '$components/ui/skeleton/Skeleton.svelte';
	import { derived } from 'svelte/store';

	export let data;

	$: query = createQuery(
		queryFactory.notes.detail({
			id: data.id
		})
	);
</script>

{#if $query.isPending}
	<Skeleton class="h-10" />

	<Skeleton class="h-full" />
{:else if $query.isSuccess}
	{#key data.id}
		<Note {...$query.data} color={$query.data.color ?? ''} icon={$query.data.icon ?? ''} />
	{/key}
{/if}
