import { writable } from 'svelte/store';

export async function load({ data, parent }) {
    return {
        ...data,
        current_entry_id: writable(null),
    }
}