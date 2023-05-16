import lucia from 'lucia-auth';

import { dev } from '$app/environment';
// import { db } from '$lib/db';
import kysely from "$lib/auth/kysley-pscale-adapter";
import { db } from "$lib/db";
export const auth = lucia({
    // TODO: type error here?
    adapter: kysely(db),
    // adapter: {
    //     user: kysely(db),
    //     session: redisSessionAdapter({
    //         // Is this allowed? Do I need to create two sep clients or can upstash redis handle this?
    //         session: redis,
    //         userSession: redis
    //     })
    // },
    env: dev ? 'DEV' : 'PROD',
    transformUserData: (userData) => {
        console.log({ userData })
        return {
            email: userData.email,
            username: userData.username,
            default_state_id: userData.default_state_id,
            userId: userData.id,
            home_items: userData.home_items as string[]
        };
    },
});
export type Auth = typeof auth;
