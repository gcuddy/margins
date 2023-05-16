import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { query } from '$lib/queries/query';

export const load = (async (e) => {
    const { parent } = e;
    console.log({ browser })
    if (browser) {
        const { entries_state, lists_state } = await parent();
        const lists = get(lists_state);

        const list = lists.get(['tags', e.params.name]);

        console.log({ list })
        if (list) {
            const entries = get(entries_state);
            // list refers to id[] of entries
            const tags = list.map(id => entries.get(id)).filter(Boolean)
            return {
                tags
            }
        } else {
            // fetch and init
            const tags = await query(e, 'entries_by_tag', {
                name: e.params.name
            })
            lists_state.update_list(['tags', e.params.name], tags.entries.map(e => e.id));
            return {
                tags: tags.entries
            }
        }

    }

    return {
        tags: query(e, 'entries_by_tag', {
            name: e.params.name
        }).then(tags => tags.entries),

    };
}) satisfies PageLoad;