<script lang="ts">
	import Separator from '$components/ui/Separator.svelte';
	import { defaultViewPreferences } from '$components/view-preferences';
	import type { ListEntry } from '$lib/db/selects';
	import Skeleton from '../ui/skeleton/skeleton.svelte';
	export let image: ListEntry['image'] | undefined = undefined;
	export let title: ListEntry['title'] | undefined = undefined;
	export let description: string | undefined = undefined;
	export let published: ListEntry['published'] | undefined = undefined;
	export let uri: ListEntry['uri'] | undefined = undefined;
	export let author: ListEntry['author'] | undefined = undefined;
	export let seen: boolean | undefined = undefined;

	export let viewPreferences = defaultViewPreferences;
</script>

<div class="flex flex-col h-full">
	<div class="flex grow items-center gap-x-4 px-6 py-4">
		<div class="h-10 w-10 rounded-md">
			<slot name="image">
				{#if image}
					<img
						src={image}
						alt={title}
						class="h-full w-full object-cover rounded-[inherit]"
					/>
				{:else}
					<Skeleton class="h-full w-full rounded-[inherit]" />
				{/if}
			</slot>
		</div>
		<div class="flex grow flex-col space-y-2">
			<div class="flex items-center gap-x-1.5 min-w-0">
				{#if viewPreferences.seen && seen === false}
					<Skeleton class="h-2.5 w-2.5 rounded-full shrink-0" />
				{/if}
				<slot name="title">
					{#if title}
						<h3 class="font-semibold">{title}</h3>
					{:else}
						<Skeleton class="h-4 w-3/4" />
					{/if}
				</slot>
			</div>
			<!-- keep in sync with  entryitem -->
			{#if viewPreferences.description || viewPreferences.date}
				<div class="flex items-center gap-1">
					<slot name="published">
						{#if published}
							<span
								class="text-xs text-muted-foreground/80 tabular-nums shrink-0"
							>
								{published}
							</span>
						{:else}
							<Skeleton class="h-3 w-1/4" />
						{/if}
					</slot>
					<slot name="decription">
						{#if description}
							<span
								class="text-xs text-muted-foreground/80 tabular-nums shrink-0"
							>
								{description}
							</span>
						{:else}
							<!-- These make it look a little busy imo -->
							<!-- <Skeleton class="h-3 w-20" /> -->
						{/if}
					</slot>
				</div>
			{/if}
			{#if viewPreferences.url || viewPreferences.time || viewPreferences.author}
				<div class="flex gap-1 items-center">
					{#if uri}
						<span class="text-xs text-muted-foreground truncate">
							{uri}
						</span>
					{:else}
						<Skeleton class="h-3 w-1/5" />
					{/if}
					{#if author}
						<span class="text-xs text-muted-foreground truncate">
							{author}
						</span>
					{:else}
						<!-- <Skeleton class="h-3  w-1/6" /> -->
					{/if}
				</div>
			{/if}
			<!-- TODO: final row -->
		</div>
	</div>
	<Separator class="w-full h-[0.5px] bg-border" />
</div>
