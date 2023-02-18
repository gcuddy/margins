import type { PageLoad } from './$types';
import { logQuery } from './query';




export const load = (async (e) => {
    const { queryClient } = await e.parent();
    const logs = await queryClient.ensureQueryData(logQuery(e));
    return {
        logs
    };
}) satisfies PageLoad;