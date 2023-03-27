import { createContext } from '$lib/trpc/context';
import { appRouter, createCaller } from '$lib/trpc/router';
import { error } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import type { Config } from '@sveltejs/adapter-vercel';

export const load = async (event) => {
    const caller = await createCaller(event);
    const subscriptions = await caller.subscriptions.list();
    return { subscriptions };
};
