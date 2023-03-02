<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { notifications } from '$lib/stores/notifications';
	import type { Tag } from '@prisma/client';
	import { onMount } from 'svelte';
	import TagEntry from './TagEntry.svelte';

    export let inputRef: HTMLElement | undefined = undefined;

    export let submitOnBlur = true;

    export let expanded = false;

	type AcceptedTag = {
        id?: number;
        name: string;
    };
	// type AcceptedTag = Omit<Tag, 'createdAt' | 'updatedAt'>;

	export let allTags: AcceptedTag[] = $page.data.tags || [];

	export let tags: AcceptedTag[];
	export let original: {
		tags: AcceptedTag[];
	} | undefined = undefined;

	export let entryId: number | undefined = undefined;

	let ref: HTMLFormElement;
	let c = '';
	export { c as class };
</script>

<!-- TODO: make this be able to use multiple ids? -->
<form
	class={c}
	action="{entryId ? `/u:${$page.data.user?.username}/entry/${entryId}` : ''}?/tag"
	method="post"
	bind:this={ref}
	use:enhance={() => {
		return ({ update, result }) => {
			if (result.type === 'success') {
				notifications.notify({
					title: 'Tag saved',
					type: 'success',
				});
			} else {
				notifications.notify({
					title: 'Error saving tag',
					type: 'error',
				});
			}
		};
	}}
>
	<TagEntry
		size="sm"
        bind:comboboxExpanded={expanded}
        bind:ref={inputRef}
		on:blur={(e) => {
			// check for diff
            if (!submitOnBlur) return;
			ref.requestSubmit();

			// let same =
			// 	original?.tags.length === tags.length &&
			// 	original.tags.every((btag) => tags.some((tag) => btag.id === tag.id));
			// console.log({ same });
			// if (!same) {
			// 	ref.requestSubmit();
			// }
		}}
		bind:tags
        />
		<!-- items={[original]} -->
</form>
