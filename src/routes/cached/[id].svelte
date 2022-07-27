<script lang="ts">
	import type { Bookmark } from '@prisma/client';
	export let bookmark: Bookmark;
</script>

<!-- {@html bookmark.html} -->

<iframe
	src={bookmark.url}
	srcdoc={bookmark.html}
	title={bookmark.title}
	width="100%"
	height="100%"
	frameborder="0"
/>
