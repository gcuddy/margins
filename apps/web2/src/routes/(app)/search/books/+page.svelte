<script>
	import { MagnifyingGlass } from 'svelte-radix';
	import { Debounced } from 'runed';
	import GoogleBooksSearch from './google-books-search.svelte';

	let { data } = $props();
</script>

{#if data.q}
	<GoogleBooksSearch query={data.q} />
{/if}
