import { createCachedValue } from '$lib/cache';
import type { PageLoad } from './$types';
import { createSubscriptionStore } from './store';

export const load = (async (event) => {
    return {
        subscriptionStore: createCachedValue("subscriptions", () => createSubscriptionStore(event.fetch, {}))
    };
}) satisfies PageLoad;