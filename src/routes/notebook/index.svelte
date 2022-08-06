<script lang="ts">
	import type { AnnotationWithArticle, ArticleWithNotesAndTagsAndContext } from '$lib/types';
	import ArticleNotes from './_ArticleNotes.svelte';
	import { filteredNotebookArticles, notebookArticles, notebookSearch } from '$lib/stores/notebook';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import NoteFilter from './_NotebookFilter.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import { TargetSchema } from '$lib/types/schemas/Annotations';
	import Muted from '$lib/components/atoms/Muted.svelte';
	import Filter from '$lib/components/Filter.svelte';
	import { currentItems } from '$lib/stores/filter';
	// export let articles: ArticleWithNotesAndTagsAndContext[];
	export let annotations: AnnotationWithArticle[];

	// group annotations by article
	// annotations.reduce((acc, annotation) => {
	// 	const article = annotation.article;
	// 	const articleId = article.id;
	// 	const articleAnnotations = acc[articleId] || [];
	// 	acc[articleId] = [...articleAnnotations, annotation];
	// 	return acc;
	// }, {});

	const _articles = annotations.flatMap((a) => a.article);
	const article_ids = new Set(annotations.flatMap((a) => a.article.id));
	// console.log({ annotations, article_ids });
	// notebookArticles.set(articles);
	currentItems.setCurrentItems(_articles, 'title');
</script>

<Header>
	<DefaultHeader>
		<div slot="start">Notebook</div>
		<div slot="end">
			<Filter />
		</div>
	</DefaultHeader>
</Header>

{#if annotations.length}
	<ul class="space-y-2 px-4 py-4">
		{#each Array.from(article_ids) as article_id (article_id)}
			{@const article = _articles.find((a) => a.id === article_id)}
			<li>
				<div class="flex space-x-4">
					<a sveltekit:prefetch href="/{article?.id}">
						<h2 class="font-medium">{article?.title}</h2>
					</a>
					<Muted>
						{article?.author}</Muted
					>
				</div>
				<ul class="space-y-2">
					{#each annotations.filter((a) => a.article.id === article_id) as annotation (annotation.id)}
						{@const target = TargetSchema.parse(annotation.target)}
						<li class="px-4">
							<div
								class={'before:content-[""] before:border-l-2 before:mr-4 before:border-primary-200'}
							>
								<!-- 				ideally:				<a sveltekit:prefetch href="/{article?.id}#annotation-{annotation.id}"
 -->
								<a sveltekit:prefetch href="/{article?.id}?a={annotation.id}"
									>{target.selector.exact}</a
								>
							</div>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
{:else}
	<div class="grid h-full place-items-center">
		<div class="flex max-w-lg space-x-4">
			<div>
				<Icon name="bookmarkAlt" className="h-6 w-6 relative top-px stroke-2 stroke-gray-600" />
			</div>
			<div class="flex flex-col space-y-3">
				<span class="text-lg font-medium">Notebook</span>
				<span class="text-gray-600 dark:text-gray-500"
					>No annotations yet! When you create annotations, they will appear here.</span
				>
			</div>
		</div>
	</div>
{/if}

<!-- <NotebookSearch bind:articles={filteredArticles} /> -->

<!-- TODO: be able to click note and go directly to it (probably with url params like ?id=XX&type=annotation) -->
<!-- {#if $filteredNotebookArticles.length}
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
	<div class="grid h-full place-items-center">
		<div class="flex max-w-lg space-x-4">
			<div>
				<Icon name="bookmarkAlt" className="h-6 w-6 relative top-px stroke-2 stroke-gray-600" />
			</div>
			<div class="flex flex-col space-y-3">
				<span class="text-lg font-medium">Notebook</span>
				<span class="text-gray-600 dark:text-gray-500"
					>No annotations yet! When you create annotations, they will appear here.</span
				>
			</div>
		</div>
	</div>
{/if} -->
