<script lang="ts">
	import { page } from '$app/stores';
	import type { ExtendedBookmark } from '$lib/bookmark';
	import type { ArticleInList } from '$lib/types';
	import type { ViewOptions } from '$lib/types/schemas/View';
	import AnnotationCount from './AnnotationCount.svelte';
	import LocationPill from './LocationPill.svelte';
	import Tag from './tags/Tag.svelte';

	export let item: ExtendedBookmark;
	export let viewOptions: Partial<ViewOptions>;

	let annotationEl: HTMLElement | undefined;
	$: annotations = item.annotations?.filter((a) => a.type === 'annotation');
	$: annotationLength = item['_count']?.annotations || annotations?.length;
	$: allTags = $page.data.tags;
	$: tagNames = allTags?.filter((t) => item.tags?.some((i) => i.id === t.id));
</script>

<!-- TODO: eventually make it so they overlap! -->
<div class="flex space-x-1 text-xs">
	{#if annotationLength && viewOptions.properties?.annotationCount}
		<AnnotationCount count={annotationLength} bind:el={annotationEl} />
	{/if}
	<!-- {#if item.state && viewOptions.properties?.location}
		<LocationPill location={item.state.type} />
	{/if} -->
	{#if tagNames?.length && viewOptions.properties?.tags}
		{#each tagNames as tag}
			<Tag {tag} variant="ghost" icon={true} delIcon={false} />
		{/each}
	{/if}
</div>
