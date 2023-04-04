<script lang="ts">
	import { browser } from "$app/environment";
	import { afterNavigate, invalidateAll } from "$app/navigation";
	import { navigating, page } from "$app/stores";
	import { H1 } from "$lib/components/ui/typography";
	import { commandPaletteStore } from "$lib/components/CommandPalette/store";
	import type { Command } from "$lib/components/CommandPalette/types";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import HighlightMenu from "$lib/components/HighlightMenu.svelte";
	import { Image } from "@unpic/svelte";
	import TagInputCombobox from "$lib/components/TagInputCombobox.svelte";
	import BookEntry from "$lib/features/books/BookEntry.svelte";
	import AudioEntry from "$lib/features/entries/AudioEntry.svelte";
	import BookmarkEntry from "$lib/features/entries/bookmarks/BookmarkEntry.svelte";
	import { containerRefContextKey } from "$lib/features/entries/context";
	import ImageEntry from "$lib/features/entries/ImageEntry.svelte";
	import { showEntrySelector } from "$lib/features/entries/queries";
	import TweetEntry from "$lib/features/entries/TweetEntry.svelte";
	import VideoEntry from "$lib/features/entries/VideoEntry.svelte";
	import MovieEntry from "$lib/features/movies/MovieEntry.svelte";
	import Episode from "$lib/features/podcasts/Episode.svelte";
	import RecipeEntry from "$lib/features/recipes/RecipeEntry.svelte";
	import { useCommands } from "$lib/hooks/use-commands";
	import type { Location } from "$lib/prisma/kysely/types";
	import articleHeader from "$lib/stores/currentArticle/articleHeader";
	import { mainEl, mainElScroll } from "$lib/stores/main";
	import { modals } from "$lib/stores/modals";
	import { notifications } from "$lib/stores/notifications";
	import { syncStore } from "$lib/stores/sync";
	import { trpc, trpcWithQuery } from "$lib/trpc/client";
	import { LOCATION_TO_ICON_SOLID } from "$lib/types/schemas/Locations";
	import type { Annotation, DocumentType, Tag } from "@prisma/client";
	import { useQueryClient } from "@tanstack/svelte-query";
	import { TRPCClientError } from "@trpc/client";
	import dayjs from "dayjs";
	import localizedFormat from "dayjs/plugin/localizedFormat.js";
	import debounce from "lodash.debounce";
	import { onDestroy, onMount, setContext } from "svelte";
	import { createPopperActions } from "svelte-popperjs";
	import { writable } from "svelte/store";
	import { slide } from "svelte/transition";
	import type { YouTubePlayer } from "youtube-player/dist/types";
	import type { PageData } from "./$types";
	import Booster from "./Booster.svelte";
	import Highlighter from "./Highlighter.svelte";
	import Lead from "$lib/components/ui/typography/Lead.svelte";
	// import ReadingMenu from "./ReadingMenu.svelte";
	// import ReadingSidebar from "./ReadingSidebar.svelte";
	dayjs.extend(localizedFormat);

	export let data: PageData;
	const queryClient = useQueryClient();
	const client = trpcWithQuery($page);
	const utils = client.createContext();

	let location: Location | undefined = undefined;

	$: entryId = data.id;
	$: entryQuery = client.entries.public.byId.createQuery({
		id: data.id,
	});
	$: entryData = client.entries.loadUserData.createQuery(
		{
			id: data.id,
		},
		{
			onSuccess: ({ state_id }) => {
				if (state_id && data.user?.stateIdToLocation) {
					location = data.user?.stateIdToLocation.get(state_id);
				}
				console.log("success@");
			},
		}
	);
	// $: query = data.query();

	// $: stylesheet = data.user?.stylesheets?.find((s) =>
	// 	article?.uri?.includes(s.domain)
	// );
	let annotations: Annotation[] = [];
	let tags = [];
	$: last_scroll_position = $entryData?.data?.progress || 0;

	let articleRef: HTMLElement | undefined = undefined;

	onMount(() => {
		// set up onerrors for imgs to set src to data-canonical-src (if it exists)
		const imgs = articleRef?.querySelectorAll("img");
		if (imgs) {
			imgs.forEach((img) => {
				img.onerror = () => {
					if (img.dataset.canonicalSrc) {
						img.src = img.dataset.canonicalSrc;
					}
				};
			});
		}
	});

	function useArticleCommands() {
		const articleCommands: Command[] = [
			{
				id: "archive-article",
				group: "article",
				name: "Archive Article",
				icon: "archive",
				check: () => location !== "archive",
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
								// set article state directly
								utils.entries.load.setData(
									{
										id: article.id,
									},
									(old) => {
										if (!old) return old;
										return {
											...old,
											bookmark: {
												...old.bookmark,
												state: e.detail,
												stateId: e.detail.id,
											},
										};
									}
								);
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
					if (!entry.uri || !entry.id) return;
					// This is not a good way to do this — updates entry for everyone
					const parsed = await trpc().public.parse.query({ url: entry.uri });
					const updatedEntry = await trpc().entries.update.mutate({
						id: entry.id,
						data: parsed,
					});
					utils.entries.load.invalidate({ id: entry.id });
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
							if (
								detail.id === "create-new" &&
								(detail as unknown as any).value
							) {
								// create new
								const collection = await trpc($page).collections.create.mutate({
									name: detail.value,
									entryIds: [entry.id],
								});
								console.log({ collection });
							} else {
								const collection = await trpc($page).collections.addItem.mutate(
									{
										id: detail.id,
										entryId: entry.id,
									}
								);
								// update...
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

	let disableSaveScroll = false;

	let context;

	let last_saved_progress = 0;
	afterNavigate(() => {
		if ($mainEl) {
			console.log({ $mainEl });
			setTimeout(() => {
				$mainEl?.focus();
				console.log(document.activeElement);
			}, 1);
			// scroll to position if it's an article
			if ($entryQuery.data?.type !== "article") return;
			if ($page.data.user?.username === $page.params.username) {
				console.log({ data }, $mainEl.scrollHeight - window.innerHeight);
				const progress = $entryData.data?.progress || 0;
				if (!progress) return;
				const pos = progress * ($mainEl.scrollHeight - window.innerHeight);
				console.log({ pos });
				last_saved_progress = progress || 0;
				setTimeout(() => {
					$mainEl.scrollTo(0, pos);
				}, 0);
			}
		}
	});
	const saveProgress = async (data: number) => {
		if ($navigating) return;
		if (disableSaveScroll) return;
		if (!data && data !== 0) return;
		if (Math.abs(last_saved_progress - data) < 0.005) return;
		// check to make sure it's an article
		// REVIEW: should we move this logic into a separate component?
		if ($entryQuery.data?.type !== "article") return;
		last_saved_progress = data;
		const article = $entryQuery.data;
		if (!article) return;
		utils.entries.loadUserData.setData(
			{
				id: article.id,
			},
			(old) => {
				if (!old) return;
				return {
					...old,
					progress: data,
				};
			}
		);
		utils.entries.listBookmarks.invalidate();
		// and prolly invalidate most others too, just don't want to refetch everything in entries since i don't want to refetch current pge?
		await trpc($page).entries.updateInteraction.mutate({
			id: article.id,
			progress: data,
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
	$: console.log({ player });
</script>

<!-- TODO: implement layout select -->
<!-- <div class="options">
	<LayoutSelect />
</div> -->

<svelte:window
	on:mousemove={mousemove}
	on:keydown={(e) => {
		// cmd+c
		// if (e.key === "c" && e.metaKey && article.uri) {
		// 	// copy to clipboard and notify
		// 	navigator.clipboard.writeText(article.uri).then(() =>
		// 		notifications.notify({
		// 			type: "info",
		// 			title: "Copied to clipbboard",
		// 		})
		// 	);
		// }
	}}
/>
<!-- <div use:popperContent>Tooltip</div> -->

<!-- {JSON.stringify($currentList)} -->
<svelte:head>
	<!-- <title>{entry.title}</title> -->
</svelte:head>
{#if $entryQuery.isSuccess}
	{@const article = $entryQuery.data}
	<!-- <ReadingMenu
		bookmark={$entryData.isSuccess && $entryData.data?.bookmark_id
			? { id: $entryData.data?.bookmark_id }
			: undefined}
		entry={$entryQuery.data}
	/> -->
	<!--  -->
	<!-- {@html `<` + `style>${data?.css}</style>`} -->
	<!-- {#if errors?.length}
		{#each errors as error}
			<small class="text-red-500">{error.message}</small>
		{/each}
	{/if} -->
	<div class="flex grow flex-col overflow-hidden">
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
				tabindex="-1"
			>
				<!-- TODO: py-8 px-4 should be set on a per-type basis -->
				<article
					bind:this={articleRef}
					data-article
					class=" prose prose-stone mx-auto h-full select-text px-1 dark:prose-invert sm:p-4"
				>
					{#if article.type === "article" || article.type === "rss" || (article.type === "audio" && !article.podcastIndexId)}
						<div class="pb-16">
							<header class="space-y-3 pb-4" bind:this={$articleHeader}>
								<!-- {article.feedId
                                ? `/u:${$page.data.user?.username}/subscriptions/${article.feedId}`
                                : article.uri} -->
								{#if article.uri?.startsWith("http")}
									{@const domain = new URL(article.uri).hostname.replace(
										"www.",
										""
									)}
									<a
										class="flex items-center space-x-2 text-sm text-gray-500 hover:text-primary-700 lg:text-base"
										href={article.uri}
									>
										<!-- <img
											src="https://icon.horse/icon/{domain}"
											class="h-5 w-5 rounded-full object-cover"
											alt=""
										/> -->
										<Image
											class="h-5 w-5 rounded-full border object-cover"
											alt="Favicon for {domain}"
											width={20}
											height={20}
											layout="constrianed"
											src="https://www.google.com/s2/favicons?domain={domain}&sz=32"
										/>

										<span class="truncate">{new URL(article.uri).hostname}</span
										>
									</a>
								{/if}
								<H1 class="">{article.title}</H1>
								<!-- TODO: DEK/Description goes here — but only if it's an actual one, not a shitty one. So how do we determine that? -->
								{#if article.summary}
									<Lead>{article.summary}</Lead>
									<!-- <div
										class="text-lg text-gray-500 dark:text-gray-300 sm:text-xl"
									>
										{article.summary}
									</div> -->
								{/if}
								<div class="flex justify-between">
									<div
										id="origin"
										class="flex space-x-3 text-sm text-gray-500 dark:text-gray-300 lg:text-base"
									>
										{#if article.author}
											<p>
												<a href="/author/{article.author}">{article.author}</a>
											</p>
										{/if}
										{#if article.author && article.published}
											<!-- <p>&middot;</p> -->
										{/if}
										{#if article.published}
											<p>{dayjs(article.published).format("ll")}</p>
										{/if}
										{#if article.wordCount}
											<span>{article.wordCount} words</span>
										{/if}
									</div>
								</div>
								{#if !data.authorized}
									<span class="rounded bg-amber-400 px-1 text-white">
										Annotated by <a href="/u:{$page.params.username}"
											>{$page.params.username}</a
										>
									</span>
								{/if}
								{#if data.authorized && article.bookmark && article.tags}
									<div transition:slide|local>
										<TagInputCombobox
											original={{ ...article }}
											allTags={$page.data.tags}
											tags={article.tags.map((tag) => ({
												...tag,
												...$page.data.tags?.find((t) => t.id === tag.id),
											}))}
										/>
									</div>
								{/if}
							</header>
							{#if article.type === "audio"}
								<AudioEntry entry={article} />
							{/if}
							<!-- this is a very rudimentary check lol -->
							<div id="entry-container">
								<Highlighter
									articleID={article.id}
									articleUrl={article.uri ?? ""}
									annotations={$entryData.isSuccess &&
									$entryData.data.annotations
										? $entryData.data?.annotations
										: []}
									entry={article}
								>
									{@html article.html ||
										article.text ||
										article.summary ||
										"[No content]"}
								</Highlighter>
							</div>
							<noscript>
								<HighlightMenu noHighlight={true} articleId={article.id} />
							</noscript>
						</div>
					{:else if article.type === "book"}
						<BookEntry entry={article} bookId={article?.googleBooksId} />
					{:else if article.type === "bookmark"}
						{@const screenshot =
							article.screenshot || article.bookmark?.screenshot}
						<BookmarkEntry
							entry={{
								...article,
								screenshot,
							}}
						/>
					{:else if article.type === "image"}
						{#if article.image}
							<ImageEntry image={article.image} />
						{/if}
					{:else if article.type === "movie" && article.tmdbId}
						<MovieEntry id={article.tmdbId} />
					{:else if article.type === "audio" && article.podcastIndexId}
						<!-- decide if podcast or not podcast -->
						{#if article.podcastIndexId}
							<Episode episodeId={article.podcastIndexId} />
						{:else}
							<AudioEntry entry={article} />
						{/if}
					{:else if article.type === "tweet"}
						<!-- {JSON.stringify(article)} -->

						<TweetEntry tweet={article.original} />
					{:else if article.type === "recipe" && article.recipe}
						<!-- TODO: display html or recipe -->
						<RecipeEntry recipe={article.recipe} />
					{:else if article.type === "video" && article.youtubeId}
						<VideoEntry bind:player entry={article} />
						<!-- <Youtube videoId={article.youtubeId} /> -->
						<!-- {@html article.html} -->
					{/if}
				</article>
			</div>
			<!-- Reading Sidebar -->
			{#if $entryQuery.isSuccess}
				<!-- <ReadingSidebar
					on:seek={async ({ detail }) => {
						console.log({ detail });
						console.log({ player });
						await player?.seekTo(detail, true);
					}}
					entry={{
						...$entryQuery.data,
						...$entryData.data,
					}}
				/> -->
			{/if}
			{#if data.css}
				<Booster bind:css={data.css} />
			{/if}
		</div>
	</div>
{/if}

<style lang="postcss">
	.article-container {
		scrollbar-gutter: auto;
	}
</style>
