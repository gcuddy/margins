<script lang="ts">
	import type { AnnotationWithArticle, ArticleWithNotesAndTagsAndContext } from '$lib/types';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import { TargetSchema } from '$lib/types/schemas/Annotations';
	import Muted from '$lib/components/atoms/Muted.svelte';
	import Filter from '$lib/components/Filter.svelte';
	import { currentItems } from '$lib/stores/filter';

	import type { PageData } from './$types';
	import AnnotationItem from '$lib/components/AnnotationItem.svelte';
	import Button from '$lib/components/Button.svelte';
	import { fly } from 'svelte/transition';
	import SelectActions from '$lib/components/SelectActions.svelte';
	import KeyboardNav from '$lib/components/helpers/KeyboardNav/KeyboardNav.svelte';
	import KeyboardNavItem from '$lib/components/helpers/KeyboardNav/KeyboardNavItem.svelte';
	export let data: PageData;
	let { annotations } = data;
	const _articles = annotations.flatMap((a) => a.article);
	const article_ids = new Set(annotations.flatMap((a) => a.article.id));
	currentItems.setCurrentItems(_articles, 'title');
	let select_multiple = false;

	let selected: PageData['annotations'] = [];
</script>

<Header>
	<DefaultHeader>
		<div slot="start">Notebook</div>
		<div slot="end">
			<Filter />
			<Button
				variant="ghost"
				on:click={() => {
					select_multiple = !select_multiple;
				}}>Select multiple</Button
			>
		</div>
	</DefaultHeader>
</Header>

<SelectActions
	bind:selected_items={selected}
	actions={{
		addToList: true,
	}}
	on:update={() => {
		select_multiple = false;
	}}
/>

{#if annotations.length}
	<KeyboardNav>
		<ul class="space-y-6 divide-y px-4 py-4 dark:divide-gray-700">
			{#each Array.from(article_ids) as article_id (article_id)}
				{@const article = _articles.find((a) => a.id === article_id)}
				<li class="pt-4">
					<div class="flex items-baseline space-x-4">
						<a data-sveltekit-prefetch href="/{article?.id}">
							<h2 class="text-xl font-medium line-clamp-3">{article?.title}</h2>
						</a>
						<Muted>
							{article?.author || article.siteName || ''}</Muted
						>
					</div>
					<ul class="relative space-y-4 px-2 pt-3">
						{#each annotations
							.filter((a) => a.article.id === article_id && a.motivation === 'describing')
							.slice(0, 1) as annotation (annotation.id)}
							{#if annotation.body}
								<div class="flex items-center transition">
									<input
										in:fly|local={{ x: -5 }}
										type="checkbox"
										class="h-6 w-0 rounded-full opacity-0 transition-all {select_multiple &&
											'!w-6 opacity-100 mr-2'}"
										value={annotation}
										bind:group={selected}
									/>
									<div
										class="relative max-h-24 overflow-y-auto overflow-x-hidden rounded bg-gradient-to-br from-gray-50 to-gray-100 p-2 shadow ring-1 ring-black/10 dark:bg-gray-800 dark:from-gray-700 dark:to-gray-800 dark:shadow-2xl"
									>
										{@html annotation.body}
									</div>
								</div>
							{/if}
						{/each}
						{#each annotations.filter((a) => a.article.id === article_id && a.motivation !== 'describing') as annotation (annotation.id)}
							{@const target = TargetSchema.parse(annotation.target)}
							<div class="flex items-center space-x-2">
								{#if select_multiple}
									<input
										in:fly|local={{ x: -5 }}
										type="checkbox"
										class="h-6 w-6  rounded-full"
										value={annotation}
										bind:group={selected}
									/>
								{/if}
								<li
									class="relative rounded bg-gradient-to-br from-gray-50 to-gray-100 p-2 shadow ring-1 ring-black/10 dark:bg-gray-800 dark:from-gray-700 dark:to-gray-700 dark:shadow-2xl"
								>
									<AnnotationItem
										text={target.selector?.exact}
										href="/{article?.id}?a={annotation.id}"
									/>
								</li>
							</div>
						{/each}
					</ul>
				</li>
			{/each}
		</ul>
	</KeyboardNav>
{:else}
	<div class="grid h-full place-items-center">
		<div class="flex max-w-lg space-x-4">
			<div>
				<Icon name="bookmarkAlt" className="h-6 w-6 relative top-px stroke-2 stroke-gray-600" />
			</div>
			<div class="flex flex-col space-y-4">
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
