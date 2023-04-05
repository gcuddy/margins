<script lang="ts">
	import { page } from "$app/stores";
	import EntryOperations from "$lib/components/EntryOperations.svelte";
	import AspectRatio from "$lib/components/ui/AspectRatio.svelte";
	import { formatDate } from "$lib/utils/date";
	import type { Entry } from "@prisma/client";
	import { Image } from "@unpic/svelte";

	type EntryItemProps = Pick<
		Entry,
		"id" | "title" | "published" | "author" | "type" | "uri" | "image"
	> &
		Partial<
			Pick<Entry, "feedId"> & {
				feed_title: string | null;
				feed_image: string | null;
			}
		>;
	export let entry: EntryItemProps;
	$: username = $page.params.username ?? undefined;

	$: fallback_image = `https://icon.horse/icon?uri=${entry.uri}`;

	function getSrc(img: string | null) {
		if (img?.endsWith("undefined")) {
			return fallback_image;
		}
		if (img?.startsWith("https://")) {
			return img;
		}
		// if (img) {
		// 	return img;
		// }
		// if (entry.feed_image) {
		// 	return entry.feed_image;
		// }
		return fallback_image;
	}
</script>

<div class="flex items-center justify-between gap-2 p-4">
	<div class="flex items-center gap-4">
		<div class="h-8 w-8 shrink-0 overflow-hidden rounded-md sm:h-10 sm:w-10">
			<Image
				class="aspect-square w-10 object-cover hover:scale-105"
				src={getSrc(entry.image)}
				on:error={(e) => {
					if (e.target && "src" in e.target) {
						e.target.src = fallback_image;
					}
				}}
				alt=""
				layout="constrained"
				width={40}
				height={40}
			/>
		</div>
		<!-- <img

		/> -->
		<div class="grid gap-0.5">
			<a
				href="{username ? `/u:${username}` : ''}/entry/{entry.id}"
				class="line-clamp-2 font-semibold hover:underline"
			>
				{entry.title ?? "[No title]"}
			</a>
			<div class="flex gap-1.5">
				{#if entry.feedId && entry.feed_title}
					<a
						href="{username
							? `/u:${username}`
							: ''}/subscriptions/{entry.feedId}"
						class="text-sm text-gray-600 dark:text-gray-500"
					>
						{entry.feed_title}
					</a>
				{/if}
				{#if entry.author && entry.feedId && entry.feed_title}
					<span class="text-sm text-gray-600 dark:text-gray-500">·</span>
				{/if}
				{#if entry.author}
					<span class="text-sm text-gray-600 dark:text-gray-500">
						{entry.author}
					</span>
				{/if}
			</div>
			<div>
				{#if entry.published}
					<p class="text-sm text-gray-600 dark:text-gray-500">
						{formatDate(entry.published?.toDateString())}
					</p>
				{/if}
			</div>
		</div>
	</div>
	<EntryOperations entry={{ id: entry.id, title: entry.title }} />
</div>
