<script lang="ts">
	import { page } from '$app/stores';
	import { isTouchDevice } from '$lib/utils';
	import type { Tag } from '@prisma/client';

	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import Button from '../Button.svelte';
	import TagEntry from '../TagEntry.svelte';
	export let value = '';
	export let el: HTMLElement | undefined;
	export let scrollIntoView = true;
	export let allTags: Tag[] = [];
	$: console.log({ allTags });
	if (!allTags.length) {
		if ($page.data.tags) {
			allTags = $page.data.tags;
		} else {
			fetch(`/api/v1/tags.json`)
				.then((res) => res.json())
				.then((tags) => (allTags = tags));
		}
		// todo: fetch
	}
	export let tags: Tag[] = [];
	$: console.log({ tags });
	const dispatch = createEventDispatcher<{
		save: {
			value: string;
		};
		cancel: void;
	}>();
	// onMount(() => {
	// 	el && scrollIntoView && el.scrollIntoView({ block: 'center', behavior: 'smooth' });
	// });
</script>

<!-- TODO: TURN INTO FORM -->

<!-- transparency is a bit much (and maybe causes gpu performance issues), but here were the classes: dark:transparency:bg-gray-800/50 dark:transparency:backdrop-blur-xl dark:transparency:backdrop-brightness-75 dark:transparency:backdrop-contrast-75 dark:transparency:backdrop-saturate-200 -->
<div
	bind:this={el}
	class="annotation-input not-prose relative z-50 flex min-w-max max-w-md resize scroll-mt-12 flex-col items-start gap-2.5 rounded-lg border border-gray-300 bg-white p-2.5  font-sans font-medium shadow-lg transparency:bg-gray-50/90 transparency:backdrop-blur-xl transparency:backdrop-brightness-125 transparency:backdrop-saturate-200 dark:border-gray-700 dark:bg-gray-800 dark:shadow-2xl transparency:dark:bg-gray-800"
>
	<div class="resizer absolute bottom-0 right-0">
		<!-- <Icon name="" /> -->
		<!-- TODO: 8 direction resize -->
	</div>
	<!-- todo: auto expand -->
	<div class="no-drag cursor-default">
		<textarea
			on:keydown={(e) => {
				if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
					e.preventDefault();
					dispatch('save', { value });
				}
			}}
			rows="4"
			placeholder="Add an annotation…"
			bind:value
			class="w-full grow resize-none border-0 bg-transparent placeholder-gray-400 transition focus:ring-0"
		/>
		<div class="flex grow items-center">
			<TagEntry bind:tags className="grow text-xs not-italic" {allTags} />
		</div>
	</div>
	<div class="flex flex-row items-center justify-end space-x-2 self-stretch">
		<!-- //todo -->
		<Button variant="ghost" on:click={() => dispatch('cancel')}>Cancel</Button>
		<Button
			variant="confirm"
			type="submit"
			on:click={() =>
				dispatch('save', {
					value,
				})}>Save</Button
		>
	</div>
</div>

<style>
	:global(.neodrag-dragging) textarea {
		cursor: grabbing !important;
	}
	.annotation-input {
		transform: scale(var(--scale));
	}
</style>
