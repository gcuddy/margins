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

	const libraryResults = derived(
		[library, results, input],
		([$library, $results, $input]) => {
			// TODO: perf improvement here could be using map lookup somehow?
			const final: Array<
				(typeof $library)[number] & {
					excerpt?: string;
				}
			> = [];

			// const tokens = MiniSearch.getDefault('tokenize')($input);

			for (const result of $results) {
				const bookmark = $library.find((l) => l.entry?.id === result.id);

				// TODO: matching etc
				if (bookmark) {
					const entry = structuredClone(bookmark.entry);
					console.log({ entry });
					let excerpts = '';
					for (const [match, fields] of Object.entries(result.match)) {
						const regex = new RegExp(`\\b(${match})\\b`, 'i');
						const global_regex = new RegExp(`\\b(${match})\\b`, 'ig');
						for (const field of fields) {
							console.log({ field });
							const title = bookmark.title ?? entry.title;
							if (field === 'title' && title) {
								// hacky hacky
								entry[field] = title.replaceAll(
									global_regex,
									`<mark>$1</mark>`,
								);
							} else {
								const text = entry[field as keyof typeof entry] as string;
								if (!text) continue;
								const match = text.match(regex);
								console.log({ match });
								let index = match?.index;
								console.log({ index });
								if (index === undefined) continue;
								let endingIndex = index + match![0]!.length;
								let excerpt = text.slice(index, endingIndex);
								let excerptLength = excerpt.length;
								let inc = 0;
								while (excerptLength < 100 && inc < 100) {
									inc++;
									if (inc >= 100) {
										break;
									}
									if (index > 0) {
										index--;
									}
									if (endingIndex < text.length - 1) {
										endingIndex++;
									}
									excerpt = text.slice(index, endingIndex);
									excerptLength = excerpt.length;
								}
								excerpt = excerpt.replaceAll(global_regex, `<mark>$1</mark>`);
								excerpts += excerpt;
							}
						}
					}
					console.log({ bookmark, excerpts });
					final.push({
						...bookmark,
						entry,
						excerpt: excerpts,
					});
				}
			}
			return final;
		},
	);

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
	<EntryItem
		class={result.excerpt ? 'h-20 overflow-hidden' : undefined}
		htmlTitle={result.entry?.title}
		bookmark={result}
	>
		<div slot="bottom" class="text-sm">{@html result.excerpt}</div>
	</EntryItem>
{/each}
