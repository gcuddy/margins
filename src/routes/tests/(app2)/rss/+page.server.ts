import { superValidate } from 'sveltekit-superforms/server';
import { fetchRss, inputSchema } from './fetch.server';
import { fail, redirect } from '@sveltejs/kit';

export const load = async (event) => {
    const session = await event.locals.validate();
    if (!session) {
        throw redirect(307, "/login?redirect" + event.url.pathname)
    }
    const form = superValidate(event, inputSchema);
    return {
        lazy: {
            // feeds: 
        },
        feeds: fetchRss({ take: 25, userId: session.userId }),
        form
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