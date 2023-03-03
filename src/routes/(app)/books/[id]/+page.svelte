<script lang="ts">
	import BookEntry from "$lib/features/books/BookEntry.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;

</script>

<BookEntry bookId={data.id}  />
