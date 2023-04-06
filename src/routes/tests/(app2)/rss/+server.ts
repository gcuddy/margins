import { inputSchema, fetchRss } from './fetch.server';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { parse } from 'devalue';

// Generalize this

export const GET: RequestHandler = async ({ request, url, locals }) => {
    const session = await locals.validate();
    if (!session) {
        throw error(401);
    }
    const input = url.searchParams.get("input");
    if (!input) {
        throw error(400);
    }
    const data = parse(input);
    console.log({ data });
    const parsed = inputSchema.omit({
        userId: true
    }).safeParse(data);
    if (!parsed.success) {
        throw error(400);
    }
    return json(await fetchRss({
        ...parsed.data,
        userId: session.userId
    }))
};