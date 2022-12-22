<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { Tag } from '@prisma/client';
	import { onMount } from 'svelte';
	import TagEntry from './TagEntry.svelte';
	export let allTags: Tag[] = $page.data.tags || [];

	export let tags: Tag[];
	export let original: {
		tags: Tag[];
	};

	export let entryId: number | undefined = undefined;

	let ref: HTMLFormElement;
</script>


<!-- TODO: make this be able to use multiple ids? -->
<form
	action="{entryId ? `/u:${$page.data.user?.username}/entry/${entryId}` : ''}?/tag"
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
		{allTags}
	/>
</form>
