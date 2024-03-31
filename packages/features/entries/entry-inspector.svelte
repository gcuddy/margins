<script lang="ts">
	import { fly } from 'svelte/transition';
	import { getEntryCtx } from './ctx.js';
	import { tweened } from 'svelte/motion';
	import { SmallPlus } from '@margins/ui';
	import { type BookmarkWithEntry } from '../data/library.js';
	const { isInspectorVisible } = getEntryCtx();
	const DURATION = 125;
	const WIDTH = 330;

	export let bookmark: BookmarkWithEntry;

	const marginLeft = tweened(0, {
		duration: DURATION,
	});

	$: marginLeft.set($isInspectorVisible ? 0 : -WIDTH);
</script>

{#if $isInspectorVisible}
	<div
		transition:fly={{
			duration: 125,
			opacity: 1,
			x: '100%',
		}}
		style:width="{WIDTH}px"
		style:margin-left="{$marginLeft}px"
		class="entry-inspector"
	>
		<SmallPlus mini muted>Properties</SmallPlus>
		<div>
			<SmallPlus muted>Saved</SmallPlus>
			<SmallPlus>{bookmark.bookmarked_at}</SmallPlus>
		</div>
	</div>
{/if}
