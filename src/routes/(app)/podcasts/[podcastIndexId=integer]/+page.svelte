<script lang="ts">
	import { page } from "$app/stores";
	import { createQuery } from "@tanstack/svelte-query";
	import type { PageData } from "./$types";
	import { podcastDetailsQuery, podcastEpisodesQuery, queryKeys } from "$lib/features/podcasts/queries";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import GenericDialog from "$lib/components/GenericDialog.svelte";
	import Button from "$lib/components/Button.svelte";
	import { podcastPlayer } from "$lib/components/PodcastPlayer.svelte";
	import { enhance, SubmitFunction } from "$app/forms";
	import { notifications } from "$lib/stores/notifications";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import Progress from "$lib/components/helpers/Progress.svelte";
	import { formatDuration } from "$lib/utils/dates";
	import ImageSkeleton from "$lib/components/layout/Skeletons/ImageSkeleton.svelte";

	export let data: PageData;

	$: ({ id } = data);

	let subscribed: boolean;
	$: subscribed = !!$page.data.user?.subscriptions?.some((s) => s.feed?.podcastIndexId === data.id);

	$: podcast = createQuery({ ...podcastDetailsQuery($page, data.id), placeholderData: data.searchResult });
	$: episodes = createQuery(podcastEpisodesQuery($page, data.id));

	$: console.log({ $podcast, data, $episodes });

	let show_description_modal = false;

	const handleSubmit: SubmitFunction = () => {
		subscribed = !subscribed;
		return async ({ update, result }) => {
			update();
			if (result.type === "success") {
				console.log({ result });
				notifications.notify({
					type: subscribed ? "success" : "info",
					title: `${subscribed ? "Susbcribed" : "Unsubscribed"} to podcast`,
				});
			}
		};
	};

	let show = 8;
	$: show = +($page.url.searchParams.get("show") ?? "8");

	let pending_favorite: number | null = null;
</script>

<div class="">
	<div class="container mx-auto flex flex-col space-y-8 p-6 dark:divide-gray-700">
		<div class="relative flex justify-center flex-col space-y-8 sm:flex-row sm:space-y-0 sm:space-x-12">
			<!-- <img
				src={image}
				class="absolute h-full w-full opacity-25 blur-3xl"
				alt="Artwork for {title}"
			/> -->
			{#if $podcast}
			    <div class="h-60 w-60 place-self-center overflow-hidden rounded-xl shadow-lg sm:place-self-start">
				    {#if $podcast.isLoading || !$podcast.data?.feed.artwork}
						<ImageSkeleton class="animate-pulse" />
					{:else if $podcast.isSuccess}
						<img src={$podcast.data?.feed?.artwork} class="" alt="Artwork for {$podcast.data?.feed.title}" />
					{/if}
				</div>
				{#if $podcast.isLoading}
					<!-- <p>Loading...</p> -->
				{:else if $podcast.isError}
					<p>Error: {$podcast.error}</p>
				{:else if $podcast.isSuccess && $podcast.data}
					{@const feed = $podcast.data.feed}

					<div class="space-y-4 sm:space-y-8">
						<div class="text-center sm:text-left">
							<h1 class="text-2xl font-bold">{feed.title}</h1>
							<a class="text-xl" href={feed.url}><Muted>{feed.author}</Muted></a>
							<!-- TODO: categories here -->
						</div>
						<div class="relative overflow-hidden text-sm line-clamp-4">
							<div class="prose text-sm  leading-normal gradient-mask-br-50 dark:prose-invert">
								{@html feed.description}
							</div>
							<button
								on:click={() => (show_description_modal = true)}
								class="absolute bottom-0 right-0 cursor-default bg-base pl-1 pt-1 font-medium text-primary-600 dark:bg-gray-900 dark:to-gray-900"
							>
								Read more
							</button>
							<GenericDialog bind:isOpen={show_description_modal}>
								<svelte:fragment slot="title">About</svelte:fragment>
								<span class="font-bold" slot="description">{feed.title}</span>
								<div class="prose text-sm   leading-normal dark:prose-invert">
									{@html feed.description}
								</div>
							</GenericDialog>
						</div>

						<form method="post" action="?/subscribe" use:enhance={handleSubmit}>
							{#if subscribed}
								{@const subscription = $page.data.user?.subscriptions?.find(
									(s) => s.feed?.podcastIndexId === data.id
								)}
								<input type="hidden" name="unsubscribe" value="true" />
								<input type="hidden" name="subscriptionId" value={subscription?.id} />
							{/if}
							<input type="hidden" name="title" value={feed.title} />
							<input type="hidden" name="podcastIndexId" value={feed.id} />
							<Button type="submit" className="flex space-x-2 text-lg py-4 px-3">
								{subscribed ? "Subscribed" : "Subscribe"}
								<!-- <Icon
							name={existing || subscribed
								? 'checkCircleSolid'
								: pending_subscribe
								? 'loading'
								: 'plusCircleSolid'}
							className="w-4 h-4 fill-current {pending_subscribe ? 'animate-spin' : ''}"
						/>
						<span>Subscribe{existing || subscribed ? 'd' : ''}</span> -->
							</Button>
						</form>
					</div>
				{/if}
			{/if}
		</div>
		<div class="max-w-prose w-full mx-auto pt-2">
			<h2 class="text-xl font-bold">Episodes</h2>
			<div class="flex flex-col dark:divide-gray-700">
				<ol class="divide-y divide-border dark:divide-gray-700">
					{#if $episodes.isLoading}
						{#each Array(10) as _}
							<div class="animate-pulsing flex items-center justify-between py-4 transition-opacity">
								<div>
									<div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600" />
									<div class="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
								</div>
								<div class="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
							</div>
						{/each}
					{:else if $episodes.isSuccess && $episodes.data}
						{#each $episodes.data.episodes.items.slice(0, show) as item}
							{@const loaded = $podcastPlayer?.episode?.enclosureUrl === item.enclosureUrl}
							{@const entry = $episodes.data.entries.find(
								(e) =>
									e.podcastIndexId?.toString() == item.id.toString() || e.enclosureUrl == item.enclosureUrl
							)}
							{@const entryId = entry?.id}
							{@const interaction = entry?.interactions?.[0]}
							<li class="py-2">
								<div class="flex flex-col space-y-1">
									<div class="flex space-x-2 text-xs font-medium uppercase tracking-tight">
										<Muted>{item.datePublishedPretty}</Muted>
									</div>
									<a href="/podcasts/{data.id}/{item.id}">
										<h2 class="font-semibold">{item.title}</h2>
									</a>
									<div class="max-h-20 overflow-hidden text-sm text-muted line-clamp-3">
										{@html item.description}
									</div>
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<div class="flex justify-between gap-2">
										<div
											class="flex cursor-default items-center space-x-1"
											on:click={() => {
												if (loaded) {
													podcastPlayer.toggle();
												} else {
													console.log("loading");
													$podcastPlayer.loading = true;
													podcastPlayer.load(
														{
                                                           pIndexId: item.feedId,
															...item,
															entryId,
														},
														{
															title: $podcast.data?.feed.title,
                                                            podcastIndexId: item.feedId
														},
														interaction?.progress
													);
												}
											}}
										>
											<div class="flex flex-col items-center">
												<Icon
													name={loaded && !$podcastPlayer.paused ? "pauseSolid" : "playSolid"}
													className="h-6 w-6 fill-primary-500/80"
												/>
											</div>
											<div class="flex w-full items-center text-sm transition-[width]">
												<Progress
													class="h-1 appearance-none rounded-full bg-gray-500 transition-[width] dark:bg-gray-600/50 {loaded
														? 'mr-2 w-24'
														: 'w-0'} {$podcastPlayer.loading ? 'animate-pulse' : ''}"
													innerClass="bg-gradient-to-r from-primary-500 to-primary-600"
													value={typeof $podcastPlayer.currentTime === "number" && loaded
														? $podcastPlayer.currentTime
														: 0}
													max={typeof $podcastPlayer.duration === "number" && loaded
														? $podcastPlayer.duration
														: 1}
													min={0}
												/>
												<Muted
													>{loaded
														? formatDuration(
																$podcastPlayer.duration - $podcastPlayer.currentTime,
																"seconds"
														  ) + " left"
														: interaction?.progress
														? formatDuration(
																item.duration - item.duration * interaction.progress,
																"seconds"
														  ) + " left"
														: formatDuration(item.duration, "seconds")}
												</Muted>
											</div>
										</div>
										<div>
											<form
												action="?/toggleFinished"
												method="post"
												use:enhance={() => {
													pending_favorite = item.id;
													return ({ result }) => {
														data.queryClient.invalidateQueries(podcastEpisodesQuery($page, data.id).queryKey);
														pending_favorite = null;
													};
												}}
											>
												<button>
													<input type="hidden" name="episodeId" value={item.id} />
													{#if entryId}
														<input type="hidden" name="entryId" value={entryId} />
													{/if}
													<input type="hidden" name="enclosureUrl" value={item.enclosureUrl} />
													<input type="hidden" name="finished" value={!interaction?.finished} />
													<Icon
														name={pending_favorite === item.id ? "loading" : "checkCircle2"}
														className="h-6 w-6 stroke-gray-500 transition hover:stroke-white {interaction?.finished
															? 'opacity-100'
															: 'opacity-50'} {pending_favorite === item.id ? 'animate-spin' : ''}"
													/>
												</button>
											</form>
										</div>
									</div>
								</div>
							</li>
						{/each}
					{/if}
				</ol>
				<a
					class="pt-2 text-primary-600"
					on:click|preventDefault={() => (show = 100)}
					href="{$page.url.pathname}?show=100"
				>
					Show all episodes
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	.animate-pulsing {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>
