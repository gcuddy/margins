import { create_lists_state, create_entries_state, create_tags_state } from '$lib/state';
import type { LayoutLoad } from './$types';

export const load = (() => {
    const lists_state = create_lists_state();
    const entries_state = create_entries_state();
    return {
        lists_state,
        entries_state,
        tags_state: create_tags_state()
    };
})