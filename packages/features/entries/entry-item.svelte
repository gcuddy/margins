<script lang="ts">
	import type { BookmarkWithEntry } from '../data/library.js';
	import { page } from '$app/stores';
	export let bookmark: BookmarkWithEntry;
</script>

<a
	href="/u:{$page.data.user?.username}/read/{bookmark.id}"
	class="mx-3 block h-14 cursor-default"
>
	<!-- start of actual component -->
	<div class="flex items-center gap-3 rounded px-3">
		<div>
			<img
				src={bookmark.entry?.image ??
					`https://icon.horse/icon/${getDomain(bookmark.entry?.uri ?? '') ?? 'margins'}`}
				alt={bookmark.entry?.title}
				class="h-6 w-6 rounded"
			/>
		</div>
		<div class="flex flex-col">
			<span class="text-sm">
				{bookmark.entry?.title}
			</span>
			{#if bookmark.entry?.summary}
				<span class="text-sm">
					{bookmark.entry?.summary}
				</span>
			{/if}
			{#if bookmark.entry?.author}
				<span class="text-muted-foreground text-sm">
					{bookmark.entry?.author}
				</span>
			{/if}
		</div>
	</div>
</a>
