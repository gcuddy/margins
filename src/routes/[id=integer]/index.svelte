<script lang="ts">
	// import '$lib/stylesheets/reading.css';
	import { slide } from 'svelte/transition';
	import { browser } from '$app/env';
	import { fade } from 'svelte/transition';
	import debounce from 'lodash.debounce';
	import { onDestroy, onMount } from 'svelte';
	import scrollY from '$lib/stores/scrollY';
	import dayjs from 'dayjs';
	import localizedFormat from 'dayjs/plugin/localizedFormat.js';
	import Highlighter from './_Highlighter.svelte';
	import type { ArticleWithNotesAndTagsAndContext } from '$lib/types';
	import { archive, bulkEditArticles, patch, post } from '$lib/utils';
	import { navigating } from '$app/stores';
	import HighlightMenu from '$lib/components/HighlightMenu.svelte';
	import ReadingMenu from '$lib/components/ReadingMenu.svelte';
	import TagInputCombobox from '$lib/components/TagInputCombobox.svelte';
	import useArticleCommands from './_commands';
	import { recents } from '$lib/stores/recents';
	import H1 from '$lib/components/atoms/H1.svelte';
	import { mainEl, mainElScroll } from '$lib/stores/main';
	dayjs.extend(localizedFormat);

	export let article: ArticleWithNotesAndTagsAndContext;

	let last_scroll_position = article.readProgress;

	let disableSaveScroll = false;

	const removeCommands = useArticleCommands(article);

	onMount(async () => {
		recents.addRecentArticle(article);
		if (!browser) return;
		console.log({ readProgress: article.readProgress });
		const pos = article.readProgress * ($mainEl.scrollHeight - window.innerHeight);
		console.log({ pos });
		console.log(`scrolling to ${pos}`);
		setTimeout(() => {
			$mainEl.scrollTo(0, pos);
		}, 0);
		// add commands
	});

	const saveProgress = async (data: number) => {
		if ($navigating) return;
		if (disableSaveScroll) return;
		console.log(`saving progress: ${data}`);
		await fetch(`/api/update/${article.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body:
				(data || data === 0) &&
				JSON.stringify({
					readProgress: data
				})
		});
		console.log('saved progresss', data);
	};
	const debouncedSave = debounce(saveProgress, 500, {
		leading: true,
		trailing: true
	});
	const unsubscribeScrollY = mainElScroll.subscribe(({ offset }) => {
		console.log({ offset });
		if (browser) {
			// only save if the scroll position has changed by more than .05
			if (Math.abs(last_scroll_position - offset) > 0.05) {
				last_scroll_position = offset;
				console.log('saving');
				debouncedSave(offset);
			}
		}
	});
	console.log({ article });
	onDestroy(() => {
		unsubscribeScrollY && unsubscribeScrollY();
		removeCommands();
		// $commandStore = $commandStore.filter((c) => !articleCommands.some((a) => a.id === c.id));
	});

	let contentWrapper: HTMLElement;
</script>

<!-- TODO: implement layout select -->
<!-- <div class="options">
	<LayoutSelect />
</div> -->

<ReadingMenu {article} />

<svelte:head>
	<title>{article.title}</title>
</svelte:head>

<main>
	<div bind:this={contentWrapper} class="">
		<article class="mx-auto max-w-3xl py-8 px-4">
			<header class="space-y-3 pb-4">
				<div class="text-sm lg:text-base">
					<a class="text-gray-400" href={article.url}
						>{article.siteName || new URL(article.url)?.hostname || article.url}</a
					>
				</div>
				<H1>{article.title}</H1>
				<!-- <TagCloud tags={article.tags} /> -->
				{#if article.context}
					<!-- Via: <a href="/{article.context.articleId}">{article.context.Article.title}</a> -->
					<!-- <pre>{JSON.stringify(article.context, null, 2)}</pre> -->
				{/if}
				<!-- {#if article.dek}

                {/if} -->
				<!-- <p>
					<a class="text-gray-300" href={article.url}
						>{article.siteName || new URL(article.url)?.hostname || article.url}</a
					>
				</p> -->
				<div
					id="origin"
					class="flex space-x-3 text-sm text-gray-500 dark:text-gray-300 lg:text-base"
				>
					{#if article.author}
						<p>{article.author}</p>
					{/if}
					{#if article.author && article.date}
						<!-- <p>&middot;</p> -->
					{/if}
					{#if article.date}
						<p>{dayjs(article.date).format('LL')}</p>
					{/if}
					{#if article.wordCount}
						<span>{article.wordCount} words</span>
					{/if}
				</div>
				{#if article.tags.length}
					<div transition:slide|local>
						<TagInputCombobox
							articles={[article]}
							className="hover:ring-1 rounded-sm ring-gray-300 focus-within:bg-gray-100
          dark:ring-gray-700 dark:focus-within:bg-gray-700 focus-within:!ring-0 transition
            "
							invalidate={`/${article.id}`}
						/>
					</div>
				{/if}
			</header>
			<Highlighter
				articleID={article.id}
				articleUrl={article.url}
				annotations={article.annotations}
				highlights={article.highlights}
			>
				{@html article.content}
			</Highlighter>
			{#if $mainElScroll.offset > 0.97 && article.location !== 'ARCHIVE'}
				<div class="fixed bottom-8 right-8" transition:fade>
					<button on:click={() => archive([article.id], '/')}>Archive article</button>
				</div>
			{/if}
			<noscript>
				<HighlightMenu noHighlight={true} articleId={article.id} />
			</noscript>
		</article>
	</div>
</main>
