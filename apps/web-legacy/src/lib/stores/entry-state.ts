import { checkedEntryIds } from '$components/entries/multi-select';
import type { LibraryEntry } from '$lib/server/queries';
import type { Status } from '$lib/status';
import type { SlimEntry } from '$lib/utils/entries';
import { derived, writable } from 'svelte/store';

// forgive me for mixing this with tanstack/query, tkdodo
// this is for only stuff that should be shared between components conveniently, and should be used sparingly
const createEntryState = () => {
	const store = writable(
		{} as {
			[id: string]: {
				seen?: number | boolean;
				status: Status | null;
				tags?: {
					id: number;
					name: string;
				}[];
				title: string | null;
				uri?: string | null;
			} & SlimEntry;
		},
	);

	function init_entries(entries: LibraryEntry[]) {
		store.update((lookup) => {
			for (const entry of entries) {
				if (!entry) continue;
				// if (!lookup[entry.id]) {
				lookup[entry.id] = entry;
				// }
			}

			return lookup;
		});
	}

	function update_entry(entry: LibraryEntry) {
		store.update((lookup) => {
			lookup[entry.id] = entry;
			return lookup;
		});
	}
	function update_entries(entries: LibraryEntry[]) {
		store.update((lookup) => {
			for (const entry of entries) {
				if (!entry) continue;
				lookup[entry.id] = entry;
			}
			return lookup;
		});
	}

	return {
		subscribe: store.subscribe,
		init: init_entries,
		update: update_entry,
		update_entries,
	};
};

export const entryState = createEntryState();

export const checkedCommandBadgeDisplay = derived(
	[entryState, checkedEntryIds],
	([$entryState, $checkedEntryIds]) => {
		if ($checkedEntryIds.length === 0) return null;
		if ($checkedEntryIds.length === 1) {
			const entry = $entryState[$checkedEntryIds[0] as number];
			if (!entry) return '1 entry';
			return entry.title;
		}
		return `${$checkedEntryIds.length} entries`;
	},
);

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
