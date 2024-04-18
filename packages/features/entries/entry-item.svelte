<script lang="ts">
	import { cn } from '@margins/lib';
	import type { BookmarkWithEntry } from '../data/library.js';
	function getDomain(url: string) {
		const match = url.match(/:\/\/(www\d?\.)?(.[^/:]+)/i);
		if (
			match != null &&
			match.length > 2 &&
			typeof match[2] === 'string' &&
			match[2].length > 0
		) {
			return match[2];
		} else {
			return null;
		}
	}
	export let bookmark: BookmarkWithEntry;
	export let htmlTitle: string | undefined = undefined;
	let className: string | undefined = undefined;
	export { className as class };
	console.log('entry-item', bookmark, htmlTitle);
</script>

<a href="/id" class={cn('mx-3 block h-14 cursor-default', className)}>
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
				{#if htmlTitle}
					{@html htmlTitle}
				{:else}
					{bookmark.entry?.title}
				{/if}
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
	<slot name="bottom" />
</a>
