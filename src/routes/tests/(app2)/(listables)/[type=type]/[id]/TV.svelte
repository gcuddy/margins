<script lang="ts">
	import smoothload from "$lib/actions/smoothload";
	import Cluster from "$lib/components/helpers/Cluster.svelte";
	import Button, { buttonVariants } from "$lib/components/ui/Button.svelte";
	import { Dialog, DialogContent } from "$lib/components/ui/dialog";
	import DialogTrigger from "$lib/components/ui/dialog/DialogTrigger.svelte";
	import { H1, H3, Lead, Subtle } from "$lib/components/ui/typography";
	import { isUpcoming } from "$lib/utils/date";

	import type { PageData } from "./$types";
	import BookmarkForm from "./BookmarkForm.svelte";
	type TV = PageData["tv"];
	export let data: PageData & {
		tv: NonNullable<TV>;
	};

	$: creators = data.tv.created_by;
</script>

<div class="flex select-text flex-col gap-4">
	<div class="flex gap-6 sm:items-center">
		<img
			src="https://image.tmdb.org/t/p/w500/{data.tv.poster_path}"
			alt=""
			class="aspect-auto max-w-[150px] shrink rounded-md shadow-lg sm:max-w-[250px]"
			use:smoothload
		/>
		<div class="flex flex-col gap-2">
			<Subtle>TV</Subtle>
			<H1>{data.tv.name}</H1>
			<Lead>
				{#if creators.length}
					{#each creators as creator}
						<a class="mr-2" href="/tests/people/t{creator.id}">{creator.name}</a
						>
					{/each}
					—
				{/if}{new Date(data.tv.first_air_date).getFullYear()}
			</Lead>
			<Lead class="text-base">
				{#if data.tv.number_of_seasons}
					{data.tv.number_of_seasons} seasons,
				{/if}
				{#if data.tv.number_of_episodes}
					{data.tv.number_of_episodes} episodes
				{/if}
			</Lead>
			<BookmarkForm data={data.bookmarkForm} />
		</div>
	</div>

	<dl class="grid grid-cols-[1fr,1fr,1fr] gap-3 pt-2 text-sm">
		<div class="flex flex-col">
			<dt class="text-xs uppercase"><Subtle>Years Running</Subtle></dt>
			<dd>
				<Subtle>
					{data.tv.first_air_date}
				</Subtle>
			</dd>
		</div>
	</dl>

	<div class="prose prose-slate space-y-4 dark:prose-invert">
		<div>
			{@html data.tv.overview}
		</div>
	</div>
</div>

{#if data.tv.videos.results.length}
	{@const trailer = data.tv.videos.results.find(
		(v) => v.type === "Trailer" && v.site === "YouTube"
	)}
	{#if trailer}
		<Dialog>
			<svelte:fragment slot="trigger">
				<Button>Watch trailer</Button>
			</svelte:fragment>
			<DialogContent class="sm:max-w-[90vw] md:max-w-[75vw]">
				<iframe
					src="https://www.youtube.com/embed/{trailer.key}"
					class="aspect-video w-full p-2"
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
				/>
			</DialogContent>
		</Dialog>
	{/if}
{/if}

<H3>Cast</H3>
<Cluster class="max-w-prose gap-1">
	{#each data.tv.credits.cast.slice(0, 10) as { name, character }}
		<span
			class="rounded-lg bg-slate-900 px-2 py-1 text-xs text-slate-50 dark:bg-slate-800 dark:text-slate-100"
			>{name}</span
		>
	{/each}
</Cluster>
