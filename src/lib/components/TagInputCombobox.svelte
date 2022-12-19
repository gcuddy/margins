<script lang="ts">
	import type { ArticleWithTags } from '$lib/types';
	import type { Article, Tag } from '@prisma/client';
	import Combobox from './helpers/Combobox.svelte';
	import { getNthValueOfSet } from '$lib/utils';
	import TagComponent from './Tags/Tag.svelte';
	import Icon from './helpers/Icon.svelte';
	import { onMount, tick } from 'svelte';
	import { getTags } from '$lib/data/sync';
	import Form from './Form.svelte';
	import { syncStore } from '$lib/stores/sync';
	import { notifications } from '$lib/stores/notifications';
	import TagEntry from './TagEntry.svelte';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { modals } from '$lib/stores/modals';
	export let allTags: Tag[] = [];

	onMount(() => {
		if (!allTags.length) {
			getTags().then((tags) => {
				allTags = tags;
			});
		}
	});

	export let className = '';
	console.log({ allTags });
	export let value = '';
	export let articles: ArticleWithTags[] = [];

	export let allow_create_tag = true;

	type TagInputTag = Pick<Tag, 'name'> & {
		special?: boolean;
	};
	let filteredTags: TagInputTag[];
	$: filteredTags = allTags
		.filter((tag) => tag.name.toLowerCase().includes(value.toLowerCase()))
		.filter((tag) => !selectedTags.has(tag.name));

	// admittedly, this is a frustrating way to do this lol
	$: newTagAvailable =
		value.length > 0 &&
		!(allTags as TagInputTag[])
			.concat(Array.from(selectedTags).map((tag) => ({ name: tag })))
			.some((tag) => tag.name.toLowerCase() === value.toLowerCase());
	$: if (newTagAvailable) {
		filteredTags.push({
			name: value,
			special: true,
			// perform: (val) => {
			// 	postTags([...$comboboxState.selected.map((tag) => tag.value), val]);
			// }
		});
	} else {
		filteredTags = filteredTags.filter((tag) => !tag.special);
	}
	// read only
	export let tags: Tag[] = [];

	// Tag Names must be unique, so we can use a simple Set<string>
	let selectedTags: Set<string> = new Set();
	articles
		.flatMap((article) => article.tags)
		.map((tag) => tag?.name)
		.filter((tag) => tag)
		.forEach((tag) => {
			console.log({ tag });
			selectedTags.add(tag);
		});

	// TODO: this is a very dumb way to do this, FIX IT
	$: tags = Array.from(selectedTags).map(
		(tag) => (allTags.find((t) => t.name === tag) as Tag) || { name: tag }
	);

	let activeTag: string | undefined = undefined;
	let activeTagIndex: number | undefined = undefined;
	let comboboxExpanded = false;
	$: if (activeTag && activeTagIndex !== undefined) {
		comboboxExpanded = false;
	}

	function handleKeydown({ detail }: CustomEvent<KeyboardEvent>) {
		console.log({ detail });
		const input = detail.target as HTMLInputElement;
		if (!value && detail.key === 'Backspace') {
			console.log('trying to delete');
			console.log({ activeTag, activeTagIndex });
			if (activeTag && activeTagIndex !== undefined) {
				console.log('trying to delete');
				selectedTags.delete(activeTag);
				activeTagIndex = Math.max(activeTagIndex - 1, 0);
				selectedTags = selectedTags;
			}
			activeTag = getNthValueOfSet(
				selectedTags,
				activeTagIndex !== undefined ? activeTagIndex : selectedTags.size - 1
			);
			// TODO: this is all getting very confusing. Probably a way to abstract/hoisut this and make it easier
			if (activeTag)
				activeTagIndex = selectedTags.has(activeTag) ? selectedTags.size - 1 : undefined;
		}
		if (!value && detail.key === 'ArrowLeft' && selectedTags.size) {
			if (activeTagIndex !== undefined) {
				console.log('setting activetagindex');
				console.log({ activeTagIndex });
				activeTagIndex = Math.max(activeTagIndex - 1, 0);
				console.log({ activeTagIndex });
			} else {
				activeTagIndex = selectedTags.size - 1;
			}
			activeTag = getNthValueOfSet(selectedTags, activeTagIndex);
		}
		if (!value && detail.key === 'ArrowRight' && selectedTags.size) {
			if (activeTagIndex !== undefined) {
				if (activeTagIndex === selectedTags.size - 1) {
					activeTagIndex = undefined;
					activeTag = undefined;
				} else {
					activeTagIndex = Math.min(activeTagIndex + 1, selectedTags.size - 1);
					activeTag = getNthValueOfSet(selectedTags, activeTagIndex);
				}
			}
		}
		if (!value && detail.key === 'Escape') {
			activeTag = undefined;
			activeTagIndex = undefined;
		}
		setTimeout(() => {
			console.log(input.value.length);
			if (input.value.length) {
				activeTag = undefined;
				activeTagIndex = undefined;
			}
		}, 0);
	}
	let inv = 'app:entries';
	export { inv as invalidate };
	let form: HTMLFormElement;
	let sync_id: string;

	let loading = false;
	export let size: 'lg' | 'base' = 'base';
</script>

<form
	action="/api/tags"
	method="post"
	use:enhance={() => {
		// todo
		loading = true;
		// optimistically udpating state might be better here, then reverting if it fails
		return async ({ result, update }) => {
			loading = false;
			console.log({ result });
			notifications.notify({
				message: 'Tag created',
				type: 'success',
			});
			update();
			modals.close({
				id: 'tag-modal',
			});
			invalidate(inv);
		};
	}}
>
	<TagEntry {articles} {loading} {size} />
</form>
