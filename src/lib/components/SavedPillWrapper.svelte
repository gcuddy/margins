<script lang="ts">
	import type { ArticleInList } from '$lib/types';
	import type { ViewOptions } from '$lib/types/schemas/View';
	import AnnotationCount from './AnnotationCount.svelte';
	import LocationPill from './LocationPill.svelte';
	import Tag from './Tags/Tag.svelte';

	export let item: ArticleInList;
	export let viewOptions: ViewOptions;

	let annotationEl: HTMLElement | undefined;

	$: console.log({ item });
</script>

<!-- TODO: eventually make it so they overlap! -->
<div class="flex space-x-1 text-xs">
	<!-- TODO: add type -->
	{#if item['_count']?.annotations && viewOptions.properties.annotationCount}
		<AnnotationCount count={item['_count'].annotations} bind:el={annotationEl} />
	{/if}
	{#if item.location && viewOptions.properties.location}
		<LocationPill location={item.location} />
	{/if}
	{#if item.tags?.length && viewOptions.properties.tags}
		<!-- <div class="hidden sm:flex">
                    <TagCloud tags={item.tags} />
                  </div> -->
		{#each item.tags as tag}
			<Tag {tag} variant="ghost" icon={true} delIcon={false} />
		{/each}
	{/if}
</div>
