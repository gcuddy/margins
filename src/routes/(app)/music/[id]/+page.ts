import type { PageLoad } from './$types';

export const load = (async (e) => {
    return {
        id: e.params.id
    };
}) satisfies PageLoad;
