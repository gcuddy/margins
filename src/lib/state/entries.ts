import { readable, writable } from 'svelte/store';
import type { EntryInList } from '$lib/db/selects';
import { tick } from 'svelte';

// see: https://github.com/Rich-Harris/sveltesnaps/blob/main/src/lib/state.ts
// note: this store will leak memory on the server! luckily, we're using
// serverless functions, which means we don't need to care — the
// function won't be kept alive long enough for it to matter.

const { subscribe, update } = writable(
    {} as {
        [id: string]: EntryInList & {
            tags?: {
                id: string;
                name: string;
            }[]
        }
    }
);

export const state = { subscribe };


export const invalidated = writable(false);

export const stale_time = readable(2000);


// Note: could probably use a Map instead of an object, but I'm not sure if that would be better or not.

export function init_entries(entries: EntryInList[]) {
    update((lookup) => {
        for (const entry of entries) {
            if (!lookup[entry.id]) {
                lookup[entry.id] = entry;
            }
        }

        return lookup;
    });
    tick().then(() => {
        invalidated.set(false);
    })
}

export function update_entry(id: number, entry: Partial<EntryInList>): void;
export function update_entry(entry: { id: number } & Partial<EntryInList>): void;
export function update_entry(id_or_entry: number | { id: number } & Partial<EntryInList>, entry?: Partial<EntryInList>) {
    let id: number;
    if (typeof id_or_entry === 'number') {
        id = id_or_entry;
    } else {
        id = id_or_entry.id;
        entry = id_or_entry;
    }
    update((lookup) => {
        lookup[id] = {
            ...lookup[id],
            ...entry
        };
        return lookup;
    });
}