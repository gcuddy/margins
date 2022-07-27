<script lang="ts">
	import type { ArticleWithNotesAndTagsAndContext } from '$lib/types';
	import ArticleNotes from './_ArticleNotes.svelte';
	import { filteredNotebookArticles, notebookArticles, notebookSearch } from '$lib/stores/notebook';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import NoteFilter from './_NotebookFilter.svelte';
	export let articles: ArticleWithNotesAndTagsAndContext[];
	notebookArticles.set(articles);
</script>

<h1>Notebook</h1>

<!-- <NotebookSearch bind:articles={filteredArticles} /> -->

<!-- TODO: be able to click note and go directly to it (probably with url params like ?id=XX&type=annotation) -->
<div class="container mx-auto">
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
</div>
