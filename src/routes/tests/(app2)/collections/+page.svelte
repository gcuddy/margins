<script>
	import { H1 } from "$lib/components/ui/typography";
	import { name } from "$lib/icons";
	export let data;
</script>

<H1>Collections</H1>

{#each data.collections as { id, name }}
	<a href="/tests/collection/{id}"> {name}</a>
{/each}
