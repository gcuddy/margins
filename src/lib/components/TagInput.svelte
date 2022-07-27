<script lang="ts">
	import type { Tag } from '@prisma/client';
	import { writable } from 'svelte/store';
	// import Combobox, { defaultComboboxState } from './helpers/combobox/Combobox.svelte';
	import Form from './Form.svelte';
	export let tags: Tag[];
	let filteredTags = tags;
	export let selectedTags: Tag[];
	export let articleIds: number[];
	export let endpoint = '/api/tags';
	export let value = '';
	console.log({ selectedTags });
	$: value
		? (filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(value)))
		: (filteredTags = tags);
</script>

<!-- <Combobox
	items={tags.map((tag) => ({
		id: tag.id,
		label: tag.name,
		value: tag.name
	}))}
	selectMultiple={true}
	ComboboxState={writable({
		...defaultComboboxState,
		selected: selectedTags.map((tag) => ({ id: tag.id, label: tag.name, value: tag.name }))
	})}
/> -->

<hr />

<!-- this works as a filter/create with js, and as a "create new" with no js -->
<!-- TODO: make this work with a so-called "combobox" -->

<!-- (this should be what's used for no js) -->
<Form action={endpoint} method="post">
	<input type="text" name="tags" bind:value placeholder="Create new" />
	<button>Submit</button>
	{#each articleIds as id}
		<input type="hidden" name="ids" value={id} />
	{/each}
	{#each filteredTags as tag, index}
		<div>
			<label
				><input
					type="checkbox"
					name="tags"
					value={tag.name}
					id="tag-{index}"
					checked={selectedTags.map((t) => t.name).includes(tag.name)}
				/>
				{tag.name}
			</label>
		</div>
	{/each}
</Form>
