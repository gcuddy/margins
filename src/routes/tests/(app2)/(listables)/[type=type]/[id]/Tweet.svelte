<script lang="ts">
	import MagicString from 'magic-string';
	import { onMount } from 'svelte';

	import { Card } from '$lib/components/ui/card';
	import Muted from '$lib/components/ui/typography/Muted.svelte';
	import dayjs from '$lib/dayjs';

	import type { PageData } from './$types';

	type Tweet = NonNullable<NonNullable<PageData['entry']>['tweet']>;

	export let data: PageData & {
		entry: {
			tweet: Tweet;
		};
	};

	$: tweet = data.entry.tweet;

	function buildTweet(s: MagicString) {
		// wrap text in <p> tags
		s.prepend('<p>');
		s.append('</p>');
		tweet.data.entities?.hashtags?.forEach((hashtag) => {
			s.overwrite(
				hashtag.start,
				hashtag.end,
				`<a target="_blank" href="https://twitter.com/hashtag/${hashtag.tag}?src=hashtag_click" class="text-blue-500">#${hashtag.tag}</a>`
			);
		});
		tweet.data.entities?.mentions?.forEach((mention) => {
			s.overwrite(
				mention.start,
				mention.end,
				`<a target="_blank" href="https://twitter.com/${mention.username}" class="text-blue-500">@${mention.username}</a>`
			);
		});
		tweet.data.entities?.urls?.forEach((url) => {
			if (url.media_key) {
				// go through the media array and find the media with the same media_key
				const media = tweet.includes?.media?.find((media) => media.media_key === url.media_key);
				// if the media is a photo, replace the url with an image
				if (media?.type === 'photo') {
					s.overwrite(url.start, url.end, `<img src="${media.url}" alt="${media.alt_text}" />`);
				}
				// if the media is a video, replace the url with a video
				if (media?.type === 'video') {
					// get variant
					const variant = media?.variants?.find((variant) => variant.content_type === 'video/mp4');
					s.overwrite(
						url.start,
						url.end,
						`<video class="mt-4 aspect-video rounded-lg overflow-hidden" controls src="${variant?.url}" alt="${media.alt_text}" />`
					);
				}
			} else {
				s.overwrite(
					url.start,
					url.end,
					`<a target="_blank" href="${url.url}" class="text-blue-500">${url.display_url}</a>`
				);
			}
		});
	}
	$: console.log({ tweet });
	let html = '';
	$: if (tweet) {
		const s = new MagicString(tweet.data.text);
		buildTweet(s);
		html = s.toString();
	}
</script>

{#if tweet}
	{@const username = tweet.includes?.users?.at(0)?.username}
	<Card class="max-w-prose">
		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-3 text-sm">
				<img
					class="h-10 w-10 rounded-full"
					alt=""
					src={tweet.includes?.users?.at(0)?.profile_image_url}
				/>
				<div class="flex flex-col">
					<a target="_blank" href="https://twitter.com/{username}" class="font-medium">{tweet.includes?.users?.at(0)?.name}</a
					>
					{#if username}
						<Muted>@{username}</Muted>
					{/if}
				</div>
			</div>
			<div class="prose">{@html html}</div>
			<a target="_blank" href='https://twitter.com/{username}/status/{tweet.data.id}' class="flex gap-4 text-sm">
				<Muted>{dayjs(tweet.data.created_at).format('h:mm A')}</Muted>
				<Muted>{dayjs(tweet.data.created_at).format('ll')}</Muted>
			</a>
		</div>
	</Card>
	<!-- <div
		class=" mx-auto flex max-w-prose flex-col gap-4 rounded-lg border border-gray-400 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800"
	>
		<div class="flex items-center gap-3 text-sm">
			<img
				class="h-10 w-10 rounded-full"
				alt=""
				src={tweet.includes?.users?.at(0)?.profile_image_url}
			/>
			<div>
				<div class="font-medium">{tweet.includes?.users?.at(0)?.name}</div>
				<Muted>@{tweet.includes?.users?.at(0)?.username}</Muted>
			</div>
		</div>
		<div>{@html html}</div>
		<div class="flex gap-4 text-sm">
			<Muted>{dayjs(tweet.data.created_at).format('h:mm A')}</Muted>
			<Muted>{dayjs(tweet.data.created_at).format('ll')}</Muted>
		</div>
	</div> -->
{:else}
	<p>Error parsing tweet</p>
{/if}
