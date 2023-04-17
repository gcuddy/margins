<script lang="ts">
	import { H1, Lead, Subtle } from "$lib/components/ui/typography";
	import type { PageData } from "./$types";
	import BookmarkForm from "./BookmarkForm.svelte";

	type Book = PageData["book"];
	export let data: PageData & {
		book: NonNullable<Book>;
	};
	$: ({ book } = data);

	const strip_gbook_curl = (url: string) => {};

	$: isbn = book.volumeInfo?.industryIdentifiers?.find(
		(i) => i.type === "ISBN_13"
	)?.identifier;

	$: author = book.volumeInfo?.authors?.join(", ");

	$: year = book.volumeInfo?.publishedDate?.split("-")[0];

	function handleImgError(e: Event) {
		console.log(e, "erro");
		const img = e.target as HTMLImageElement;
		img.src = data.book.volumeInfo?.imageLinks?.extraLarge ?? "";
	}

	function getGbookImage(book: NonNullable<Book>) {
		const { volumeInfo } = book;
		if (!volumeInfo) return "";
		const { imageLinks } = volumeInfo;
		if (!imageLinks) return;
		const { extraLarge, large, medium, small, thumbnail } = imageLinks;
		// try thumbnail first, setting zoom to 0 and removing curl
		// if that fails, try small, medium, large, extraLarge
		if (thumbnail) {
			console.log("thumbnail", thumbnail);
			const url = new URL(thumbnail);
			// url.searchParams.set("zoom", "0");
			url.searchParams.delete("edge");
			return url.href;
		}

		return extraLarge ?? large ?? medium ?? small ?? thumbnail;
	}
</script>

<div class="flex select-text flex-col gap-4">
	<div class="flex items-center gap-6">
		<!-- src="https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg?default=false" -->
		<img
			class="aspect-auto max-w-[200px] rounded-md shadow-lg"
			on:error={(e) => console.log(e)}
			src={getGbookImage(book)}
			alt=""
		/>
		<div class="flex flex-col gap-2">
			<Subtle>Book</Subtle>
			<H1>{book.volumeInfo?.title}</H1>
			<Lead>
				{author} — {year}
			</Lead>
			<Lead class="text-base">
				isbn: {isbn}
			</Lead>
			<BookmarkForm data={data.bookmarkForm} />
		</div>
	</div>

	<div class="prose prose-slate dark:prose-invert">
		{@html book.volumeInfo?.description}
	</div>
</div>
