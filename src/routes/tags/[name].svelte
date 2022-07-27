<script lang="ts">
	import Icon from '$lib/components/helpers/Icon.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import Saved from '$lib/components/Saved.svelte';
	import type { TagWithArticle } from '$lib/types';

	export let tag: TagWithArticle;
	console.log({ tag });
</script>

<Header>
	<DefaultHeader>
		<div slot="start">
			<h1 class="flex items-center space-x-3">
				<Icon name="tag" className="h-5 w-5 stroke-current stroke-2" /><span>{tag.name}</span>
			</h1>
			<!-- TODO: Edit Menu (rename, delete) -->
		</div>
		<div slot="end">Edit View</div>
	</DefaultHeader>
</Header>

<div class="flex h-full flex-auto flex-col overflow-hidden">
	<!-- todo; overflow-auto and get scrolling to work only WITHIN this container... -->
	<div class="relative overflow-auto">
		<Saved articles={tag.articles} />
	</div>
</div>
<!-- <Saved articles={tag.articles} /> -->
