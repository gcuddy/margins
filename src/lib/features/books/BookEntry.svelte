<script lang="ts">
	import { enhance } from "$app/forms";
	import { invalidate } from "$app/navigation";
	import { page } from "$app/stores";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Button from "$lib/components/Button.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import StateCombobox from "$lib/components/StateCombobox.svelte";
	import dayjs from "$lib/dayjs";
	import { stripGoogleBookCurl } from "$lib/features/books/utils";
	import { syncStore } from "$lib/stores/sync";
	import { trpc } from "$lib/trpc/client";
	import type { RouterOutputs } from "$lib/trpc/router";
	import { createQuery } from "@tanstack/svelte-query";
	import { entryDetailsQuery } from "../entries/queries";

	export let bookId: string;
	export let placeholderData: RouterOutputs["books"]["public"]["byId"] | undefined = undefined;
	export let entry: RouterOutputs["entries"]["load"] | undefined = undefined;


	$: todayLog = entry?.log.find((log) => dayjs(log.date).isSame(dayjs(), "day"));

	$: query = createQuery({
		queryKey: ["books", "detail", bookId],
		queryFn: async () => trpc($page).books.public.byId.query(bookId),
		staleTime: 5 * 1000 * 60,
		placeholderData,
		onSuccess: (book) => console.log({ book }),
	});

	// const entry = createQuery(entryDetailsQuery({ }))

	let busy = false;

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

<div class="container mx-auto flex flex-col space-y-8 divide-y p-6 dark:divide-gray-700">
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
		{@const image = stripGoogleBookCurl(book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail)}
		<div class="relative flex flex-col space-y-8 sm:flex-row sm:space-y-0 sm:space-x-12">
			<div class="flex flex-col gap-4">
				<img
					class="w-auto  rounded-xl  border border-border shadow-lg dark:border-border/25 sm:max-h-60"
					src={image}
					alt=""
				/>

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
						<StateCombobox
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
						</form>
					{:else}
						<form
							action="?/save"
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
                            <input type="hidden" name="image" value={image} />
							<!-- {#if book.imageLinks}
								<input type="hidden" name="image" value={selectImage(book.imageLinks)} />
							{/if} -->
							<input type="hidden" name="isbn" value={isbn} />
							<Button type="submit" disabled={busy} className="self-start flex items-center">
								{#if busy}
									<Icon name="loading" className="animate-spin h-4 w-4 text-current" />
								{:else}
									<span>Save</span>
								{/if}
							</Button>
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
</div>
