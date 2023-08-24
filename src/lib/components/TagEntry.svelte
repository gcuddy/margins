<script lang="ts">
	import type { ArticleWithTags } from "$lib/types";
	import type { Article, Tag } from "@prisma/client";
	import Combobox from "./helpers/Combobox.svelte";
	import { getNthValueOfSet } from "$lib/utils";
	import TagComponent, { type TagVariant } from "./tags/Tag.svelte";
	import Icon from "./helpers/Icon.svelte";
	import type { ExtendedBookmark } from "$lib/bookmark";
	import { notifications } from "$lib/stores/notifications";
	import { page } from "$app/stores";
	type TagWithNeededProperties = Pick<Tag, "id" | "name">;
	export let allTags: TagWithNeededProperties[] = $page.data.tags || [];
	$: console.log({ allTags });
	export let className = "";
	export let value = "";
	export let items: { tags: TagWithNeededProperties[] }[] = [];
	$: console.log({ items });
	export let allow_create_tag = true;

	export let ref: HTMLElement | undefined = undefined;
	type TagInputTag = Pick<Tag, "name"> & {
		special?: boolean;
	};
	let filteredTags: TagInputTag[];
	$: filteredTags =
		allTags
			?.filter((tag) => tag.name.toLowerCase().includes(value.toLowerCase()))
			.filter((tag) => !selectedTags.has(tag.name)) || [];

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
	export let tags: {id?: number; name: string;}[] = [];
    $: console.log({tags})
	/// read only
	export let pending = false;


    export let placeholder = "Add tag…";
    export let placeholderIcon = false;

	// Tag Names must be unique, so we can use a simple Set<string>
	let selectedTags: Set<string> = new Set();
	items
		.flatMap((article) => article.tags)
		.map((tag) => allTags.find((a) => a.id === tag.id)?.name)
		.filter((tag) => tag)
		.forEach((tag) => {
			console.log({ tag });
			if (tag) selectedTags.add(tag);
		});

	// add passed in tags
	tags.forEach((tag) => selectedTags.add(tag.name));

	// TODO: this is a very dumb way to do this, FIX IT
	$: tags = Array.from(selectedTags).map(
		(tag) => (allTags.find((t) => t.name === tag) as Tag) || { name: tag }
	);

	let activeTag: string | undefined = undefined;
	let activeTagIndex: number | undefined = undefined;
	export let comboboxExpanded = false;
	$: if (activeTag && activeTagIndex !== undefined) {
		comboboxExpanded = false;
	}

	function handleKeydown({ detail }: CustomEvent<KeyboardEvent>) {
		console.log({ detail });
		const input = detail.target as HTMLInputElement;
		if (!value && detail.key === "Backspace") {
			console.log("trying to delete");
			console.log({ activeTag, activeTagIndex });
			if (activeTag && activeTagIndex !== undefined) {
				console.log("trying to delete");
				selectedTags.delete(activeTag);
				activeTagIndex = Math.max(activeTagIndex - 1, 0);
				selectedTags = selectedTags;
			}
			activeTag = getNthValueOfSet(
				selectedTags,
				activeTagIndex !== undefined ? activeTagIndex : selectedTags.size - 1
			);
			// TODO: this is all getting very confusing. Probably a way to abstract/hoisut this and make it easier
			if (activeTag) activeTagIndex = selectedTags.has(activeTag) ? selectedTags.size - 1 : undefined;
		}
		if (!value && detail.key === "ArrowLeft" && selectedTags.size) {
			if (activeTagIndex !== undefined) {
				console.log("setting activetagindex");
				console.log({ activeTagIndex });
				activeTagIndex = Math.max(activeTagIndex - 1, 0);
				console.log({ activeTagIndex });
			} else {
				activeTagIndex = selectedTags.size - 1;
			}
			activeTag = getNthValueOfSet(selectedTags, activeTagIndex);
		}
		if (!value && detail.key === "ArrowRight" && selectedTags.size) {
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
		if (detail.key === "Escape") {
			if (value) {
				value = "";
			} else if (activeTag || activeTagIndex) {
				activeTag = undefined;
				activeTagIndex = undefined;
			} else {
				ref?.blur();
			}
		}
		setTimeout(() => {
			if (input.value.length) {
				activeTag = undefined;
				activeTagIndex = undefined;
			}
		}, 0);
	}
	let form: HTMLFormElement;
	export let invalidate: string | undefined = "/api/tags";

	let sync_id: string;

	export let loading = false;

	export let size: "lg" | "base" | "sm" | "xs" = "base";

	export let pillVariant: TagVariant = "ghost";
</script>

<!-- {#each items as { id }, index} -->
<!-- todo: useThePlatform, wnot qs, right? -->
<!-- <input type="hidden" name="ids[]" value={id} /> -->
<!-- {/each} -->
<div class="flex items-center {className}">
	{#if selectedTags.size}
		<div class="flex gap-2 {size === 'lg' ? 'text-base' : size === 'base' ? 'text-sm' : 'text-xs'}">
			{#each tags as tag, i}
				<div>
					<input type="hidden" name="tags[{i}][name]" value={tag.name} />
					<!-- <input type="hidden" name="tags" value={tag.name} /> -->
					{#if tag.id}<input type="hidden" name="tags[{i}][id]" value={tag.id} />{/if}
					<TagComponent
						as="a"
						{tag}
						variant={pillVariant}
						active={tag.name === activeTag}
						on:click={() => (activeTag = tag.name)}
					/>
				</div>
			{/each}
		</div>
	{/if}
	<!-- @ts-ignore -->
	<Combobox
		bind:inputRef={ref}
		fillValue={false}
		values={filteredTags}
		idResolver={(tag) => tag.name}
		bind:value
		bind:expanded={comboboxExpanded}
		animateHeight={false}
		on:blur
		on:blur={() => {
			console.log("blur!");
			activeTag = undefined;
			activeTagIndex = undefined;
			value = "";
		}}
		on:select={async ({ detail }) => {
			//TODO
			console.log({ detail });
			selectedTags.add(detail.name);
			selectedTags = selectedTags;
			value = "";
			// if (detail.special) {
			// 	// then create the tag
			// 	try {
			// 		pending = true;
			// 		const res = await fetch(`/api/v1/tags.json`, {
			// 			method: 'POST',
			// 			body: JSON.stringify({ name: detail.name }),
			// 		});
			// 		const data = await res.json();
			// 		allTags = [...allTags, data];
			// 		pending = false;
			// 	} catch {
			// 		selectedTags.delete(detail.name);
			// 		notifications.notify({
			// 			type: 'error',
			// 			title: 'Failed to create tag',
			// 		});
			// 	}
			// }
			console.log({ selectedTags });
			console.log("add");
		}}
		input={{
			class: `px-2 py-1 placeholder-muted/50 bg-transparent focus:ring-0 border-0 w-full ${
				size === "lg" ? "text-lg" : size === "base" ? "text-base" : size === "sm" ? "text-sm" : "text-xs"
			} ${activeTag ? "caret-transparent" : ""}`,
			placeholder: `${selectedTags.size ? "" : placeholder}`,
		}}
		inputParent={{
			class: "flex justify-between items-center",
		}}
		options={{
			class: `absolute z-10 mt-1 ring-1 shadow-xl min-w-max ring-black/10 bg-gray-700 text-gray-100 max-h-48 overflow-y-auto text-sm rounded-xl p-2 ${
				filteredTags.length === 0 ? "hidden" : ""
			}`,
		}}
		on:input-click={(e) => {
			console.log({ e });
			activeTag = undefined;
			activeTagIndex = undefined;
		}}
		on:keydown={handleKeydown}
		class="relative w-full"
	>
		<div slot="inputPeerAfter" class="flex items-center pr-2">
			{#if loading}
				<Icon
					name="loading"
					className="w-5 h-5 text-current transition {loading ? 'opacity-100 animate-spin' : 'opacity-0 '}"
				/>
			{/if}
		</div>
		<div slot="option" let:value let:active>
			<!-- TODO: set off special in their own world ?? (loook at Things) -->
			<div
				class="{active ? 'bg-primary-300 text-black' : 'text-gray-200s'} {value.special
					? ''
					: ''} rounded-md px-2 py-1 "
			>
				<div class="flex gap-2 ">
					{#if value.special && allow_create_tag}
						<Icon name="plusCircleSolid" className="w-5 h-5 fill-current" />
						<span>Create tag: "{value.name}"</span>
					{:else}
						<Icon name="tag" className="w-5 h-5 stroke-current stroke-2" />
						<span>{value.name}</span>
					{/if}
				</div>
			</div>
		</div>
	</Combobox>
</div>
