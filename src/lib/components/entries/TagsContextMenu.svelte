<script lang="ts">
	import { page } from "$app/stores";
	import ContextMenuCheckboxItem from "$components/ui/context-menu/ContextMenuCheckboxItem.svelte";
	import type { Promiseable } from "$lib/utils/type-utils";
    let tags: Promiseable<{ id: string; name: string }[]>;
</script>

{#await tags}
	Loading...
{:then tags}
	{#each tags || [] as tag}
		<ContextMenuCheckboxItem
			{checkboxItem}
			useCheckbox
			checked={!!entry.tags?.some((t) => t.id === tag.id)}
			onSelect={() => {
				// TODO: update tag
				console.log('update tag');
				// We set the state here so that the UI updates immediately
				update_entry(entry.id, {
					tags: data.tags?.some((t) => t.id === tag.id)
						? data.tags?.filter((t) => t.id !== tag.id)
						: [...(data.tags || []), tag]
				});
				// We set tag_state_dirty to let the context menu know that when it closes, we should call the mutation on the server
				// TODO or should it be debounced?
				tag_state_dirty = true;

				// mutation($page, 'update_tags_on_entry', {
				//     entries: [entry.id],
				//     tags: [tag.id]
				// })
			}}
		>
			{tag.name}
		</ContextMenuCheckboxItem>
	{/each}
{/await}
