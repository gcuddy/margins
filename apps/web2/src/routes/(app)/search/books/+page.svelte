<script>
	import { MagnifyingGlass } from 'svelte-radix';
	import { Debounced } from 'runed';
	import GoogleBooksSearch from './google-books-search.svelte';

	let search = $state('');
	const debounced = new Debounced(() => search, 500);
</script>

<div class=" divide-y flex flex-col h-full">
	<div class="px-4 flex gap-2 items-center py-3">
		<MagnifyingGlass class="size-5" />
		<input
			type="text"
			bind:value={search}
			class="text-6 bg-transparent outline-none text-gray-12 w-full py-2"
		/>
	</div>
	<div class="overflow-y-auto py-2">
		{#if debounced.current}
			<GoogleBooksSearch query={debounced.current} />
		{/if}
	</div>
</div>
