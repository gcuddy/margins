<script lang="ts">
	import Muted from "$lib/components/atoms/Muted.svelte";
	import type { TweetV2SingleResult } from "twitter-api-v2";
	export let tweet: TweetV2SingleResult;
	import MagicString from "magic-string";
	import dayjs from "$lib/dayjs";

	function buildTweet(s: MagicString) {
		tweet.data.entities?.hashtags?.forEach((hashtag) => {
			s.overwrite(
				hashtag.start,
				hashtag.end,
				`<a href="https://twitter.com/hashtag/${hashtag.tag}?src=hashtag_click" class="text-blue-500">#${hashtag.tag}</a>`
			);
		});
		tweet.data.entities?.mentions?.forEach((mention) => {
			s.overwrite(
				mention.start,
				mention.end,
				`<a href="https://twitter.com/${mention.username}" class="text-blue-500">@${mention.username}</a>`
			);
		});
		tweet.data.entities?.urls?.forEach((url) => {
			if (url.media_key) {
				// go through the media array and find the media with the same media_key
				const media = tweet.includes?.media?.find((media) => media.media_key === url.media_key);
				// if the media is a photo, replace the url with an image
				if (media?.type === "photo") {
					s.overwrite(url.start, url.end, `<img src="${media.url}" alt="${media.alt_text}" />`);
				}
				// if the media is a video, replace the url with a video
				if (media?.type === "video") {
					// get variant
					const variant = media?.variants?.find((variant) => variant.content_type === "video/mp4");
					s.overwrite(
						url.start,
						url.end,
						`<video class="mt-4 aspect-video rounded-lg overflow-hidden" controls src="${variant?.url}" alt="${media.alt_text}" />`
					);
				}
			} else {
				s.overwrite(url.start, url.end, `<a href="${url.url}" class="text-blue-500">${url.display_url}</a>`);
			}
		});
	}
	$: console.log({ tweet });
	$: s = new MagicString(tweet.data.text);
	$: html = buildTweet(s);
</script>

<div
	class=" mx-auto flex max-w-prose flex-col gap-4 rounded-lg border border-gray-400 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800"
>
	<div class="flex items-center gap-3 text-sm">
		<img
			class="h-10 w-10 rounded-full"
			alt="Profile picture"
			src={tweet.includes?.users?.at(0)?.profile_image_url}
		/>
		<div>
			<div class="font-medium">{tweet.includes?.users?.at(0)?.name}</div>
			<Muted>@{tweet.includes?.users?.at(0)?.username}</Muted>
		</div>
	</div>
	<div>{@html s.toString()}</div>
	<div class="flex gap-4 text-sm">
		<Muted>{dayjs(tweet.data.created_at).format("h:mm A")}</Muted>
		<Muted>{dayjs(tweet.data.created_at).format("ll")}</Muted>
	</div>
	<div>
		<!-- TODO: update these with query -->
		<!-- do we need metrics? -->
	</div>
</div>
