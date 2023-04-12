// RSS Router

import { queryctx } from '$lib/utils/server';
import { error, json } from '@sveltejs/kit';
import { queries } from '../../(app2)/queries.server'
import type { RequestHandler } from './$types';

// Generalize this

export const GET: RequestHandler = (async (event) => {
    const sq = event.params.sq
    // fn should be key of queries
    if (!sq) {
        throw error(400, "sq is required");
    }
    if (!(sq in queries)) {
        throw error(400, "sq is not valid");
    }
    const query = queries[sq as keyof typeof queries];
    const params = await queryctx(event, query.schema)
    return json(await query.fn(params))
})