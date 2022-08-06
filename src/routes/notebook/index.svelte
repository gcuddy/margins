<script lang="ts">
	import type { ArticleWithNotesAndTagsAndContext } from '$lib/types';
	import ArticleNotes from './_ArticleNotes.svelte';
	import { filteredNotebookArticles, notebookArticles, notebookSearch } from '$lib/stores/notebook';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import NoteFilter from './_NotebookFilter.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	export let articles: ArticleWithNotesAndTagsAndContext[];
	notebookArticles.set(articles);
</script>

<Header>
	<DefaultHeader>
		<div slot="start">Notebook</div>
	</DefaultHeader>
</Header>

<!-- <NotebookSearch bind:articles={filteredArticles} /> -->

<!-- TODO: be able to click note and go directly to it (probably with url params like ?id=XX&type=annotation) -->
{#if $filteredNotebookArticles.length}
	<div class="flex justify-between">
		<input type="text" bind:value={$notebookSearch} />
		<NoteFilter />
	</div>
	{#each $filteredNotebookArticles as article}
		<section class="my-4">
			<div class="mb-2">
				<h2 class="flex justify-between text-xl">
					<div class="flex items-center gap-2">
						<a href="/{article.id}">{article.title}</a>
						<button
							><Icon
								name="star"
								className="fill-transparent stroke-black stroke-1"
								direction="n"
							/></button
						>
					</div>
					<div class="flex gap-3 text-gray-500">
						<span>{article.author}</span>
						<span>{new URL(article.url).hostname}</span>
					</div>
				</h2>
			</div>
			<ArticleNotes {article} />
		</section>
	{/each}
{:else}
	<div class="flex h-full flex-col items-center pt-[30vh]">
		<div class="flex max-w-xs space-x-4 md:max-w-lg">
			<div>
				<Icon name="bookmarkAlt" className="h-6 w-6 relative top-1 stroke-2 stroke-gray-600" />
			</div>
			<div class="flex flex-col space-y-3">
				<span class="text-lg font-medium">Notebook</span>
				<span class="text-gray-600"
					>No annotations yet! When you create annotations, they will appear here.</span
				>
			</div>
		</div>
	</div>
{/if}
