<script lang="ts">
	import { browser } from "$app/environment";
	import { afterNavigate, invalidateAll } from "$app/navigation";
	import { navigating, page } from "$app/stores";
	import type { ExtendedBookmark } from "$lib/bookmark";
	import H1 from "$lib/components/atoms/H1.svelte";
	import { commandPaletteStore } from "$lib/components/CommandPalette/store";
	import type { Command } from "$lib/components/CommandPalette/types";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import HighlightMenu from "$lib/components/HighlightMenu.svelte";
	import TagInputCombobox from "$lib/components/TagInputCombobox.svelte";
	import Youtube from "$lib/components/Youtube.svelte";
	import { entryData } from "$lib/entry";
	import BookEntry from "$lib/features/books/BookEntry.svelte";
	import AudioEntry from "$lib/features/entries/AudioEntry.svelte";
	import BookmarkEntry from "$lib/features/entries/bookmarks/BookmarkEntry.svelte";
	import { containerRefContextKey } from "$lib/features/entries/context";
	import ImageEntry from "$lib/features/entries/ImageEntry.svelte";
	import { entryDetailsQuery, showEntrySelector } from "$lib/features/entries/queries";
	import TweetEntry from "$lib/features/entries/TweetEntry.svelte";
	import VideoEntry from "$lib/features/entries/VideoEntry.svelte";
	import MovieEntry from "$lib/features/movies/MovieEntry.svelte";
	import Episode from "$lib/features/podcasts/Episode.svelte";
	import RecipeEntry from "$lib/features/recipes/RecipeEntry.svelte";
	import { useCommands } from "$lib/hooks/use-commands";
	import articleHeader from "$lib/stores/currentArticle/articleHeader";
	import { mainEl, mainElScroll } from "$lib/stores/main";
	import { modals } from "$lib/stores/modals";
	import { notifications } from "$lib/stores/notifications";
	import { syncStore } from "$lib/stores/sync";
	import { trpc } from "$lib/trpc/client";
	import { LOCATION_TO_ICON_SOLID } from "$lib/types/schemas/Locations";
	import { Annotation, DocumentType, Tag } from "@prisma/client";
	import { createQuery, useQueryClient } from "@tanstack/svelte-query";
	import { isFunction } from "@tiptap/core";
	import { TRPCClientError } from "@trpc/client";
	import dayjs from "dayjs";
	import localizedFormat from "dayjs/plugin/localizedFormat.js";
	import debounce from "lodash.debounce";
	import { getContext, onDestroy, setContext } from "svelte";
	import { createPopperActions } from "svelte-popperjs";
	import { Readable, writable } from "svelte/store";
	import { slide } from "svelte/transition";
	import type { YouTubePlayer } from "youtube-player/dist/types";
	import type { PageData } from "./$types";
	import Booster from "./Booster.svelte";
	import Highlighter from "./Highlighter.svelte";
	import ReadingMenu from "./ReadingMenu.svelte";
	import ReadingSidebar from "./ReadingSidebar.svelte";
	import type { Metadata } from "./types";

	dayjs.extend(localizedFormat);
	export let data: PageData;
	const queryClient = useQueryClient();
	$: article = data.article;
	// let article: RouterOutputs["entries"]["load"];
	$: query = createQuery({
		...entryDetailsQuery({
			id: data.id,
		}),
		onSettled: (data, error) => {
			console.log(`entrydetails`, { data, error });
		},
		onSuccess: (entry) => {
			console.log({ entry });
			// REVIEW: is this bad - probaly!
			data.article = entry;
		},
	});

	$: stylesheet = data.user?.stylesheets?.find((s) => article?.uri?.includes(s.domain));
	let entry: Metadata;
	let annotations: Annotation[] = [];
	let interaction: {
		is_read: boolean | null;
		progress: number | null;
	} | null = null;
	let tags: Tag[] = data.article?.tags;
	let bookmark: ExtendedBookmark | null = null;

	// TODO: fix this whole mess
	$: if ("entryId" in data?.article) {
		// bookmark
		// TOOD: zod parsing
		console.log({ data });
		if (typeof data.article.data === "object") {
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
	let errors: { message: string; path: string[] }[] | null = null;

	$: nlpQuery = createQuery({
		queryKey: ["nlp", { id: data.id }],
		queryFn: () =>
			trpc($page).nlp.query({
				entryId: data.id,
			}),
		onSuccess: (nlp) => {
			console.log({ nlp });
		},
	});
	$: console.log({ $nlpQuery });
	function useArticleCommands() {
		const articleCommands: Command[] = [
			{
				id: "archive-article",
				group: "article",
				name: "Archive Article",
				icon: "archive",
				check: () => !!bookmark && bookmark?.state?.type !== "archive",
				perform: async () => {
					// // TODO: optimistically update UI
					// // find archive location
					// const stateId = [...user.states]
					// 	.sort((a, b) => a.position - b.position)
					// 	.find((state) => state.type === 'archive')?.id;
					// if (!stateId) {
					// 	// TODO: what to do here? we shouldn't ever be here right? we should create the default archive state
					// 	console.error('No state for archiving!');
					// 	return;
					// }
					// const res = await fetch(`/api/annotations/${(bookmark as Annotation).id}`, {
					// 	method: 'PATCH',
					// 	body: JSON.stringify({
					// 		stateId,
					// 	}),
					// });
					// if (res.ok) {
					// 	notifications.notify({
					// 		title: 'Archived article',
					// 		type: 'success',
					// 	});
					// 	const bookmark = await res.json();
					// 	console.log({ bookmark });
					// }
					// // archive([entry.id], '/');
				},
				kbd: [
					["ctrl", "shift", "a"],
					["cmd", "Backspace"],
				],
			},
			{
				id: "delete-article",
				group: "article",
				name: "Delete Article",
				icon: "trash",
				perform: async () => {
					// await post('/api/archive_article', {
					// 	id: entry.id,
					// 	trash: true,
					// });
					// await invalidate('/');
					// goto('/').then(() => {
					// 	notifications.notify({
					// 		type: 'success',
					// 		message: 'Article deleted',
					// 	});
					// });
				},
			},
			{
				id: "change-status",
				group: "article",
				name: "Change Status",
				icon: "inboxIn",
				perform: async () => {
					commandPaletteStore.open({
						values: $page.data.user?.states,
						itemIcon: (val, active) => {
							return {
								component: Icon,
								props: {
									name: LOCATION_TO_ICON_SOLID[val.type],
								},
							};
						},
						onSelect: async (e) => {
							try {
								console.log({
									id: article.id,
									stateId: e.detail.id as number,
								});
								const syncId = syncStore.add();
								await trpc().bookmarks.updateState.mutate({
									id: article.bookmark?.id,
									stateId: e.detail.id,
									entryId: article.id,
								});
								await invalidateAll();
								syncStore.remove(syncId);
								// 	.then(() => {
								// 		notifications.notify({
								// 			type: 'info',
								// 			title: 'Updated status',
								// 		});
								// 	});
							} catch (err) {
								if (err instanceof TRPCClientError) {
									errors = JSON.parse(err.message);
								} else {
									throw err;
								}
							}
						},
					});
				},
			},
			{
				id: "tag-article",
				group: "article",
				name: "Tag Article",
				icon: "tag",
				perform: async () => {
					modals.open(TagInputCombobox, {
						entryId: entry.id,
						original: article,
						tags: article.tags,
					});
				},
			},
			{
				id: "re-download-article",
				group: "article",
				name: "Re-download Article",
				perform: async () => {
					const syncId = syncStore.addItem();
					const id = notifications.notify({
						title: "Re-downloading article",
						message: "This shouldn't take long",
						timeout: 3000,
					});
					const form = new FormData();
					form.set("text", entry.url);
					const res = await fetch("/add", {
						method: "POST",
						body: form,
						headers: {
							accept: "application/json",
						},
					});
					{
						//done
						syncStore.removeItem(syncId);
						notifications.notify({
							title: "Successfully re-downloaded article",
							message: "Article has been re-downloaded. Refresh the page to see it.",
							type: "success",
						});
					}
					const _article = await res.json();
					console.log({ _article });
					// todo: use zod here
					await invalidate(`/${entry.id}`);
				},
				icon: "download",
			},
			{
				id: "add-note",
				group: "article",
				name: "Add note",
				perform: () => goto(`/${entry.id}/annotations/new`),
				icon: "annotation",
			},
			{
				id: "add-to-collection",
				group: "article",
				name: "Add to Collection",
				perform: async () => {
					// REVIEW: should we use createQuery here? Or just call trpc directly?
					// I think we want to use query so we can do swr
					// const query = createQuery({
					// 	queryKey: ['collections'],

					// })
					const collections = await trpc($page).collections.list.query();

					const values = [...collections];
					commandPaletteStore.open({
						values: collections,
						// itemIcon: (val, active) => {
						// 	return {
						// 		component: Icon,
						// 		props: {
						// 			name: LOCATION_TO_ICON_SOLID[val.type],
						// 		},
						// 	};
						// },
						onSelect: async ({ detail }) => {
							if (detail.id === "create-new" && (detail as unknown as any).value) {
								// create new
								const collection = await trpc($page).collections.create.mutate({
									name: detail.value,
									entryIds: [entry.id],
								});
								console.log({ collection });
							} else {
								const collection = await trpc($page).collections.addItem.mutate({
									id: detail.id,
									entryId: entry.id,
								});
								notifications.notify({
									title: `Added entry to ${collection.name}`,
									type: "success",
									message: `<a href="/u:${$page.data.user?.username}/collection/${collection.id}">View ${collection.name}</a>`,
									icon: collection.icon,
								});
							}
						},
						fallback: (input) => ({
							title: `Create new collection: <span class="text-gray-500 dark:text-gray-400">"${input}"</span>`,
							id: `create-new`,
							icon: "plusSm",
							value: input,
						}),
					});
				},
				icon: "squaresPlus",
			},
			{
				id: "add-relation",
				group: "article",
				name: "Add relation",
				icon: "arrowRightLeft",
				perform: async () => {
					// open entry selector, then add relation
					showEntrySelector(queryClient, async ({ detail: entry }) => {
						// add relation
						await trpc($page).entries.createRelation.mutate({
							entryId: article.id,
							relatedEntryId: entry.id,
						});
						await invalidateAll();
					});
				},
			},
		];
		return useCommands(articleCommands);
	}

	$: removeCommands = useArticleCommands();

	// TODO: elements we need to make this a proper "reading": Title, Author, Sumamary, content (data), annotations, the interaction... what else?

	$: currentList = data.currentList;
	// ??
	$: console.log({ $currentList });
	// todo: should current list be "source of truth"?

	let disableSaveScroll = false;

	let context;

	let last_saved_progress = 0;
	afterNavigate(() => {
		if ($mainEl) {
			console.log({ $mainEl });
			setTimeout(() => {
				$mainEl?.focus();
				console.log(document.activeElement);
			}, 100);
			if ($page.data.user?.username === $page.params.username) {
				const pos = (interaction?.progress || 0) * ($mainEl.scrollHeight - window.innerHeight);
				last_saved_progress = interaction?.progress || 0;
				setTimeout(() => {
					$mainEl.scrollTo(0, pos);
				}, 10);
			}
		}
	});
	// afterNavigate(async (e) => {
	// 	console.log(`mounting / afternavigate`, e);
	// 	setTimeout(() => {
	// 		// $mainEl.scrollTo(0, 0);
	// 		$mainEl.focus();
	// 	}, 0);
	// 	if (!browser) return;
	// 	console.log($mainEl);
	// 	// mark as read
	// 	// optimistic
	// 	const ogInteraction = interaction || {};
	// 	if (data.article.unread) {
	// 		data.article.unread = false;
	// 		data.interaction = { ...ogInteraction, is_read: true };
	// 		console.log({ data });
	// 		const updatedEntry = await trpc($page).entries.markAsRead.mutate({
	// 			id: data.article.id,
	// 		});
	// 		console.log({ updatedEntry });
	// 		// const res = await fetch(`/api/interactions`, {
	// 		// 	method: 'POST',
	// 		// 	headers: {
	// 		// 		'Content-Type': 'application/json',
	// 		// 	},
	// 		// 	body: JSON.stringify({
	// 		// 		is_read: true,
	// 		// 		uri: data.article.uri,
	// 		// 	}),
	// 		// });
	// 		// console.log({ res });
	// 		// if (!res.ok) {
	// 		// 	// roll back
	// 		// 	data.interaction = ogInteraction;
	// 		// }
	// 	}
	// if ($page.data.user?.username === $page.params.username) {
	// 	const pos = (interaction?.progress || 0) * ($mainEl.scrollHeight - window.innerHeight);
	// 	last_saved_progress = interaction?.progress || 0;
	// 	setTimeout(() => {
	// 		$mainEl.scrollTo(0, pos);
	// 	}, 10);
	// }
	// });
	const saveProgress = async (data: number) => {
		if ($navigating) return;
		if (disableSaveScroll) return;
		if (!data && data !== 0) return;
		if (Math.abs(last_saved_progress - data) < 0.005) return;
		last_saved_progress = data;
		await trpc($page).entries.updateInteraction.mutate({
			id: article.id,
			progress: data,
		});
		// await fetch(`/api/interactions`, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// 	body: JSON.stringify({
		// 		progress: data,
		// 		entryId: article.id,
		// 	}),
		// });
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
				console.log("saving");
				debouncedSave(offset);
			}
		}
	});
	onDestroy(() => {
		console.time("DESTROYING");
		unsubscribeScrollY && unsubscribeScrollY();
		removeCommands();
		console.timeEnd("DESTROYING");
	});

	const [popperRef, popperContent] = createPopperActions({
		strategy: "fixed",
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

	// const containerRef = writable<HTMLElement | null>(null);
	setContext(containerRefContextKey, mainEl);

    let player: YouTubePlayer | undefined = undefined;
    $: console.log({player})
</script>

<!-- TODO: implement layout select -->
<!-- <div class="options">
	<LayoutSelect />
</div> -->

<svelte:window
	on:mousemove={mousemove}
	on:keydown={(e) => {
		// cmd+c
		if (e.key === "c" && e.metaKey && article.uri) {
			// copy to clipboard and notify
			navigator.clipboard.writeText(article.uri).then(() =>
				notifications.notify({
					type: "info",
					title: "Copied to clipbboard",
				})
			);
		}
	}}
/>
<!-- <div use:popperContent>Tooltip</div> -->

<!-- {JSON.stringify($currentList)} -->
<ReadingMenu
	{bookmark}
	bind:entry={data.article}
	{interaction}
	back={$currentList ? $currentList.slug : "/"}
	currentList={$currentList}
/>

<svelte:head>
	<title>{entry.title}</title>
</svelte:head>

{@html `<` + `style>${data?.css}</style>`}
{#if errors?.length}
	{#each errors as error}
		<small class="text-red-500">{error.message}</small>
	{/each}
{/if}
<div class="flex grow flex-col overflow-hidden bg-skin-entry-bg">
	<div
		on:dblclick|preventDefault|stopPropagation={(e) => {
			console.log(e);
			// todo: use x and y to create annotation, attach to nearest node
		}}
		data-content-container
		class="relative flex h-full grow items-stretch overflow-hidden"
	>
		<div
			class="simple-scrollbar article-container relative flex grow flex-col items-stretch overflow-auto focus-visible:outline-none"
			bind:this={$mainEl}
			tabindex="-1"
		>
			<!-- TODO: py-8 px-4 should be set on a per-type basis -->
			<article data-article class=" mt-14 h-full  px-1 sm:p-4">
				{#if article.type === "article" || article.type === DocumentType.rss || (article.type === DocumentType.audio && !article.podcastIndexId)}
					<div class="">
                        <header class="max-w-prose space-y-3 pb-4" bind:this={$articleHeader}>
                            <!-- {article.feedId
                                ? `/u:${$page.data.user?.username}/subscriptions/${article.feedId}`
                                : article.uri} -->
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
                            <div class="flex justify-between">
                                <div id="origin" class="flex space-x-3 text-sm text-gray-500 dark:text-gray-300 lg:text-base">
                                    {#if entry.author}
                                        <p><a href="/author/{entry.author}">{entry.author}</a></p>
                                    {/if}
                                    {#if entry.author && entry.published}
                                        <!-- <p>&middot;</p> -->
                                    {/if}
                                    {#if entry.published}
                                        <p>{dayjs(entry.published).format("ll")}</p>
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
                        {#if article.type === DocumentType.audio}
                            <AudioEntry entry={article} />
                        {/if}
                        <!-- this is a very rudimentary check lol -->
                        <div id="entry-container">
                            <Highlighter articleID={article.id} articleUrl={article.uri} bind:annotations>
                                {@html entry.html || entry.text || entry.summary || "[No content]"}
                            </Highlighter>
                        </div>
                        <noscript>
                            <HighlightMenu noHighlight={true} articleId={article.id} />
                        </noscript>
                    </div>
				{:else if article.type === DocumentType.book}
					<BookEntry entry={article} bookId={article?.googleBooksId} />
				{:else if article.type === DocumentType.bookmark}
					<BookmarkEntry entry={article} />
				{:else if article.type === DocumentType.image}
					{#if article.image}
						<ImageEntry image={article.image} />
					{/if}
				{:else if article.type === "movie"}
					<MovieEntry id={data.article.tmdbId} />
				{:else if article.type === DocumentType.audio && article.podcastIndexId}
					<!-- decide if podcast or not podcast -->
					{#if article.podcastIndexId}
						<Episode episodeId={article.podcastIndexId} />
					{:else}
						<AudioEntry entry={article} />
					{/if}
				{:else if article.type === "tweet"}
					<!-- {JSON.stringify(article)} -->

					<TweetEntry tweet={article.original} />
				{:else if article.type === DocumentType.recipe && article.recipe}
					<!-- TODO: display html or recipe -->
					<RecipeEntry recipe={article.recipe} />
				{:else if article.type === DocumentType.video && article.youtubeId}
					<VideoEntry bind:player entry={article} />
					<!-- <Youtube videoId={article.youtubeId} /> -->
					<!-- {@html article.html} -->
				{/if}
			</article>
		</div>
		<!-- Reading Sidebar -->
		{#if $query.isSuccess}
			<ReadingSidebar on:seek={async ({detail}) => {
                console.log({detail})
                console.log({player})
                await player?.seekTo(detail, true)
            }} entry={$query.data} />
		{/if}
		{#if data.css}
			<Booster bind:css={data.css} />
		{/if}
	</div>
</div>

<style lang="postcss">
	.article-container {
		scrollbar-gutter: auto;
	}
</style>
