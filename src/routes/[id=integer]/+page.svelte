<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	$: article = data.article;
	$: console.log({ data });
	import { slide } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { fade } from 'svelte/transition';
	import debounce from 'lodash.debounce';
	import { onDestroy, onMount } from 'svelte';
	import dayjs from 'dayjs';
	import localizedFormat from 'dayjs/plugin/localizedFormat.js';
	import Highlighter from './Highlighter.svelte';
	import { archive } from '$lib/utils';
	import { navigating } from '$app/stores';
	import HighlightMenu from '$lib/components/HighlightMenu.svelte';
	import ReadingMenu from '$lib/components/ReadingMenu.svelte';
	import TagInputCombobox from '$lib/components/TagInputCombobox.svelte';
	import useArticleCommands from './_commands';
	import { recents } from '$lib/stores/recents';
	import H1 from '$lib/components/atoms/H1.svelte';
	import { mainEl, mainElScroll } from '$lib/stores/main';
	import articleHeader from '$lib/stores/currentArticle/articleHeader';
	import { hideSidebar } from '$lib/stores/sidebar';
	dayjs.extend(localizedFormat);

	$: last_scroll_position = (article?.readProgress as number) || 0;
	$: removeCommands = useArticleCommands(article);

	let disableSaveScroll = false;

	onMount(async () => {
		recents.addRecentArticle(article);
		if (!browser) return;
		const pos = article.readProgress * ($mainEl.scrollHeight - window.innerHeight);
		setTimeout(() => {
			$mainEl.scrollTo(0, pos);
		}, 0);
	});

	const saveProgress = async (data: number) => {
		if ($navigating) return;
		if (disableSaveScroll) return;
		await fetch(`/api/update/${article.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body:
				(data || data === 0) &&
				JSON.stringify({
					readProgress: data,
				}),
		});
	};
	const debouncedSave = debounce(saveProgress, 500, {
		leading: true,
		trailing: true,
	});
	const unsubscribeScrollY = mainElScroll.subscribe(({ offset }) => {
		if (browser) {
			// only save if the scroll position has changed by more than .05
			if (Math.abs(last_scroll_position - offset) > 0.05) {
				last_scroll_position = offset;
				console.log('saving');
				debouncedSave(offset);
			}
		}
	});
	onDestroy(() => {
		unsubscribeScrollY && unsubscribeScrollY();
		removeCommands();
		hideSidebar.set(false);
	});
</script>

<!-- TODO: implement layout select -->
<!-- <div class="options">
	<LayoutSelect />
</div> -->

<ReadingMenu bind:article />

<svelte:head>
	<title>{article.title}</title>
</svelte:head>

<div
	on:dblclick|preventDefault|stopPropagation={(e) => {
		console.log(e);
		// todo: use x and y to create annotation, attach to nearest node
	}}
	class=""
>
	<article class="mx-auto max-w-3xl py-8 px-4">
		<header class="space-y-3 pb-4" bind:this={$articleHeader}>
			<div class="text-sm lg:text-base">
				<a class="text-gray-400" href={article.url}
					>{article.siteName || new URL(article.url)?.hostname || article.url}</a
				>
			</div>
			<H1>{article.title}</H1>

			<!-- TODO: DEK/Description goes here — but only if it's an actual one, not a shitty one. So how do we determine that? -->
			{#if article.description}
				<div class="text-xl font-medium text-gray-500 dark:text-gray-300">
					{article.description}
				</div>
			{/if}

			<!-- <TagCloud tags={article.tags} /> -->
			{#if article.context}
				<!-- TODO: figure this out -->
				<!-- Via: <a href="/{article.context.articleId}">{article.context.Article.title}</a> -->
				<pre>context: {JSON.stringify(article.context.url, null, 2)}</pre>
			{/if}
			<!-- {#if article.dek}

                {/if} -->
			<!-- <p>
					<a class="text-gray-300" href={article.url}
						>{article.siteName || new URL(article.url)?.hostname || article.url}</a
					>
				</p> -->
			<div id="origin" class="flex space-x-3 text-sm text-gray-500 dark:text-gray-300 lg:text-base">
				{#if article.author}
					<p>{article.author}</p>
				{/if}
				{#if article.author && article.date}
					<!-- <p>&middot;</p> -->
				{/if}
				{#if article.date}
					<p>{dayjs(article.date).format('ll')}</p>
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
		<!-- this is a very rudimentary check lol -->
		{#if article.image && !article.content.includes('<img')}
			<img src={article.image} alt="" class="mx-auto rounded py-2" />
		{/if}
		<Highlighter
			articleID={article.id}
			articleUrl={article.url}
			bind:annotations={article.annotations}
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
