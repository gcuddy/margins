<script>
	import { MagnifyingGlass } from 'svelte-radix';
	import { Debounced } from 'runed';
	import GoogleBooksSearch from './google-books-search.svelte';

	let { data } = $props();
</script>

<div class="divide-y flex flex-col h-full">
	<form class="px-4 flex gap-2 items-center py-3">
		<MagnifyingGlass class="size-5" />
		<!-- svelte-ignore a11y_autofocus -->
		<input
			autofocus
			type="text"
			name="q"
			class="text-6 bg-transparent outline-none text-gray-12 w-full py-2"
			value={data.q}
		/>
	</form>
	<div class="overflow-y-auto py-2">
		{#if data.q}
			<GoogleBooksSearch query={data.q} />
		{/if}
	</div>
</div>
