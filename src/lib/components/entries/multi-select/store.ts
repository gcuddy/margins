import { derived, writable } from "svelte/store";

export const checkedEntries = writable<Record<string, boolean>>({});

export const checkedEntryIds = derived(checkedEntries, $entries => {
    return Object.keys($entries).filter(id => $entries[id]);
})
