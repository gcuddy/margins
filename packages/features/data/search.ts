import MiniSearch from 'minisearch';
import { derived, get, writable } from 'svelte/store';
import type { Replicache } from 'replicache';
import { type BookmarkWithEntry } from './library.js';

export function createDerivedLibrarySearchStore(rep: Replicache) {
	// TODO: serialize to indexedDB
	const minisearch = new MiniSearch({
		extractField: (doc, fieldName) => {
			if (fieldName === 'html') {
				const d = new DOMParser();
				const html = `<html><body>${doc[fieldName]}</body></html`;
				const parsed = d.parseFromString(html, 'text/html');
				const body = parsed.querySelector('body');
				const textContent = body!.textContent;
				return textContent;
			}

			return MiniSearch.getDefault('extractField')(doc, fieldName);
		},
		fields: ['title', 'html', 'author'],
		storeFields: ['title'],
	});
	console.log({ minisearch });

	// TODO: derive path automatially, or derive this from store
	const { unsubscribe } = createSearchWatcher<
		BookmarkWithEntry,
		BookmarkWithEntry['entry']
	>(rep, minisearch, '/Bookmark', (b) => b.entry);

	const input = writable('');

	const results = derived(input, ($input) => {
		const results = minisearch.search($input, {
			fuzzy: 0.2,
		});

		return results;
	});

	return {
		input,
		results,
	};
}

function createSearchWatcher<
	TInput,
	TOutput extends {
		id: string;
	},
>(
	rep: Replicache,
	minisearch: MiniSearch,
	path: string,
	resolver: (res: TInput) => TOutput,
) {
	const ready = writable(false);
	const unsubscribe = rep.experimentalWatch(
		(diffs) => {
			console.log('watching');
			if (!get(ready)) {
				const docs: TOutput[] = [];
				for (const diff of diffs) {
					console.log('diffs');
					if (diff.op === 'add') {
						const val = resolver(structuredClone(diff.newValue) as TInput);
						if (!val) continue;
						docs.push(val);
					}
				}
				minisearch.addAllAsync(docs);
				ready.set(true);
				return;
			}
			for (const diff of diffs) {
				console.log('diffs');
				if (diff.op === 'add') {
					const val = resolver(structuredClone(diff.newValue) as TInput);
					if (!val) continue;
					minisearch.add(val);
				} else if (diff.op === 'change') {
					const val = resolver(structuredClone(diff.newValue) as TInput);
					minisearch.replace(val);
				} else if (diff.op === 'del') {
					const val = resolver(structuredClone(diff.oldValue) as TInput);
					minisearch.discard(val.id);
				}
			}
		},
		{
			initialValuesInFirstDiff: true,
			prefix: path,
		},
	);

	return {
		unsubscribe,
	};
}
