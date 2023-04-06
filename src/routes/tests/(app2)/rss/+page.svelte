<script>
	import Button from "$lib/components/ui/Button.svelte";
	import { fetchMore } from "./utils";

	export let data;
</script>

{#each data.feeds.entries as entry}
	<div>
		<h2>{entry.title}</h2>
	</div>
{/each}

<!-- progressively enhance by adding a form/url param to paginate by going to next page with ?timestamp=-->
<Button
	on:click={async () => {
		await fetchMore({
			cursor: data.feeds.nextCursor,
			take: 25,
		}).then((newData) => {
			data.feeds.entries = [...data.feeds.entries, ...newData.entries];
			data.feeds.nextCursor = newData.nextCursor;
		});
	}}>Load more</Button
>

<!-- <form action="?/fetchMore" method="post">
	<input type="hidden" name="cursor" value={data.feeds.nextCursor} />
	<Button type="submit">Load more</Button>
</form> -->

<!-- {#await data.lazy.feeds}
	loading...
{:then { entries, nextCursor }}
	{#each entries as entry}
		<div>
			<h2>{entry.title}</h2>
		</div>
	{/each}

{/await} -->
