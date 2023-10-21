<script lang="ts">
	import type { Tag as ITag } from '@prisma/client';
	import Tag, { type TagVariant } from './tags/Tag.svelte';
	export let tags: {
        id?: number;
        name: string;
    }[];
	export let variant: TagVariant = 'ghost';
	export let icon = true;
	export let delIcon = false;

    let c = "space-x-3 text-xs";
    export { c as class };
</script>

{#if tags}
	<div class="flex {c}">
		{#each tags as tag (tag.id || tag.name)}
			<Tag {tag} {variant} {icon} {delIcon} on:delete />
		{/each}
	</div>
{/if}
