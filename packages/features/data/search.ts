import MiniSearch from 'minisearch';
import { derived, get, writable } from 'svelte/store';
import type { Replicache } from 'replicache';
import type { Entry } from '../core/index.js';
import type { BookmarkWithEntry } from './library.js';

export function createDerivedLibrarySearchStore(rep: Replicache) {
	// TODO: use text field
	const minisearch = new MiniSearch({
		fields: ['title', 'html', 'author'],
		storeFields: ['title'],
	});

	const ready = writable(false);

	// TODO: clean this up
	const unsubscribe = rep.experimentalWatch(
		(diffs) => {
			console.log('watching');
			if (!get(ready)) {
				const docs: Entry.Item[] = [];
				for (const diff of diffs) {
					console.log('diffs');
					if (diff.op === 'add') {
						const entry = (
							structuredClone(diff.newValue) as unknown as BookmarkWithEntry
						).entry;
						if (!entry) continue;
						docs.push(entry);
					}
				}
				minisearch.addAllAsync(docs);
				ready.set(true);
				return;
			}
			for (const diff of diffs) {
				console.log('diffs');
				if (diff.op === 'add') {
					minisearch.add(diff.newValue);
				} else if (diff.op === 'change') {
					minisearch.replace(diff.newValue);
				} else if (diff.op === 'del') {
					const entry = diff.oldValue as Entry.Item;
					minisearch.discard(entry.id);
				}
			}
		},
		{
			initialValuesInFirstDiff: true,
			prefix: '/Bookmark',
		},
	);

	const input = writable('');

	const results = derived(input, ($input) => {
		console.log({ $input });
		const results = minisearch.search($input, {
			fuzzy: 0.2,
		});
		console.log({ results });

		return results;
	});

	return {
		input,
		results,
	};
}
