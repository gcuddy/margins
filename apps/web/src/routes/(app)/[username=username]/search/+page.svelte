<script lang="ts">
	import { getReplicache } from '@margins/features/replicache';
	import { ShellHeader } from '@margins/features/shell';
	import { EntryItem } from '@margins/features/entries';
	import {
		LibraryStore,
		createDerivedLibrarySearchStore,
	} from '@margins/features/data';
	import { derived } from 'svelte/store';

	// TODO: bind with url state
	//
	// TODO: this should come higher up in state to prevent it being recreated each time.
	//
	const rep = getReplicache();
	const { input, results } = createDerivedLibrarySearchStore(rep);

	const library = LibraryStore.all.watch(
		() => rep,
		() => [],
	)();

	const libraryResults = derived([library, results], ([$library, $results]) => {
		// TODO: perf improvement here could be using map lookup somehow?
		const final: typeof $library = [];

		for (const result of $results) {
			const bookmark = $library.find((l) => l.entry?.id === result.id);
			// TODO: matching etc
			if (bookmark) final.push(bookmark);
		}
		return final;
	});

	rep.subscribe(
		(tx) => {
			return tx.scan().entries().toArray();
		},
		(s) => console.log(s),
	);
</script>

<ShellHeader>
	<input bind:value={$input} type="text" class="h-full w-full grow" />
</ShellHeader>

{#each $libraryResults as result}
	<EntryItem bookmark={result} />
{/each}
