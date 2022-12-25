import { error } from '@sveltejs/kit';
import type { PageServerLoad } from "./$types";
import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';

export const load: PageServerLoad = async (event) => {
    const { params, locals } = event;
    const { session, user } = await locals.validateUser();
    if (user && user.username === params.username) {
        const subscriptions = await router.createCaller(await createContext(event)).subscriptions.list()
        return { subscriptions, user };
    } else {
        throw error(401, 'Not authorized');
    }

}