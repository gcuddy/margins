<script lang="ts">
	import { enhance, SubmitFunction } from "$app/forms";
	import { page } from "$app/stores";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import { notifications } from "$lib/stores/notifications";

	import {
		podcastSearchQuery,
		queryKeys,
	} from "$lib/features/podcasts/queries";
	import ImageLoader from "$lib/components/ui/images/ImageLoader.svelte";
	import ImageSkeleton from "$lib/components/ui/skeleton/ImageSkeleton.svelte";

	type Feed = RouterOutputs["podcasts"]["public"]["search"]["feeds"][number];
	export let feed: Feed;

	// expose "value" as prop so we can call it from generic command palette (REVIEW: is this the best way?)
	export let value: Feed | undefined = undefined;

	export let active = false;

	// if we're passed a value, use that instead of the feed
	$: feed = value || feed;

	let subscribed: boolean;
	$: subscribed = !!$page.data.user?.subscriptions?.some(
		(s) => s.feed?.podcastIndexId === feed.id
	);

	let img_error = false;
	let subscribing = false;

	const handleSubmit: SubmitFunction = () => {
		subscribed = !subscribed;
		return async ({ update, result }) => {
			update();
			if (result.type === "success") {
				console.log({ result });
				notifications.notify({
					type: "success",
					title: "Subscribed to podcast",
				});
			}
		};
	};
</script>

<li class="w-full grow border-t border-border p-4 text-content" class:active>
	<!-- 	href="{result.feedUrl}"		 -->
	<div class="flex h-12 items-center gap-4">
		{#if img_error || !feed.artwork}
			<!-- <div class="h-10 w-10 shrink-0 rounded bg-gray-300/75 object-cover" /> -->
			<div class="h-10 w-10 shrink-0">
				<ImageSkeleton />
			</div>
		{:else}
			<div class="shrink-0 shadow-lg">
				<ImageLoader
					class="h-10 w-10 shrink-0 rounded object-cover"
					src={feed.artwork}
					alt="Artwork for {feed.title}"
				/>
			</div>
			<!-- <img
				on:error={(e) => {
					img_error = true;
				}}
				loading="lazy"
				class="h-10 w-10 shrink-0 rounded object-cover"
				src={feed.artwork}
				alt="Artwork for {feed.title}"
			/> -->
		{/if}
		<a href="/podcasts/{feed.id}" class="flex flex-col gap-1 truncate">
			<span class="truncate font-medium">{feed.title}</span>
			<span class="truncate text-muted">{feed.author}</span>
		</a>
		<form
			class="ml-auto flex items-center"
			action="/podcasts/{feed.id}?/subscribe"
			method="post"
			use:enhance={handleSubmit}
		>
			<input type="hidden" name="title" value={feed.title} />
			<input type="hidden" name="podcastIndexId" value={feed.id} />
			<button type="submit" class="group ml-auto cursor-default">
				{#if subscribed}
					<Icon
						name="checkCircle2"
						className="h-6 w-6 stroke-gray-100 fill-green-500"
					/>
				{:else if subscribing}
					<Icon
						name="loading"
						className="h-6 w-6 animate-spin stroke-gray-500 "
					/>
				{:else if !subscribed}
					<Icon
						name="plusCircle2"
						className="h-6 w-6 {active
							? 'stroke-white'
							: 'stroke-gray-600'} group-hover:fill-gray-200"
					/>
				{/if}
			</button>
		</form>
	</div>
</li>

<style lang="postcss">
	.active {
		@apply bg-elevation-hover;
	}
</style>
