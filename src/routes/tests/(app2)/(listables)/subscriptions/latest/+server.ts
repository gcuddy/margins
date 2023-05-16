import { queryctx } from '$lib/utils/server';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fetchRss, inputSchema } from './fetch.server';

// Generalize this

export const GET = (async (event) => {
    const { input, ctx } = await queryctx(event, inputSchema.omit({
        userId: true
    }))
    return json(await fetchRss({ ...input, userId: ctx.userId }))
}) satisfies RequestHandler;