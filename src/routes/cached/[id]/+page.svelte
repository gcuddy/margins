<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	$: bookmark = data.bookmark;
</script>

{#if bookmark}
	<iframe
		src={bookmark.url}
		srcdoc={bookmark.html}
		title={bookmark.title}
		width="100%"
		height="100%"
		frameborder="0"
	/>
{/if}
