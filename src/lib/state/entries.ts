import { Readable, derived, readable, writable } from 'svelte/store';
import type { EntryInList } from '$lib/db/selects';
import { tick } from 'svelte';

// see: https://github.com/Rich-Harris/sveltesnaps/blob/main/src/lib/state.ts
// note: this store will leak memory on the server! luckily, we're using
// serverless functions, which means we don't need to care — the
// function won't be kept alive long enough for it to matter.

type EntryState = EntryInList & {
	tags?: {
		id: number;
		name: string;
	}[];
} & {
	type: 'pdf';
	outline?: Readable<{ title: string; pageNumber: number; active: boolean }[]>;
};

// TODO: think this with something like indexeddb?

const { subscribe, update } = writable(
	{} as {
		[id: string]: EntryState;
	}
);

export const state = { subscribe };

export const entries_in_state = derived(state, ($state) => Object.values($state));

export const invalidated = writable(false);

export const stale_time = readable(2000);

// Note: could probably use a Map instead of an object, but I'm not sure if that would be better or not.

export function init_entries(entries: EntryState[]) {
	update((lookup) => {
		for (const entry of entries) {
            if (!entry) continue;
			if (!lookup[entry.id]) {
				lookup[entry.id] = entry;
			}
		}

		return lookup;
	});
	tick().then(() => {
		invalidated.set(false);
	});
}

function update_annotation_on_entry(id: number, annotation: Partial<EntryState>) {
	update((lookup) => {
		lookup[id] = {
			...lookup[id],
			...annotation
		};
		return lookup;
	});
}

type UpdateEntryFactory = {
	annotation: (
		annotation: { id: string } & Partial<NonNullable<EntryState["annotations"]>[number]>
	) => void;
};

export function update_entry(id: number): UpdateEntryFactory;
export function update_entry(
	id: number,
	entry: Partial<EntryState> | ((entry: EntryState) => Partial<EntryState>)
): void;
export function update_entry(entry: { id: number } & Partial<EntryState>): void;
export function update_entry(
	id_or_entry: number | ({ id: number } & Partial<EntryState>),
	entry?: Partial<EntryState> | ((entry: EntryState) => Partial<EntryState>)
) {
	let id: number;
	if (typeof id_or_entry === 'number') {
		id = id_or_entry;
		if (!entry) {
			// return some more functions here?
			const factory: UpdateEntryFactory = {
				annotation: (annotation) => {
					update((lookup) => {
						const state = lookup[id];
						const annotations = state.annotations || [];
						const idx = annotations.findIndex((a) => a.id === annotation.id);
						// TODO: create default annotation to fill in gaps

						if (idx === -1) {
							annotations.push({
                                body: null,
                                contentData: null,
                                createdAt: new Date(),
                                entryId: null,
                                exact: null,
                                start: null,
                                title: null,
                                target: null,
                                type: "annotation",
                                username: null,
                                ...annotation
                            });
						} else {
							annotations[idx] = {
								...annotations[idx],
								...annotation
							};
						}
						lookup[id] = {
							...state,
							annotations
						};
						return lookup;
					});
				}
			};
            return factory;
		}
	} else {
		id = id_or_entry.id;
		entry = id_or_entry;
	}
	update((lookup) => {
		if (typeof entry === 'function') {
			const state = lookup[id];
			lookup[id] = {
				...lookup[id],
				...entry(state)
			};
		} else {
			lookup[id] = {
				...lookup[id],
				...entry
			};
		}
		return lookup;
	});
}
