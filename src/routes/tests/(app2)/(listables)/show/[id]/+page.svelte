<script lang="ts">
	import smoothload from '$lib/actions/smoothload';
	import Button, { buttonVariants } from '$lib/components/ui/Button.svelte';
	import Separator from '$lib/components/ui/Separator.svelte';
	import Skeleton from '$lib/components/ui/skeleton/Skeleton.svelte';
	import { H1, H2, Lead, Muted } from '$lib/components/ui/typography';
	export let data;
</script>

<div class="flex select-text flex-col gap-4">
	<div class="flex gap-6 max-sm:flex-col sm:items-center">
		<img
			src={data.podcast?.artwork}
			alt=""
			class="aspect-auto rounded-md shadow-lg sm:w-[150px] md:w-[200px]"
			use:smoothload
		/>
		<div class="flex flex-col gap-2">
			<Muted>Podcast</Muted>
			<H1>{data.podcast?.title}</H1>
			<Lead>
				{data.podcast?.author}
			</Lead>
			<div class="flex space-x-4">
				<Button>Subscribe</Button>
				<!-- <BookmarkForm data={data.bookmarkForm} /> -->
			</div>
		</div>
	</div>
	<!-- 
	<dl class="grid grid-cols-[1fr,1fr,1fr] gap-3 pt-2 text-sm">
		<div class="flex flex-col">
			<dt class="text-xs uppercase"><Muted>Release Date</Muted></dt>
			<dd>
				<Muted>
					{data.movie.release_date}
				</Muted>
			</dd>
		</div>
		<div class="flex flex-col">
			<dt class="text-xs uppercase"><Muted>Runtime</Muted></dt>
			<dd>
				<Muted>
					{data.movie.runtime} minutes
				</Muted>
			</dd>
		</div>
	</dl> -->

	<div class="prose prose-stone space-y-4 dark:prose-invert">
		<div>
			{@html data.podcast?.description}
		</div>
	</div>

	<div class="max-w-prose space-y-4">
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
							href="/tests/podcast/p{episode.id}"
						>
							<span class="line-clamp-2 font-bold">{episode.title}</span>
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
