import { checkedEntryIds } from '$components/entries/multi-select';
import type { LibraryEntry } from '$lib/server/queries';
import type { Status } from '$lib/status';
import { derived, writable } from 'svelte/store';

// forgive me for mixing this with tanstack/query, tkdodo
// this is for only stuff that should be shared between components conveniently, and should be used sparingly
const createEntryState = () => {
	const store = writable(
		{} as {
			[id: string]: {
				status: Status | null;
				tags?: {
					id: number;
					name: string;
				}[];
			};
		},
	);

	function init_entries(entries: LibraryEntry[]) {
		store.update((lookup) => {
			for (const entry of entries) {
				if (!entry) continue;
				if (!lookup[entry.id]) {
					lookup[entry.id] = entry;
				}
			}

			return lookup;
		});
	}

	function update_entry(entry: LibraryEntry) {
		store.update((lookup) => {
			lookup[entry.id] = {
				status: entry.status,
				tags: entry.tags,
			};
			return lookup;
		});
	}
	function update_entries(entry: LibraryEntry[]) {
		store.update((lookup) => {
			for (const entry of entries) {
				if (!entry) continue;
				lookup[entry.id] = {
					status: entry.status,
					tags: entry.tags,
				};
			}
			return lookup;
		});
	}

	return {
		subscribe: store.subscribe,
		init: init_entries,
		update: update_entry,
	};
};

export const entryState = createEntryState();

export const checkedTagsState = derived(
	[entryState, checkedEntryIds],
	([$entryState, $checkedEntryIds]) => {
		const tagCounts = new Map<number, number>();
		for (const entryId of $checkedEntryIds) {
			const entry = $entryState[entryId];
			if (!entry) continue;

			if (entry.tags) {
				for (const tag of entry.tags) {
					const count = tagCounts.get(tag.id) ?? 0;
					tagCounts.set(tag.id, count + 1);
				}
			}
		}

		const checkedTags: number[] = [];
		const indeterminateTags: number[] = [];
		const numEntries = $checkedEntryIds.length;
		for (const [tagId, count] of tagCounts.entries()) {
			if (count === numEntries) {
				checkedTags.push(tagId);
			} else if (count > 0) {
				indeterminateTags.push(tagId);
			}
		}

		return {
			checkedTags,
			indeterminateTags,
		};
	},
);
