<script>
	import GenericInput from '$lib/components/GenericInput.svelte';
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<form>
	<GenericInput />
</form>
<ul>
	{#each data.results as result}
		<li>
			<a href="/rss/{result.rssFeedId}/{result.uuid}">{result.title} - {result.author}</a>
		</li>
	{/each}
</ul>
