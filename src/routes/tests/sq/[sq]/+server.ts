// RSS Router

import { mutationctx, queryctx } from '$lib/utils/server';
import { error, json } from '@sveltejs/kit';
import { queries, mutations } from '../../(app2)/queries.server'
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
    console.time(`[sq] ${sq}`)
    console.log(`running sq ${sq}`, new Date())
    const params = await queryctx(event, query.schema)
    const result = await query.fn(params);
    if (query.headers) {
        console.log(`setting headers for ${event.url.toString()}`)
        event.setHeaders(query.headers)
    }
console.dir({ result }, { depth: null })
    console.timeEnd(`[sq] ${sq}`)
    return json(result)
})


export const POST: RequestHandler = (async (event) => {
    const sq = event.params.sq
    // fn should be key of queries
    if (!sq) {
        throw error(400, "sq is required");
    }
    if (!(sq in mutations)) {
        throw error(400, "sq is not valid");
    }
    const mutation = mutations[sq as keyof typeof mutations];
    const params = await mutationctx(event, mutation.schema)
    return json(await mutation.fn(params))
})
