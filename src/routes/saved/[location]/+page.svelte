<script lang="ts">
	import Saved from '$lib/components/Saved.svelte';
	import type { ArticleWithNotesAndTags } from '$lib/types';

	export let articles: ArticleWithNotesAndTags[];
	export let location: string;
	console.log({ articles, location });
</script>

<h1>{location}</h1>

<Saved {articles} />
