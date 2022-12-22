<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { getTags } from '$lib/data/sync';
	import type { Tag } from '@prisma/client';
	import { onMount } from 'svelte';
	import TagEntry from './TagEntry.svelte';
	export let allTags: Tag[] = [];

	onMount(() => {
		if (!allTags.length) {
			getTags().then((tags) => {
				allTags = tags;
			});
		}
	});

	export let tags: Tag[];
	export let original: {
		tags: Tag[];
	};

	let ref: HTMLFormElement;
</script>

<form
	action="?/tag"
	method="post"
	bind:this={ref}
	use:enhance={() => {
		//
	}}
>
	<TagEntry
		on:blur={(e) => {
			// check for diff
			let same =
				original?.tags.length === tags.length &&
				original.tags.every((btag) => tags.some((tag) => btag.id === tag.id));
			console.log({ same });
			if (!same) {
				ref.requestSubmit();
			}
		}}
		bind:tags
		items={[original]}
		allTags={$page.data.tags}
	/>
</form>
