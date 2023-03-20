<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import RichAnnotationInput from "$lib/components/annotations/RichAnnotationInput.svelte";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Button from "$lib/components/Button.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import ImageLoader from "$lib/components/ui/images/ImageLoader.svelte";
	import dayjs from "$lib/dayjs";
	import { stripGoogleBookCurl } from "$lib/features/books/utils";
	import { trpc, trpcWithQuery } from "$lib/trpc/client";
	import type { RouterInputs, RouterOutputs } from "$lib/trpc/router";
	import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query";
	import { nanoid } from "nanoid";
	import { annotationQueryKeys } from "../annotations/queries";
	import BookEntryLayout from "./BookEntryLayout.svelte";

	export let bookId: string;
	export let placeholderData: RouterOutputs["books"]["public"]["byId"] | undefined = undefined;
	export let entry: RouterOutputs["entries"]["load"] | undefined = undefined;

    export let title = "";


	$: todayLog = entry?.log.find((log) => dayjs(log.date).isSame(dayjs(), "day"));

    const client = trpcWithQuery($page);
    const utils = client.createContext();
	$: query = client.books.public.byId.createQuery(bookId, {
		staleTime: 5 * 1000 * 60,
		// placeholderData,
		onSuccess: (book) => console.log({ book }),
	});

    $: title = entry?.title || $query.data?.volumeInfo?.title || placeholderData?.volumeInfo?.title || "";

	// $: query = createQuery({
	// 	queryKey: ["books", "detail", bookId],
	// 	queryFn: async () => trpc($page).books.public.byId.query(bookId),
	// 	staleTime: 5 * 1000 * 60,
	// 	placeholderData,
	// 	onSuccess: (book) => console.log({ book }),
	// });

	const queryClient = useQueryClient();
	const saveNoteMutation = createMutation({
		// TODO: persist offline
		mutationFn: (note: RouterInputs["annotations"]["create"] & { id: string }) =>
			trpc($page).annotations.create.mutate({
				entryId: entry?.id,
				...note,
			}),
		onMutate: async (note) => {
			const queryKey = annotationQueryKeys.annotation(note.id);
			await queryClient.cancelQueries({
				queryKey,
			});
			const previousNote = queryClient.getQueryData(queryKey);
			queryClient.setQueryData(queryKey, note);
			// Return a context with the previous and new todo
			return { previousNote, note };
		},
		onError: (err, newNote, context) => {
			queryClient.setQueryData(["annotations", context?.note.id], context?.previousNote);
		},
		// Always refetch after error or success:
		onSettled: (note) => {
			if (note) queryClient.invalidateQueries({ queryKey: annotationQueryKeys.annotation(note.id) });
		},
	});
	// const entry = createQuery(entryDetailsQuery({ }))

	// TODO: this data should be returned in query

	let busy = false;

	$: isbn =
		$query.data?.volumeInfo?.industryIdentifiers?.find((i) => i.type === "ISBN_13")?.identifier ??
		$query.data?.volumeInfo?.industryIdentifiers?.find((i) => i.type === "ISBN_10")?.identifier;
	$: googleBooksimage =
		$query.data?.volumeInfo?.imageLinks?.thumbnail || $query.data?.volumeInfo?.imageLinks?.smallThumbnail;
	$: openLibraryImage = isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false` : "";

    $: bookmarked = !!entry?.bookmark;

	$: image = openLibraryImage || googleBooksimage;

	const selectImage = (imageLinks: {
		extraLarge?: string;
		large?: string;
		medium?: string;
		small?: string;
		smallThumbnail?: string;
		thumbnail?: string;
	}) =>
		imageLinks.extraLarge ??
		imageLinks.large ??
		imageLinks.medium ??
		imageLinks.small ??
		imageLinks.thumbnail ??
		imageLinks.smallThumbnail;
</script>

<div class="container select-text mx-auto flex h-full flex-col space-y-8 divide-y p-6 dark:divide-gray-700" style:--book-shadow-color={$query.data?.color}>
	{#if entry}
    <!-- {JSON.stringify(entry)} -->
    {@const isbn = entry.uri?.replace("isbn:", "")}
    <BookEntryLayout {bookId} image={entry.image} fallbackImage={googleBooksimage} title={entry.title || ""} {isbn} description={entry.html} author={entry.author || ""} language={entry.language} subtitle={entry.summary} genres={entry.genres} publisher={entry.publisher} pageCount={entry.pageCount}  published={entry.published} {bookmarked}  >
        <svelte:fragment slot="underImage">
            {#if $page.route.id?.includes("entry") && $page.params.id}
					{#if !todayLog}
						<form
							use:enhance={() => {
                                return () => {
                                    utils.entries.invalidate()
                                }
                            }}
							method="post"
							action="/u:{$page.data.user?.username}/entry/{$page.params.id}?/log"
						>
							<Button type="submit" className="flex gap-1">
								<Icon name="lightningBoltSolid" />
								<span> Log to Activity </span>
							</Button>
						</form>
					{:else}
						Logged today
					{/if}
				{/if}
        </svelte:fragment>
    </BookEntryLayout>

    {:else if $query.isLoading}
		loading...
	{:else if $query.isError}
		Error
	{:else if $query.isSuccess && $query.data?.volumeInfo}
		{@const { volumeInfo: book } = $query.data}
		{@const isbn =
			book.industryIdentifiers?.find((i) => i.type === "ISBN_13")?.identifier ??
			book.industryIdentifiers?.find((i) => i.type === "ISBN_10")?.identifier}
		{@const bookmark = $page.data.user?.bookmarks?.find((bookmark) => bookmark.entry?.uri === isbn)}
        {@const {title, subtitle, authors, publisher, language, pageCount, description, publishedDate} = book}
		<!-- {@const image = stripGoogleBookCurl(book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail)} -->
		<!-- {@const image = stripGoogleBookCurl(book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail)} -->
       <BookEntryLayout {bookmarked} {bookId} {image} fallbackImage={googleBooksimage} genres={book.categories?.[0]?.split(" /")[0]} {title} {publisher} {isbn} {language} {pageCount} {subtitle} {description} author={authors?.join(", ")} published={publishedDate}  >
        <svelte:fragment slot="underImage">
            <!-- {#if $page.route.id?.includes("entry") && $page.params.id}
					{#if !todayLog}
						<form
							use:enhance={() => {
                                return () => {
                                    utils.entries.invalidate()
                                }
                            }}
							method="post"
							action="/u:{$page.data.user?.username}/entry/{$page.params.id}?/log"
						>
							<Button type="submit" className="flex gap-1">
								<Icon name="lightningBoltSolid" />
								<span> Log to Activity </span>
							</Button>
						</form>
					{:else}
						Logged today
					{/if}
				{/if} -->
        </svelte:fragment>
       </BookEntryLayout>

	{/if}
	{#if entry?.annotations}
		<div class="grow pt-6">
			{#if entry.annotations.length}
				<!-- TODO -->
			{/if}

			<RichAnnotationInput
				on:expand={async (e) => {
					// create this annotation, send it over to annotation/:id
					const id = nanoid();
					// should we snapshot it and just access it there? or set in some sort of store? maybe cache?
					console.log({ e });
					await $saveNoteMutation.mutate({
						id,
						entryId: entry?.id,
						contentData: e.detail,
						type: "note",
					});
					await goto(`/u:${$page.data.user?.username}/annotations/${id}`);
					// trpc().annotations.create.mutate({
					// 	id,
					// 	entryId: entry?.id,
					// 	contentData: e.detail,
					// 	type: "note",
					// });
				}}
				expandButton={true}
				placeholder="Add a page note…"
				rows={1}
				shadow_focus={true}
				include_tags={false}
				confirmButtonStyle="ghost"
				class="text-sm"
			>
				<svelte:fragment slot="buttons">
					<Button type="submit" disabled={busy} variant="ghost" size="sm" className="text-sm"
						>{#if busy}
							<Icon name="loading" className="animate-spin h-4 w-4 text-current" />
						{:else}
							Save
						{/if}
					</Button>
				</svelte:fragment>
			</RichAnnotationInput>
		</div>
	{/if}
</div>
