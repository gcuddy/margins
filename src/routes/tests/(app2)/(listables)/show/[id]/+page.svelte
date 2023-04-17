<script lang="ts">
	import smoothload from "$lib/actions/smoothload";
	import Button, { buttonVariants } from "$lib/components/ui/Button.svelte";
	import Separator from "$lib/components/ui/Separator.svelte";
	import { H1, H2, Lead, Subtle } from "$lib/components/ui/typography";
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
			<Subtle>Podcast</Subtle>
			<H1>{data.podcast?.title}</H1>
			<Lead>
				{data.podcast?.author}
			</Lead>
			<div class="flex space-x-4">
				<Button>Play</Button>
				<!-- <BookmarkForm data={data.bookmarkForm} /> -->
			</div>
		</div>
	</div>
	<!-- 
	<dl class="grid grid-cols-[1fr,1fr,1fr] gap-3 pt-2 text-sm">
		<div class="flex flex-col">
			<dt class="text-xs uppercase"><Subtle>Release Date</Subtle></dt>
			<dd>
				<Subtle>
					{data.movie.release_date}
				</Subtle>
			</dd>
		</div>
		<div class="flex flex-col">
			<dt class="text-xs uppercase"><Subtle>Runtime</Subtle></dt>
			<dd>
				<Subtle>
					{data.movie.runtime} minutes
				</Subtle>
			</dd>
		</div>
	</dl> -->

	<div class="prose prose-slate space-y-4 dark:prose-invert">
		<div>
			{@html data.podcast?.description}
		</div>
	</div>

	<div class="max-w-prose space-y-4">
		{#if data.lazy?.episodes}
			<H2>Episodes</H2>
			<div class="flex flex-col gap-y-2">
				{#await data.lazy.episodes}
					loading...
				{:then episodes}
					{#each episodes as episode}
						<a
							class="space-y-2 rounded p-3 transition hover:bg-gray-400 dark:hover:bg-gray-800"
							href="/tests/podcast/p{episode.id}"
						>
							<span class="line-clamp-2 font-bold">{episode.title}</span>
							<p class="line-clamp-2 text-sm text-slate-700 dark:text-gray-300">
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
