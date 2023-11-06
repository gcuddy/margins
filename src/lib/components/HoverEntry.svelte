<script lang="ts">
	import Tag from '$components/tags/tag.svelte';
	import { queryFactory } from '$lib/queries/querykeys';
	import type { Type } from '$lib/types';
	import { createQuery } from '@tanstack/svelte-query';
	import { setContext } from 'svelte';
	import { derived } from 'svelte/store';
	import Skeleton from './ui/skeleton/skeleton.svelte';
	import { Badge } from './ui/badge';
	import StatusIcon from './entries/StatusIcon.svelte';
	import { make_link_from_full_entry } from '$lib/utils/entries';

	export let id: number;
	export let type: Type;

	const q = createQuery(
		queryFactory.entries.detail({
			id,
            // we do this to make sure we're matching via entryId (it's not ideal)
            type: "article"
		}),
	);

	// Logic duplicated from type/id/+page.svelte
	const title = derived(
		q,
		($query) =>
			$query.data?.entry?.title ||
			$query.data?.book?.volumeInfo?.title ||
			$query.data?.movie?.title ||
			$query.data?.tv?.name ||
			$query.data?.podcast?.episode.title ||
			$query.data?.album?.name,
	);

	const author = derived(
		q,
		($query) =>
			$query.data?.entry?.author ||
			$query.data?.book?.volumeInfo?.authors?.join(', ') ||
			$query.data?.movie?.credits?.crew
				?.filter((c) => c.job === 'Director')
				?.map((c) => c.name)
				?.join(', ') ||
			$query.data?.tv?.credits?.crew
				?.filter((c) => c.job === 'Director')
				?.map((c) => c.name)
				?.join(', ') ||
			$query.data?.album?.artists?.map((a) => a.name).join(', '),
	);

	setContext('hover_entry', true);
</script>

{#if $q.isLoading}
	<Skeleton class="h-6 w-2/3" />
	<Skeleton class="mt-4 h-16 w-full" />
{:else if $q.isSuccess}
	<a href={make_link_from_full_entry($q.data)} class="max-h-64 overflow-y-auto">
		<div class="hover-entry">
			<div class="flex flex-col gap-2">
				<!-- Type -->
				<span class="text-xs text-muted-foreground">{type}</span>
				<span class="font-medium">{$title}</span>
				{#if $q.data.entry?.subscription?.title}
					<div class="flex items-center gap-1">
						{#if $q.data.entry?.feedImage}
							<img
								src={$q.data.entry?.feedImage}
								alt="Feed image"
								class="h-5 w-5 rounded-md object-cover"
							/>
						{/if}
						<span class="text-sm text-muted-foreground"
							>{$q.data.entry?.subscription?.title}</span
						>
					</div>
				{:else if $author}
					<span class="text-sm text-muted-foreground">{$author}</span>
				{/if}
				<!-- TODO: description here -->
				<div class="flex gap-2 flex-wrap">
					<span class="text-sm">
						<Badge variant="secondary">
                            {@const status = $q.data.entry?.bookmark?.status}
                            {#if status}
                                <StatusIcon {status} class="mr-1.5 h-2 w-2 shrink-0" />
                            {/if}
                            {status ?? 'Unsaved'}</Badge>
					</span>
					<div class="flex items-center gap-1">
						{#each $q.data.entry?.tags ?? [] as tag}
							<Tag {tag} />
						{/each}
					</div>
				</div>
			</div>
		</div>
	</a>
{/if}

<style lang="postcss">
</style>
