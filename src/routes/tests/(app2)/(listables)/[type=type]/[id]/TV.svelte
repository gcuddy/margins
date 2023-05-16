<script lang="ts">
	import { page } from '$app/stores';
	import smoothload from '$lib/actions/smoothload';
	import Cluster from '$lib/components/helpers/Cluster.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/Button.svelte';
	import { Dialog, DialogContent } from '$lib/components/ui/dialog';
	import DialogTrigger from '$lib/components/ui/dialog/DialogTrigger.svelte';
	import { tabContent } from '$lib/components/ui/tabs/TabsContent.svelte';
	import { tabList } from '$lib/components/ui/tabs/TabsList.svelte';
	import { tabTrigger } from '$lib/components/ui/tabs/TabsTrigger.svelte';
	import { H1, H3, Lead, Muted, Small } from '$lib/components/ui/typography';
	import { isUpcoming } from '$lib/utils/date';
	import { cn } from '$lib/utils/tailwind';

	import type { PageData } from './$types';
	import BookmarkForm from './BookmarkForm.svelte';
	import EntryOperations from './EntryOperations.svelte';
	type TV = PageData['tv'];
	export let data: PageData & {
		tv: NonNullable<TV>;
	};

	$: creators = data.tv.created_by;

	const tabs = ['Overview', 'Episodes'] as const;

	$: tab_param = $page.url.searchParams.get('tab') ?? tabs[0].toLowerCase();
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
			<Muted>TV</Muted>
			<H1>{data.tv.name}</H1>
			<Lead>
				{#if creators.length}
					{#each creators as creator}
						<a class="mr-2" href="/tests/people/t{creator.id}">{creator.name}</a>
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
			<div>
				<Badge variant="secondary">
					{data.tv.status}
				</Badge>
			</div>
			<div class="flex items-center gap-2">
				<BookmarkForm data={data.bookmarkForm} />
				{#if data.entry}
					<EntryOperations data={data.annotationForm} entry={data.entry} />
				{/if}
			</div>
		</div>
	</div>

	<dl class="grid grid-cols-[1fr,1fr,1fr] gap-3 pt-2 text-sm">
		<div class="flex flex-col">
			<dt class="text-xs uppercase"><Muted>Years Running</Muted></dt>
			<dd>
				<Muted>
					{data.tv.first_air_date}
				</Muted>
			</dd>
		</div>
	</dl>

	<div class="prose prose-slate space-y-4 dark:prose-invert">
		<!-- Tabs: Overview, Episodes -->
		<div class={cn(tabList, 'not-prose')} data-sveltekit-keepfocus data-sveltekit-noscroll>
			{#each tabs as tab}
				{@const selected = tab_param === tab.toLowerCase()}
				<a
					data-sveltekit-replacestate
					class={tabTrigger({ selected })}
					href="?tab={tab.toLowerCase()}"
				>
					{tab}
				</a>
			{/each}
		</div>
		<div class={tabContent}>
			{#if tab_param === 'overview'}
				<div>
					{@html data.tv.overview}
				</div>
				{#if data.tv.videos.results.length}
					{@const trailer = data.tv.videos.results.find(
						(v) => v.type === 'Trailer' && v.site === 'YouTube'
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
			{:else if tab_param === 'episodes'}
				<noscript>
					<p>Episodes are not available without JavaScript.</p>
				</noscript>
				<div class="flex gap-x-4">
					<div class="not-prose flex shrink-0 flex-col gap-y-2">
						{#each Array(+data.tv.number_of_seasons) as _, i}
							{@const selected = i + 1 === +($page.url.searchParams.get('season') || '1')}
							<a
								class={cn(
									buttonVariants({
										variant: selected ? 'secondary' : 'link'
									})
								)}
								data-sveltekit-keepfocus
								data-sveltekit-noscroll
								href="?tab=episodes&season={i + 1}"
							>
								Season {i + 1}
							</a>
						{/each}
					</div>
					<div class="flex flex-col gap-y-4">
						{#if data.extras.season}
							{#await data.extras.season}
								Loading
							{:then season}
								{#each season.episodes as episode}
									<div class="not-prose flex gap-x-2">
										<div class=" shrink-0">
											<img
												use:smoothload
												class="aspect-square w-20 rounded-md object-cover"
												alt=""
												src="https://image.tmdb.org/t/p/w300/{episode.still_path}"
											/>
										</div>
										<div class="flex flex-col">
											<span class="font-semibold">
												{episode.episode_number}. {episode.name}
											</span>
											<p class="line-clamp-3 text-sm/5">
												{episode.overview}
											</p>
										</div>
									</div>
								{/each}
							{/await}
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
