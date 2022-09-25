<script lang="ts">
	import Muted from '$lib/components/atoms/Muted.svelte';
	import Button from '$lib/components/Button.svelte';
	import Form from '$lib/components/Form.svelte';
	import GenericDialog from '$lib/components/GenericDialog.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import Progress from '$lib/components/helpers/Progress.svelte';
	import { podcastPlayer } from '$lib/components/PodcastPlayer.svelte';
	import ProseWrapper from '$lib/components/ProseWrapper.svelte';
	import { notifications } from '$lib/stores/notifications';
	import { formatDate, formatDuration } from '$lib/utils/dates';
	import type { PageData } from './$types';
	import { Transition } from '@rgossiaux/svelte-headlessui';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	dayjs.extend(duration);
	export let data: PageData;
	$: ({ title, imageUrl: image, description, feedUrl: url, items, creator, id } = data.podcast);
	$: console.log({ data });
	$: user = data.user;
	$: existing = $user.feeds.some((f) => f.podcast && Number(f.itunes_id) === Number(id));
	console.log({ existing });
	let show_description_modal = false;
	let pending_subscribe = false;
	let subscribed = existing;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class=" overflow-auto">
	<div class="container mx-auto flex flex-col space-y-8 divide-y p-6 dark:divide-gray-700">
		<div class="relative flex flex-col space-y-8 sm:flex-row sm:space-y-0 sm:space-x-12">
			<!-- <img
				src={image}
				class="absolute h-full w-full opacity-25 blur-3xl"
				alt="Artwork for {title}"
			/> -->
			<img
				src={image}
				class="h-60 w-60 place-self-center rounded-xl shadow-lg sm:place-self-end"
				alt="Artwork for {title}"
			/>
			<div class="space-y-4 sm:space-y-8">
				<div class="text-center sm:text-left">
					<h1 class="text-2xl font-bold">{title}</h1>
					<a class="text-xl" href={url}><Muted>{creator}</Muted></a>
				</div>
				<div class="relative overflow-hidden text-sm line-clamp-4">
					<div
						class="prose prose-stone text-sm  leading-normal gradient-mask-br-50 dark:prose-invert"
					>
						{@html description}
					</div>
					<button
						on:click={() => (show_description_modal = true)}
						class="absolute bottom-0 right-0 cursor-default bg-white pl-1 pt-1 font-medium text-primary-600 dark:bg-gray-900 dark:to-gray-900"
					>
						Read more
					</button>
					<GenericDialog bind:isOpen={show_description_modal}>
						<svelte:fragment slot="title">About</svelte:fragment>
						<span class="font-bold" slot="description">{title}</span>
						<div class="prose prose-stone text-sm  leading-normal dark:prose-invert">
							{@html description}
						</div>
					</GenericDialog>
				</div>
				<Form
					action="/rss/podcasts/subscribe"
					method="post"
					pending={() => (pending_subscribe = true)}
					error={(error) => {
						pending_subscribe = false;
						notifications.notify({
							type: 'error',
							message: "Couldn't subscribe to podcast",
						});
						console.log(error);
					}}
					done={() => {
						$user.feeds = [
							...$user.feeds,
							{
								itunes_id: id,
								title,
								imageUrl: image,
								description,
								feedUrl: url,
								podcast: true,
								creator,
							},
						];
						pending_subscribe = false;
						subscribed = true;
						notifications.notify({
							type: 'success',
							message: 'Podcast subscribed',
						});
					}}
					className="flex justify-center sm:justify-start"
				>
					<input type="hidden" name="feedUrl" value={url} />
					<input type="hidden" name="title" value={title} />
					<input type="hidden" name="imageUrl" value={image} />
					<input type="hidden" name="description" value={description} />
					<input type="hidden" name="creator" value={creator} />
					<input type="hidden" name="itunes_id" value={id} />
					<Button type="submit" className="flex space-x-2 text-lg py-4 px-3">
						<Icon
							name={existing || subscribed
								? 'checkCircleSolid'
								: pending_subscribe
								? 'loading'
								: 'plusCircleSolid'}
							className="w-4 h-4 fill-current {pending_subscribe ? 'animate-spin' : ''}"
						/>
						<span>Subscribe{existing || subscribed ? 'd' : ''}</span>
					</Button></Form
				>
			</div>
		</div>
		{#if items}
			<div class="pt-2">
				<h2 class="text-xl font-bold">Episodes</h2>
				<div class="flex flex-col divide-y dark:divide-gray-700">
					<ol class="divide-y dark:divide-gray-700">
						{#each items.slice(0, 8) as item}
							{@const loaded =
								$podcastPlayer?.episode?.guid === item.guid ||
								$podcastPlayer?.episode?.enclosure.url === item.enclosure.url}
							<!-- {@const exists = existing.PodcastEpisode.find(
                (e) => e.guid === item.guid || e.url === item.url
              )} -->
							<!-- <pre>{JSON.stringify(item)}</pre> -->
							<li class="py-2">
								<div class="flex flex-col space-y-1">
									<div class="flex space-x-2 text-xs font-medium uppercase tracking-tight">
										<Muted>{formatDate(item.pubDate)}</Muted>
									</div>
									<a href="/rss/podcasts/{data.podcast.id}/{item.uuid}">
										<h2 class="font-semibold">{item.title}</h2>
									</a>
									<div class="max-h-20 overflow-hidden text-sm line-clamp-3">
										<Muted>{item.description}</Muted>
									</div>
									<div
										class="flex cursor-default items-center space-x-1"
										on:click={() => {
											if (loaded) {
												podcastPlayer.toggle();
											} else {
												console.log('loading');
												$podcastPlayer.loading = true;
												podcastPlayer.load(item, {
													title: title,
													image: image,
													description: description,
													url: url,
													creator: creator,
													id: data.podcast.id,
												});
											}
										}}
									>
										<div class="flex flex-col items-center">
											<Icon
												name={loaded && !$podcastPlayer.paused ? 'pauseSolid' : 'playSolid'}
												className="h-6 w-6 fill-primary-500/80"
											/>
										</div>
										<div class="flex w-full items-center text-sm transition-[width]">
											<Progress
												class="h-1 appearance-none rounded-full bg-gray-500 transition-[width] dark:bg-gray-600/50 {loaded
													? 'w-24 mr-2'
													: 'w-0'} {$podcastPlayer.loading ? 'animate-pulse' : ''}"
												innerClass="bg-gradient-to-r from-primary-500 to-primary-600"
												value={typeof $podcastPlayer.currentTime === 'number' && loaded
													? $podcastPlayer.currentTime
													: 0}
												max={typeof $podcastPlayer.duration === 'number' && loaded
													? $podcastPlayer.duration
													: 1}
												min={0}
											/>
											<!-- <progress
                        class="appearance-none rounded-full transition-[width] {loaded
                          ? 'w-64 mr-2'
                          : 'w-0'}"
                        value={typeof $podcastPlayer.currentTime === 'number'
                          ? $podcastPlayer.currentTime
                          : 0}
                        max={typeof $podcastPlayer.duration === 'number'
                          ? $podcastPlayer.duration
                          : 0}
                      /> -->
											<Muted
												>{loaded
													? formatDuration(
															$podcastPlayer.duration - $podcastPlayer.currentTime,
															'seconds'
													  ) + ' left'
													: formatDuration(item.duration, 'seconds')}
											</Muted>
										</div>
									</div>
								</div>
							</li>
						{/each}
					</ol>
					<a class="pt-2 text-primary-600" href="/rss/podcasts/{id}/episodes">
						See all episodes ({items.length})
					</a>
				</div>
			</div>
		{/if}
	</div>
</div>
