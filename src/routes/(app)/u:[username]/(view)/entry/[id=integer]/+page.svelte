<script lang="ts">
	import type { PageData } from './$types';
	import { slide } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { fade } from 'svelte/transition';
	import debounce from 'lodash.debounce';
	import { onDestroy, onMount } from 'svelte';
	import dayjs from 'dayjs';
	import localizedFormat from 'dayjs/plugin/localizedFormat.js';
	import Highlighter from './Highlighter.svelte';
	import { archive } from '$lib/utils';
	import { navigating, page } from '$app/stores';
	import HighlightMenu from '$lib/components/HighlightMenu.svelte';
	import ReadingMenu from '$lib/components/ReadingMenu.svelte';
	import TagInputCombobox from '$lib/components/TagInputCombobox.svelte';
	import useArticleCommands from './_commands';
	import { recents } from '$lib/stores/recents';
	import H1 from '$lib/components/atoms/H1.svelte';
	import { mainEl, mainElScroll } from '$lib/stores/main';
	import articleHeader from '$lib/stores/currentArticle/articleHeader';
	import { hideSidebar } from '$lib/stores/sidebar';
	import { getArticleUrl } from './utils';
	import { afterNavigate } from '$app/navigation';
	import selection from '$lib/stores/selection';
	import { createPopperActions } from 'svelte-popperjs';
	import { writable } from 'svelte/store';
	import type { EntryInteraction } from '@prisma/client';
	dayjs.extend(localizedFormat);
	export let data: PageData;
	$: article = data.article;
	$: bookmark = article.annotations.find((a) => a.type === 'bookmark');
	$: console.log({ data });
	$: last_scroll_position = (article?.readProgress as number) || 0;
	$: removeCommands = useArticleCommands(article, $page.data.user);

	$: currentList = data.currentList;
	let disableSaveScroll = false;

	let context;
	afterNavigate(({ from }) => {
		console.log({ from });
	});
	afterNavigate(() => {
		console.log(`after navigation`, $mainEl);
		setTimeout(() => {
			$mainEl.scrollTo(0, 0);
			$mainEl.focus();
		}, 0);
	});

	let last_saved_progress = 0;
	afterNavigate(async () => {
		console.log(`mounting / afternavigate`);
		// this is a hack-y way to get the slug to be nice
		// history.replaceState(null, '', getArticleUrl($page.params.username, article.id, article.slug));
		// recents.addRecentArticle(article);
		if (!browser) return;
		console.log($mainEl);
		// mark as read
		// optimistic
		const ogInteraction = data.interaction || {};
		if (!data.interaction?.is_read) {
			data.interaction = { ...ogInteraction, is_read: true } as EntryInteraction;
			const res = await fetch(`/api/interactions`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					is_read: true,
					entryId: article.id,
				}),
			});
			console.log({ res });
			if (!res.ok) {
				// roll back
				data.interaction = ogInteraction;
			}
		}
		if ($page.data.user?.username === $page.params.username) {
			console.log(`setting progress to ${data.interaction?.progress}`, $mainEl);
			const pos = (data.interaction?.progress || 0) * ($mainEl.scrollHeight - window.innerHeight);
			last_saved_progress = data.interaction?.progress || 0;
			setTimeout(() => {
				$mainEl.scrollTo(0, pos);
			}, 10);
		}
	});
	const saveProgress = async (data: number) => {
		if ($navigating) return;
		if (disableSaveScroll) return;
		if (!data && data !== 0) return;
		if (Math.abs(last_saved_progress - data) < 0.005) return;
		last_saved_progress = data;
		await fetch(`/api/interactions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				progress: data,
				entryId: article.id,
			}),
		});
	};
	const debouncedSave = debounce(saveProgress, 2000, {
		leading: false,
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

	const [popperRef, popperContent] = createPopperActions({
		strategy: 'fixed',
	});

	let x = 0;
	let y = 0;
	const mousemove = (ev: MouseEvent) => {
		x = ev.clientX;
		y = ev.clientY;
	};

	$: getBoundingClientRect = () => ({
		width: 0,
		height: 0,
		top: y,
		bottom: y,
		left: x,
		right: x,
	});
	const virtualElement = writable({ getBoundingClientRect });
	$: $virtualElement = { getBoundingClientRect };
	popperRef(virtualElement);
</script>

<!-- TODO: implement layout select -->
<!-- <div class="options">
	<LayoutSelect />
</div> --><svelte:window on:mousemove={mousemove} />
<!-- <div use:popperContent>Tooltip</div> -->

{#if data.AUTHORIZED}
	<!-- {JSON.stringify($currentList)} -->
	<ReadingMenu
		bind:entry={article}
		back={$currentList ? $currentList.slug : '/'}
		currentList={$currentList}
	/>
{:else}
	unauhtorized
{/if}

<svelte:head>
	<title>{article.title}</title>
</svelte:head>

{@html `<` + `style>${data.stylesheet?.css}</style>`}

<div
	on:dblclick|preventDefault|stopPropagation={(e) => {
		console.log(e);
		// todo: use x and y to create annotation, attach to nearest node
	}}
	data-content-container
	class=""
>
	Read: {data.interaction?.is_read}
	<article class="mx-auto max-w-3xl py-8 px-4">
		<header class="space-y-3 pb-4" bind:this={$articleHeader}>
			<a
				class="flex items-center space-x-2 text-sm text-gray-500 hover:text-primary-700 lg:text-base"
				href={article.uri}
			>
				<img
					src="https://icon.horse/icon/?uri={article.uri}"
					class="h-5 w-5 rounded-full object-cover"
					alt=""
				/>
				<span class="truncate">{article.siteName || article.url || article.uri}</span></a
			>
			<H1 class="font-newsreader dark:drop-shadow-sm">{article.title}</H1>

			<!-- TODO: DEK/Description goes here — but only if it's an actual one, not a shitty one. So how do we determine that? -->
			{#if article.description}
				<div class="text-lg text-gray-500 dark:text-gray-300 sm:text-xl">
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
			<div class="flex justify-between">
				<div
					id="origin"
					class="flex space-x-3 text-sm text-gray-500 dark:text-gray-300 lg:text-base"
				>
					{#if article.author}
						<p><a href="/author/{article.author}">{article.author}</a></p>
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
			</div>
			{#if !data.authorized}
				<span class="rounded bg-amber-400 px-1 text-white">
					Annotated by <a href="/u:{$page.params.username}">{$page.params.username}</a>
				</span>
			{/if}
			{#if data.authorized}
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
			{/if}
		</header>
		<!-- this is a very rudimentary check lol -->
		<Highlighter
			articleID={article.id}
			articleUrl={article.uri}
			bind:annotations={article.annotations}
		>
			{#if article.image && !article.html?.includes(article.image)}
				<img src={article.image} alt="" class="mx-auto rounded py-2" />
			{/if}
			{@html article.html || article.text || article.summary}
		</Highlighter>
		{#if $mainElScroll.offset > 0.97 && article.location !== 'ARCHIVE' && data.authorized}
			<div class="fixed bottom-8 right-8" transition:fade>
				<button on:click={() => archive([article.id], '/')}>Archive article</button>
			</div>
		{/if}
		<noscript>
			<HighlightMenu noHighlight={true} articleId={article.id} />
		</noscript>
	</article>
</div>
