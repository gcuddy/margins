<script lang="ts">
	import { page } from "$app/stores";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import SmallPlus from "$lib/components/atoms/SmallPlus.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import Header from "$lib/components/layout/Header.svelte";
	import DefaultHeader from "$lib/components/layout/headers/DefaultHeader.svelte";
	import { podcastPlayer } from "$lib/components/PodcastPlayer.svelte";
	import Separator from "$lib/components/ui/Separator.svelte";
	import ImageSkeleton from "$lib/components/ui/skeleton/ImageSkeleton.svelte";
	import dayjs from "$lib/dayjs";
	import { trpc } from "$lib/trpc/client";
	import { Image } from "@unpic/svelte";
	import type { PageData } from "./$types";
	export let data: PageData;
	$: console.log({ data });
	$: user = data.user;

	const query = data.query();
	$: console.log({ $query });

	const formatDuration = (seconds: number) => {
		const d = dayjs.duration(seconds, "seconds");

		return d.format(
			`${d.hours() > 0 ? "H[h]" : ""} ${d.minutes() > 0 ? "m[m]" : ""}`
		);
	};
</script>

<h2 class="text-2xl font-semibold tracking-tight">Podcasts</h2>
<p class="text-sm text-gray-500 dark:text-gray-400">Your latest podcasts.</p>
<Separator class="my-4" />

<!-- <Header>
	<DefaultHeader>
		<div slot="start">
			<SmallPlus>Podcasts</SmallPlus>
		</div>
		<div slot="end">
			<button on:click={() => trpc($page).podcasts.refresh.mutate()}>
				Refresh pods
			</button>
			<a href="/podcasts/search">Add Podcasts</a>
		</div>
	</DefaultHeader>
</Header> -->
<ul class="flex flex-col divide-y overflow-auto px-4 dark:divide-gray-700 overflow-y-auto">
	<!-- {JSON.stringify($query)} -->
	{#if $query.isLoading}
		<p>Loading...</p>
	{:else if $query.isSuccess}
		<!-- else if content here -->
		{#each $query.data.pages.flatMap((p) => p.entries) as item}
			<!-- {episode.title} -->
			<li class="group flex gap-2 py-2">
				<div class="shrink-0">
					<button
						class="group/button relative h-20 w-20 rounded"
						on:click={() => {
							if (!item.enclosureUrl || !item.feedId) return;
							podcastPlayer.load(
								{
									title: item.title || "",
									id: item.id,
									enclosureUrl: item.enclosureUrl,
									image: item.image || item.feed_image || "",
								},
								{
									title: item.feed_title,
									// id: item.feed?.podcastIndexId,
								}
							);
						}}
					>
						{#if item.feed_image}
							{@const src = `https://margins.b-cdn.net/${item.feed_image}`}
							<Image
								class="absolute top-0 h-20 w-20 rounded-lg shadow"
								{src}
								alt=""
								cdn="bunny"
								width={80}
								height={80}
								layout="constrained"
							/>
						{:else}
							<ImageSkeleton
								class="absolute top-0 h-20 w-20 rounded-lg shadow"
							/>
						{/if}
						<Icon
							name="playCircle"
							className=" h-12 group-hover/button:fill-primary-400/95 group-hover:opacity-100 opacity-0 duration-200 transition w-12 stroke-black fill-gray-300/75 inset-0"
						/>
					</button>
				</div>
				<div class="flex flex-col space-y-1">
					<div
						class="flex space-x-2 text-xs font-medium uppercase tracking-tight"
					>
						<Muted>{dayjs(item.published).format("l")}</Muted>
						{#if item.duration}
							<Muted>{formatDuration(item.duration)}</Muted>
						{/if}
					</div>
					<h2 class="line-clamp-2 font-semibold">
						<a href="/u:{user.username}/entry/{item.id}">{item.title}</a>
					</h2>
					<div class="line-clamp-2 max-h-20 overflow-hidden">
						<Muted class="text-sm">{@html item.html}</Muted>
					</div>
					<div class="flex cursor-default items-center space-x-1">
						<div class="flex flex-col items-center" />
						<div class="flex w-full items-center text-sm transition-[width]" />
					</div>
				</div>
			</li>
		{/each}
	{/if}
	<!-- {#each $user.feeds?.filter((f) => f.podcast) || [] as podcast}
		<li class="py-2" tabindex="-1">
			<a
				class="flex h-16 items-center space-x-6 rounded p-2 dark:focus-visible:bg-gray-800 dark:active:bg-gray-800"
				href="/rss/podcasts/{podcast['itunes_id']}"
				data-sveltekit-prefetch
			>
				<img class="h-16 w-16 rounded-lg" src={podcast.imageUrl} />
				<div class="flex flex-auto flex-col">
					<h2 class="font-medium line-clamp-2">{podcast.title}</h2>
					{#if podcast.creator}
						<Muted>{podcast.creator}</Muted>
					{/if}
				</div>
			</a>
		</li>
	{/each} -->
</ul>
