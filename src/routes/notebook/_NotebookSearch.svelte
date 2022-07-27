<script lang="ts">
	import type { ArticleWithNotesAndTagsAndContext } from '$lib/types';

	export let value = '';
	export let articles: ArticleWithNotesAndTagsAndContext[];
	$: articles = articles.filter(({ title, author, url }) => {
		return (
			title.toLowerCase().includes(value.toLowerCase()) ||
			author.toLowerCase().includes(value.toLowerCase()) ||
			new URL(url).hostname.toLowerCase().includes(value.toLowerCase())
		);
	});
</script>

<input type="text" bind:value />
