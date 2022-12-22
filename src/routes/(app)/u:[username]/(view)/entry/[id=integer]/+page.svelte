<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { navigating, page } from '$app/stores';
	import type { ExtendedBookmark } from '$lib/bookmark';
	import H1 from '$lib/components/atoms/H1.svelte';
	import HighlightMenu from '$lib/components/HighlightMenu.svelte';
	import TagInputCombobox from '$lib/components/TagInputCombobox.svelte';
	import { entryData } from '$lib/entry';
	import articleHeader from '$lib/stores/currentArticle/articleHeader';
	import { mainEl, mainElScroll } from '$lib/stores/main';
	import { hideSidebar } from '$lib/stores/sidebar';
	import { archive } from '$lib/utils';
	import type { Annotation, Tag } from '@prisma/client';
	import dayjs from 'dayjs';
	import localizedFormat from 'dayjs/plugin/localizedFormat.js';
	import debounce from 'lodash.debounce';
	import { onDestroy } from 'svelte';
	import { createPopperActions } from 'svelte-popperjs';
	import { writable } from 'svelte/store';
	import { fade, slide } from 'svelte/transition';
	import type { PageData } from './$types';
	import Highlighter from './Highlighter.svelte';
	import ReadingMenu from './ReadingMenu.svelte';
	import type { Metadata } from './types';
	import useArticleCommands from './_commands';
	dayjs.extend(localizedFormat);
	export let data: PageData;
	$: console.log(`data for ${$page.params.id}`, { data });
	console.log(`data for page.svelte`, { data });
	$: article = data.article;
	let entry: Metadata;
	let annotations: Annotation[] = [];
	let interaction: {
		is_read: boolean | null;
		progress: number | null;
	} | null = null;
	let tags: Tag[] = data.article.tags;
	let bookmark: ExtendedBookmark | null = null;
	if ('entryId' in data.article) {
		// bookmark
		// TOOD: zod parsing
		console.log({ data });
		if (typeof data.article.data === 'object') {
			entry = {
				...entryData.parse(data.article.data),
				id: data.article.entryId,
				uri: data.article.uri,
			};
			annotations = data.article.annotations;
			interaction = data.article.interaction;
			bookmark = data.article;
		}
	} else {
		entry = data.article;
		annotations = data.article.annotations;
		interaction = data.article.interaction;
		bookmark = data.article.bookmark;
		// TODO: annotations, etc
	}
	$: last_scroll_position = (interaction?.progress as number) || 0;
	$: removeCommands = useArticleCommands(article, $page.data.user);

	// TODO: elements we need to make this a proper "reading": Title, Author, Sumamary, content (data), annotations, the interaction... what else?

	$: currentList = data.currentList;
	// ??
	$: current_list_article = $currentList?.items?.find((i) => i.id === article.id);
	$: console.log({ $currentList, current_list_article });
	// todo: should current list be "source of truth"?

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
		const ogInteraction = interaction || {};
		if (!interaction?.is_read) {
			data.interaction = { ...ogInteraction, is_read: true };
			const res = await fetch(`/api/interactions`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					is_read: true,
					uri: data.article.uri,
				}),
			});
			console.log({ res });
			if (!res.ok) {
				// roll back
				data.interaction = ogInteraction;
			}
		}
		if ($page.data.user?.username === $page.params.username) {
			const pos = (interaction?.progress || 0) * ($mainEl.scrollHeight - window.innerHeight);
			last_saved_progress = interaction?.progress || 0;
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

	/** Tags */
	let tagFormRef: HTMLFormElement;
</script>

<!-- TODO: implement layout select -->
<!-- <div class="options">
	<LayoutSelect />
</div> --><svelte:window on:mousemove={mousemove} />
<!-- <div use:popperContent>Tooltip</div> -->

<!-- {JSON.stringify($currentList)} -->
<ReadingMenu
	{bookmark}
	bind:entry={data.article}
	{interaction}
	back={$currentList ? $currentList.slug : '/'}
	currentList={$currentList}
/>

<svelte:head>
	<title>{entry.title}</title>
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
	<article class="mx-auto max-w-3xl py-8 px-4">
		{JSON.stringify(data, null, 2)}
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
				<span class="truncate">{entry.siteName || entry.uri}</span></a
			>
			<H1 class="font-newsreader dark:drop-shadow-sm">{entry.title}</H1>

			<!-- TODO: DEK/Description goes here — but only if it's an actual one, not a shitty one. So how do we determine that? -->
			{#if entry.summary}
				<div class="text-lg text-gray-500 dark:text-gray-300 sm:text-xl">
					{entry.summary}
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
					{#if entry.author}
						<p><a href="/author/{entry.author}">{entry.author}</a></p>
					{/if}
					{#if entry.author && entry.published}
						<!-- <p>&middot;</p> -->
					{/if}
					{#if entry.published}
						<p>{dayjs(entry.published).format('ll')}</p>
					{/if}
					{#if entry.wordCount}
						<span>{entry.wordCount} words</span>
					{/if}
				</div>
			</div>
			{#if !data.authorized}
				<span class="rounded bg-amber-400 px-1 text-white">
					Annotated by <a href="/u:{$page.params.username}">{$page.params.username}</a>
				</span>
			{/if}
			{#if data.authorized && data.article.bookmark && data.article.tags}
				<div transition:slide|local>
					<TagInputCombobox
						original={{ ...data.article }}
						allTags={$page.data.tags}
						tags={data.article.tags.map((tag) => ({
							...tag,
							...$page.data.tags?.find((t) => t.id === tag.id),
						}))}
					/>
				</div>
			{/if}
		</header>
		<!-- this is a very rudimentary check lol -->
		<Highlighter articleID={article.id} articleUrl={article.uri} bind:annotations>
			<!-- {#if article.image && !article.html?.includes(article.image)}
				<img src={article.image} alt="" class="mx-auto rounded py-2" />
			{/if} -->
			{@html entry.html || entry.text || entry.summary}
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
