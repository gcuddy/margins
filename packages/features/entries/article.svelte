<script lang="ts">
	// TODO: really we just need an entry here, not a bookmark
	import type { BookmarkWithEntry } from '../data/index.js';
	export let bookmark: BookmarkWithEntry;
</script>

<div class="overflow-auto">
	<div class="prose mx-auto my-9">
		<h1 class="font-serif text-4xl font-semibold tracking-tight">
			{bookmark.title ?? bookmark.entry?.title ?? '[no title]'}
		</h1>

		<div class="prose">
			{@html bookmark.entry?.html ?? '[no content]'}
		</div>
	</div>
</div>
