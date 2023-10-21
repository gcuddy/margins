<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import Clamp from '$components/Clamp.svelte';
	import Header from '$components/ui/Header.svelte';
	import smoothload from '$lib/actions/smoothload';
	import Button from '$lib/components/ui/Button.svelte';
	import Separator from '$lib/components/ui/Separator.svelte';
	import { Skeleton } from '$components/ui/skeleton';
	import { H1, H2, Lead, Muted } from '$lib/components/ui/typography';
	import { formatDate } from '$lib/utils/date';
	import { Loader } from 'lucide-svelte';
	export let data;

	import { CheckCircled, PlusCircled } from 'radix-icons-svelte';
	import { EntryMediaHeader } from '$components/entries';

	let submitting = false;
</script>

<Header>
	<span class="text-sm"
		><span class="text-muted-foreground">Podcasts / </span><span
			class="truncate">{data.podcast?.title}</span
		></span
	>
</Header>

<div class="flex select-text flex-col gap-4 px-6 py-4">
	<EntryMediaHeader
		title={data.podcast?.title ?? ''}
		type="podcast"
		image={data.podcast?.artwork}
		viewTransitionName="podcast-artwork-{data.podcast?.id}"
		author={data.podcast?.author}
		description={data.podcast?.description}
	>
		<svelte:fragment slot="actions">
			{#if data.podcast}
				<form
					action="/subscriptions?/add"
					method="post"
					use:enhance={() => {
						submitting = true;
						return ({ result }) => {
							submitting = false;
							if (result.type === 'success' || result.type === 'redirect') {
								invalidate('podcast');
							}
						};
					}}
				>
					<Button variant={data.subscription ? 'secondary' : 'default'}
						><svelte:component
							this={submitting
								? Loader
								: data.subscription
								? CheckCircled
								: PlusCircled}
							class="h-4 w-4 mr-2 text-muted-foreground stroke-[1.5] {submitting
								? 'animate-spin'
								: ''}"
						/>{data.subscription ? 'Subscribed' : 'Subscribe'}</Button
					>
					<input type="hidden" name="0-url" value={data.podcast.url} />
					<input type="hidden" name="0-title" value={data.podcast.title} />
					<input
						type="hidden"
						name="0-podcastIndexId"
						value={data.podcast.id}
					/>
					{#if data.subscription}
						<input
							type="hidden"
							name="subscriptionId"
							value={data.subscription.id}
						/>
						<input type="hidden" name="delete" />
					{/if}
				</form>
			{/if}
		</svelte:fragment>
	</EntryMediaHeader>
	
	<div class="max-w-prose space-y-4 mt-8">
		{#if data.lazy?.episodes}
			<H2>Episodes</H2>
			<div class="flex flex-col gap-y-2">
				{#await data.lazy.episodes}
					{#each Array(5) as _}
						<div class="space-y-2 p-3">
							<Skeleton class="h-8 w-full" />
							<Skeleton class="h-16 w-full" />
						</div>
					{/each}
				{:then episodes}
					{#each episodes as episode}
						<a
							class="space-y-2 rounded-md p-3 transition hover:bg-accent"
							href="/podcast/p{episode.id}"
						>
							<span class="line-clamp-2 font-bold">{episode.title}</span>
							<span class="text-sm text-muted-foreground"
								>{formatDate(new Date(episode.datePublished * 1000))}</span
							>
							<p class="line-clamp-2 text-sm text-muted-foreground">
								{@html episode.description}
							</p>
						</a>
						<Separator />
					{/each}
				{/await}
			</div>
		{/if}
	</div>
</div>
