<script lang="ts">
	import type { RssSource } from '@margins/rss/finder';
	import { Button, Checkbox, Input, Label } from '@margins/ui';

	// TODO: replicate this for web app
	export let feeds: RssSource[] = [];
	export let onSubmit: (feeds: RssSource[]) => void = () => {};

	let checked = Object.fromEntries(
		feeds.map((source, index) => [source.url, index === 0]),
	);

	let titles = Object.fromEntries(
		feeds.map((source) => [source.url, source.name]),
	);
</script>

{#each feeds as source}
	<Label class="flex flex-col">
		<div class="flex gap-1">
			{#if feeds.length > 1}
				<Checkbox bind:checked={checked[source.url]} />
			{/if}
			<Input bind:value={titles[source.url]} />
		</div>
		<span class="mt-px flex justify-end text-xs">
			{source.url}
		</span>
	</Label>
{/each}

<Button
	on:click={() => {
		onSubmit(
			feeds
				.filter((feed) => checked[feed.url])
				.map((feed) => ({
					name: titles[feed.url],
					url: feed.url,
				})),
		);
	}}>Subscribe</Button
>
