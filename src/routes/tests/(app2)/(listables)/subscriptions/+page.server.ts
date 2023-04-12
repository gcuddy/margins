import { handleLoginRedirect } from '$lib/utils/redirects';
import { ServerLoadEvent, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { fetchRss, inputSchema } from './fetch.server';


function cacher(key: string, fn: () => any, event: ServerLoadEvent) {
    if (!event.locals.map) {
        event.locals.map = new Map();
    }
    console.log('entries', event.locals.map?.entries())
    if (!event.locals.map.has(key)) {
        event.locals.map.set(key, fn());
    }
    return event.locals.map.get(key);
}

export const load = async (event) => {
    console.log('datarequerst', event.isDataRequest);

    const session = await event.locals.validate();
    console.log("locals", event.locals)
    if (!session) {
        throw redirect(302, handleLoginRedirect(event))
    }
    const form = superValidate(event, inputSchema);

    // console.log(`cacher`, cacher('rss', () => fetchRss({ take: 25, userId: session.userId }), event))
    return {
        feeds: fetchRss({ take: 25, userId: session.userId }),
        form,
        userId: session.userId,
    }
}

// actions
export const actions = {
    fetchMore: async (event) => {
        // fetch more
        const session = await event.locals.validate();
        if (!session) {
            throw redirect(307, "/login")
        }
        const form = await superValidate(event, inputSchema);
        if (!form.valid) return fail(400, { form });
        const { cursor } = form.data;
        return fetchRss({ take: 25, cursor, userId: session.userId })
    }
}