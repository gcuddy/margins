<script lang="ts">
	import { getReplicache } from '@margins/features';
	import { LibraryStore, type BookmarkWithEntry } from '@margins/features/data';
	import { derived } from 'svelte/store';
	import { mainCommandState } from '../stores/command-state';
	import commandScore from 'command-score';
	import { Command } from '@margins/ui';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	const rep = getReplicache();

	const library = LibraryStore.all.watch(
		() => rep,
		() => [],
	)();

	const sortedAndFilteredLibrary = derived(
		[library, mainCommandState],
		([$library, $mainCommandState]) => {
			const arr: BookmarkWithEntry[] = [];
			const idToScoreMap = new Map<string, number>();

			if ($mainCommandState.input.length < 1) {
				return $library.filter((b) => b.entry);
			}

			for (const b of $library) {
				const title = b.title ?? b.entry?.title;
				if (title) {
					const score = commandScore(title, $mainCommandState.input);
					idToScoreMap.set(b.id, score);
					arr.push(b);
				}
			}

			arr.sort((a, b) => {
				return idToScoreMap.get(b.id)! - idToScoreMap.get(a.id)!;
			});

			return arr;
		},
	);
</script>

<Command.Group>
	{#each $sortedAndFilteredLibrary as bookmark (bookmark.id)}
		<Command.Item
			id={bookmark.id}
			onSelect={() => {
				mainCommandState.run(() => {
					goto(`/u:${$page.data.user?.username}/read/${bookmark.id}`);
				});
			}}
		>
			<img
				src={bookmark.entry?.image}
				alt={bookmark.title ?? bookmark.entry?.title}
				class="mr-2 h-8 w-8 rounded-lg"
			/>
			{bookmark.title ?? bookmark.entry?.title}
		</Command.Item>
	{/each}
</Command.Group>
