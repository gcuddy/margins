<script lang="ts">
	import { fly } from 'svelte/transition';
	import { getEntryCtx } from './ctx.js';
	import { tweened } from 'svelte/motion';
	import { SmallPlus, Tabs, Textarea } from '@margins/ui';
	import { type BookmarkWithEntry } from '../data/library.js';
	import { AnnotationStore } from '../data/annotation.js';
	import { getReplicache } from '../replicache/index.js';
	import { createId } from '@margins/lib';
	const rep = getReplicache();
	const { inspectorTab, inspectorWidth, isInspectorVisible } = getEntryCtx();
	const DURATION = 125;

	export let bookmark: BookmarkWithEntry;

	const marginLeft = tweened(0, {
		duration: DURATION,
	});

	$: marginLeft.set($isInspectorVisible ? 0 : -$inspectorWidth);

	const annotations = AnnotationStore.list.watch(
		() => rep,
		() => [],
		(annotations) =>
			annotations.filter((a) => {
				return a.entryId === bookmark.entry?.id;
			}),
	)();

	$: console.log({ $annotations });
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
		<Tabs.Root bind:value={$inspectorTab} class="space-y-6">
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
			<Tabs.Content value="notebook">
				<Textarea
					onSave={async (value) => {
						rep.mutate.annotation_create({
							body: value,
							entryId: bookmark.entry?.id,
							id: createId(),
						});
					}}
					placeholder="Add a note…"
					class="bg-background-elevation w-full"
				/>
				{#each $annotations as annotation}
					<div class="bg-background-elevation2 rounded-lg p-2">
						<p>{annotation.body}</p>
					</div>
				{/each}
			</Tabs.Content>
		</Tabs.Root>
	</div>
{/if}
