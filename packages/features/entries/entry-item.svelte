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
	export let user: { id: string; username: string };
	export let bookmark: BookmarkWithEntry;
	export let htmlTitle: string | undefined = undefined;
	let className: string | undefined = undefined;
	export { className as class };
</script>

<a
	href="/u:{user.username}/read/{bookmark.id}"
	class={cn('hover:bg-sandA-2 block h-14 cursor-default', className)}
>
	<!-- start of actual component -->
	<div class="flex h-full items-center gap-3 px-4">
		<div>
			<img
				src={bookmark.entry?.image ??
					`https://icon.horse/icon/${getDomain(bookmark.entry?.uri ?? '') ?? 'margins'}`}
				alt={bookmark.entry?.title}
				style:height="48px"
				style:width="48px"
				class="rounded object-cover"
			/>
		</div>
		<div class="flex flex-col">
			<span class="truncate text-sm">
				{#if htmlTitle}
					{@html htmlTitle}
				{:else}
					{bookmark.entry?.title}
				{/if}
			</span>
			<!-- {#if bookmark.entry?.summary} -->
			<!-- 	<span class="text-sm"> -->
			<!-- 		{bookmark.entry?.summary} -->
			<!-- 	</span> -->
			<!-- {/if} -->
			{#if bookmark.entry?.author}
				<span class="text-grayA-11 truncate text-xs">
					{bookmark.entry?.author}
				</span>
			{/if}
		</div>
	</div>
	<slot name="bottom" />
</a>
