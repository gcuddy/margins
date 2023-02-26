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

	export let bookId: string;
	export let placeholderData: RouterOutputs["books"]["public"]["byId"] | undefined = undefined;
	export let entry: RouterOutputs["entries"]["load"] | undefined = undefined;

	$: todayLog = entry?.log.find((log) => dayjs(log.date).isSame(dayjs(), "day"));

	$: query = trpcWithQuery($page).books.public.byId.createQuery(bookId, {
		staleTime: 5 * 1000 * 60,
		placeholderData,
		onSuccess: (book) => console.log({ book }),
	});
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

	$: bookmarked = $page.data.user?.bookmarks.find((bookmark) => bookmark.entry?.uri === `isbn:${isbn}`);

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

<div class="container mx-auto flex h-full flex-col space-y-8 divide-y p-6 dark:divide-gray-700">
	{#if $query.isLoading}
		loading...
	{:else if $query.isError}
		Error
	{:else if $query.isSuccess && $query.data?.volumeInfo}
		{@const { volumeInfo: book } = $query.data}
		{@const isbn =
			book.industryIdentifiers?.find((i) => i.type === "ISBN_13")?.identifier ??
			book.industryIdentifiers?.find((i) => i.type === "ISBN_10")?.identifier}
		{@const bookmark = $page.data.user?.bookmarks?.find((bookmark) => bookmark.entry?.uri === isbn)}
		<!-- {@const image = stripGoogleBookCurl(book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail)} -->
		<!-- {@const image = stripGoogleBookCurl(book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail)} -->
		<div class="relative flex flex-col space-y-8 sm:flex-row sm:space-y-0 sm:space-x-12">
			<div class="flex shrink-0 flex-col gap-4 p-2 sm:p-0">
				<ImageLoader
					class="w-auto  rounded  border border-border drop-shadow-2xl dark:border-border/25 sm:max-h-60"
					src={image || ""}
					alt=""
					on:error={(e) => (image = googleBooksimage)}
				/>
				<!-- <img
					class="w-auto  rounded  border border-border drop-shadow-2xl dark:border-border/25 sm:max-h-60"
					src={openLibraryImage}
					alt=""
                    on:error={e => image = googleBooksimage}
				/> -->

				{#if $page.route.id?.includes("entry") && $page.params.id}
					{#if !todayLog}
						<form
							use:enhance
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
			</div>
			<div class="space-y-4 sm:space-y-8">
				<div class="flex flex-col text-center sm:text-left">
					<h1 class="text-2xl font-bold">{book?.title}</h1>
					{#if book.subtitle}
						<Muted class="text-lg font-medium">{book.subtitle}</Muted>
					{/if}
					<a class="text-lg"><Muted>{book.authors}</Muted></a>

					{#if bookmark}
						<!-- <StateCombobox
							state={$page.data.user?.states?.find((state) => state.id === bookmark.stateId)}
							onSelect={async (state) => {
								const s = syncStore.add();
								await trpc().bookmarks.updateState.mutate({
									id: bookmark.id,
									stateId: state.id,
								});
								await invalidate("user:data");
								syncStore.remove(s);
							}}
						/>
						<form
							action="/bookmarks/{bookmark.id}?/delete"
							use:enhance={() => {
								if ($page.data.user?.bookmarks) {
									$page.data.user.bookmarks = $page.data.user.bookmarks.filter((b) => b.entry?.uri !== isbn);
								}
								return async () => {
									await invalidate("user:data");
								};
							}}
							method="post"
						>
							<button>x</button>
						</form> -->
					{:else}
						<form
							action="/books/{bookId}?/save"
							method="post"
							use:enhance={() => {
								busy = true;
								return async ({ update }) => {
									await update();
									busy = false;
								};
							}}
						>
							<input type="hidden" name="bookId" value={bookId} />
							<input type="hidden" name="title" value={book.title} />
							<input type="hidden" name="description" value={book.description} />
							<input type="hidden" name="published" value={book.publishedDate} />
							<input type="hidden" name="author" value={book.authors} />
							<input type="hidden" name="pageCount" value={book.pageCount} />
							<input type="hidden" name="image" value={image} />
							<!-- {#if book.imageLinks}
								<input type="hidden" name="image" value={selectImage(book.imageLinks)} />
							{/if} -->
							<input type="hidden" name="isbn" value={isbn} />
							{#if !bookmarked}
								<Button type="submit" disabled={busy} className="self-start flex items-center">
									{#if busy}
										<Icon name="loading" className="animate-spin h-4 w-4 text-current" />
									{:else}
										<span>Save</span>
									{/if}
								</Button>
							{/if}
						</form>
					{/if}
					<dl class="grid grid-cols-[1fr,1fr,1fr] gap-3 pt-2">
						<div class="flex flex-col">
							<dt class="text-xs uppercase"><Muted>Year</Muted></dt>
							<dd><Muted>{dayjs(book.publishedDate).year()}</Muted></dd>
						</div>
						<div class="flex flex-col">
							<dt class="text-xs uppercase"><Muted>Genre</Muted></dt>
							<dd><Muted>{book.categories?.[0]?.split(" /")[0]}</Muted></dd>
						</div>
						<div class="flex flex-col">
							<dt class="text-xs uppercase"><Muted>Pages</Muted></dt>
							<dd><Muted>{book.pageCount}</Muted></dd>
						</div>
						<div class="flex flex-col">
							<dt class="text-xs uppercase"><Muted>Publisher</Muted></dt>
							<dd><Muted>{book.publisher}</Muted></dd>
						</div>
						<div class="flex flex-col">
							<dt class="text-xs uppercase"><Muted>Language</Muted></dt>
							<dd><Muted>{book.language}</Muted></dd>
						</div>
						<div class="flex flex-col ">
							<dt class="text-xs uppercase"><Muted>ISBN</Muted></dt>
							<dd>
								<Muted>{isbn}</Muted>
							</dd>
						</div>
					</dl>
					<!-- TODO: categories here -->
				</div>
				<div class="relative overflow-hidden text-sm ">
					<div class="prose prose-stone text-sm  leading-normal  dark:prose-invert">
						{@html book.description}
					</div>
				</div>
			</div>
		</div>
	{/if}
	{#if entry?.annotations}
		<div class="grow pt-6">
			{#if entry.annotations.length}
				<!-- TODO -->
			{/if}
			<!-- <AnnotationInput
	placeholder="Add a page note…"
	rows={1}
	bind:value
	shadow_focus={true}
	include_tags={false}
	confirmButtonStyle="ghost"
	class="text-sm"
>

</AnnotationInput> -->

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
