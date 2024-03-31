<script lang="ts">
	import { fly } from 'svelte/transition';
	import { getEntryCtx } from './ctx.js';
	import { tweened } from 'svelte/motion';
	import { SmallPlus, Tabs } from '@margins/ui';
	import { type BookmarkWithEntry } from '../data/library.js';
	const { inspectorWidth, isInspectorVisible } = getEntryCtx();
	const DURATION = 125;

	export let bookmark: BookmarkWithEntry;

	const marginLeft = tweened(0, {
		duration: DURATION,
	});

	$: marginLeft.set($isInspectorVisible ? 0 : -$inspectorWidth);
</script>

{#if $isInspectorVisible}
	<div
		transition:fly={{
			duration: 125,
			opacity: 1,
			x: '100%',
		}}
		style:width="{$inspectorWidth}px"
		style:margin-left="{$marginLeft}px"
		class="entry-inspector bg-background-elevation2 border-l px-6 py-3.5"
	>
		<Tabs.Root class="space-y-6">
			<Tabs.List class="h-auto w-full p-1">
				<Tabs.Trigger value="properties" class="w-full grow">
					<SmallPlus mini muted>Properties</SmallPlus>
				</Tabs.Trigger>
				<Tabs.Trigger value="notebook" class="w-full grow">
					<!-- Notebook -->
					<SmallPlus mini muted>Notebook</SmallPlus>
				</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="properties">
				<div class="flex flex-col gap-2">
					<SmallPlus mini muted>Properties</SmallPlus>
					<div>
						<SmallPlus muted>Saved</SmallPlus>
						<SmallPlus>{bookmark.bookmarked_at}</SmallPlus>
					</div>
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</div>
{/if}
