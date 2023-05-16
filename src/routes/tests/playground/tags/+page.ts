import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { query } from '$lib/queries/query';

export const load = (async (e) => {
    const { parent } = e;

    if (browser) {
        const { entries_state, lists_state, tags_state } = await parent();
        const tags = get(tags_state);

        if (tags.size > 0) {
            // turn map<id, name> into array of {id, name}
            const tags_array = Array.from(tags.entries()).map(([id, name]) => ({ id, name }));
            return { tags: tags_array };
        } else {
            // fetch and init
            const tags = await query(e, 'tags', {})
            tags_state.init(tags);
            return {
                tags
            }
        }

    }

    return {
        tags: query(e, 'tags', {})
    };
}) satisfies PageLoad;