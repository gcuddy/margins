<script lang="ts">
	import type { Tag as ITag } from '@prisma/client';
	import Tag, { type TagVariant } from './Tags/Tag.svelte';
	export let tags: ITag[];
	export let variant: TagVariant = 'ghost';
	export let icon = true;
	export let delIcon = false;
</script>

{#if tags}
	<div class="flex space-x-3 text-xs">
		{#each tags as tag (tag.id)}
			<Tag {tag} {variant} {icon} {delIcon} on:delete />
		{/each}
	</div>
{/if}
