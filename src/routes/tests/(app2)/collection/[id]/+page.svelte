<script>
	import { H1 } from "$lib/components/ui/typography";

	export let data;
</script>

<H1>{data.collection.name}</H1>

{#each data.collection.items as item}
	{item.entry_title}
{/each}
<!-- {JSON.stringify(data.collection)} -->
