<script lang="ts">
	import { page } from '$app/stores';
	import Annotation from '$lib/components/notebook/Annotation.svelte';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent,
		CardSkeleton
	} from '$lib/components/ui/card';
	import { query } from '$lib/queries/query';
	import type { Entry } from '@prisma/client';
	import { createQuery } from '@tanstack/svelte-query';

	export let entry: {
		id: number;
		title: string;
	};

	$: mentions = createQuery({
		queryKey: ['mentions', entry.id],
		queryFn: () => query($page, 'note_mentions', entry),
		staleTime: 1000 * 60 * 2
	});
</script>

<Card class="mt-4">
	<CardHeader>
		<CardTitle>References & Mentions</CardTitle>
		<CardDescription>Mentions of this entry in your notes.</CardDescription>
	</CardHeader>
	<CardContent>
		{#if $mentions.isLoading}
			<CardSkeleton />
		{:else if $mentions.isError}
			<p>error</p>
		{:else if $mentions.data}
			{#if $mentions.data.references?.length}
				<h3 class="text-base font-bold">References</h3>
				{#each $mentions.data.references as reference}
					<a href="/tests/notes/{reference.id}">{reference.title}</a>
				{/each}
			{/if}
			{#if $mentions.data.mentions?.length}
				<h3 class="text-base font-bold">Mentions</h3>
				{#each $mentions.data.mentions as mention}
					<Annotation annotation={mention} />
				{/each}
			{/if}
			{#if !$mentions.data.references?.length && !$mentions.data.mentions?.length}
				<p>No references or mentions found.</p>
			{/if}
		{/if}
		<!-- TODO -->
	</CardContent>
</Card>
