<script lang="ts">
	import Muted from "$lib/components/atoms/Muted.svelte";
	import SmallPlus from "$lib/components/atoms/SmallPlus.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import Header from "$lib/components/layout/Header.svelte";
	import DefaultHeader from "$lib/components/layout/headers/DefaultHeader.svelte";
	import BookEntry from "$lib/features/books/BookEntry.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
    let title = "";
</script>

<!-- readingmenu here -->
<Header>
	<DefaultHeader>
		<div slot="start">
			<div class="flex text-sm items-center">
				<span class="font-medium">Books</span>
				<Icon name="chevronRightMini" className="h-3 w-4 fill-current" />
				<span>{title}</span>
			</div>
		</div>
	</DefaultHeader>
</Header>
<BookEntry bind:title bookId={data.id} />
