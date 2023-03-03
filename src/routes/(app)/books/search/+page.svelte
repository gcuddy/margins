<script lang="ts">
	import { page } from "$app/stores";
	import GenericInput from "$lib/components/GenericInput.svelte";
	import { searchBookQuery } from "$lib/features/books/queries";
	import { stripGoogleBookCurl } from "$lib/features/books/utils";
	import { createQuery } from "@tanstack/svelte-query";
	import { uniqBy, uniqWith } from "lodash";

	let value = "";

	$: query = createQuery(searchBookQuery($page, value));

	$: q = $page.url.searchParams.get("q");
	$: if (q) value = q;

	$: console.log({ $query });

	// REVIEW: de-dupe by comparing title, author, and pagecount(?)
	// (should probably do this on server side)
	// Should I even be doing this at all?
	function deDupe(data: typeof $query.data) {
		const items = data?.items || [];
		return uniqBy(items, (item) => JSON.stringify([item.volumeInfo?.title, item.volumeInfo?.authors]));
		// items.map(({ volumeInfo: info }) => {
		// 	info;
		// });
	}

	// TODO: better de-duping/massaging results (remove page count 0, no author, etc)

	$: if ($query.data) console.log(deDupe($query.data));
</script>

<div class="container mx-auto">
	<div>
		<GenericInput type="text" bind:value />
	</div>

	{#if $query.isInitialLoading}
		<!-- content here -->
		<p>loading...</p>
	{:else if $query.isSuccess && $query.data?.items}
		<ul class="flex flex-col gap-1">
			{#each $query.data.items.filter((i) => i.volumeInfo?.pageCount > 0) || [] as item}
				{@const image = item.volumeInfo?.imageLinks}
				{@const isbn = item.volumeInfo?.industryIdentifiers?.find((i) => i?.type === "ISBN_13")?.identifier}
				{@const imageUrl = stripGoogleBookCurl(image?.thumbnail || image?.smallThumbnail)}
				<!-- content here -->
				<!-- {JSON.stringify(data)} -->
				<li>
					<a class="flex gap-2 p-2" href="/books/{item.id}">
						<img
							class=" max-h-20 w-auto rounded border border-gray-300 shadow"
							alt="Book cover for {item.volumeInfo?.title}"
							src={imageUrl}
						/>
						<div class="flex flex-col gap-1">
							<span class="text-lg font-medium">{item.volumeInfo?.title}</span>
							<span>{item.volumeInfo?.authors}</span>
							<!-- <span>{item.volumeInfo?.publishedDate}</span>
                            <span>{item.volumeInfo?.publisher}</span> -->
							<!-- {isbn} -->
						</div>
					</a>
				</li>
				<!-- <a href={item.volumeInfo?.infoLink}>info </a> -->
			{/each}
		</ul>
	{:else if $query.isError}
		Error
	{/if}
</div>
