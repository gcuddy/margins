import { query_cache } from "$lib/state/query-state";

export async function load() {
    const query_state = query_cache();
    return {
        query_state
    }
}