import { lucia } from 'lucia';
// import "lucia-auth/polyfill/node";
import { planetscale } from "@lucia-auth/adapter-mysql";

import { dev } from '$app/environment';
import { sveltekit } from "lucia/middleware";

// import { db } from '$lib/db';
// import kysely from "$lib/auth/kysley-pscale-adapter";
import { connect } from "@planetscale/database";
import { db, config } from "$lib/db";

const connection = connect(config);

export const auth = lucia({
    // TODO: type error here?
    adapter: planetscale(connection, {
        user: "auth_user",
        key: "auth_key",
		session: "auth_session"
    }),
    // adapter: {
    //     user: kysely(db),
    //     session: redisSessionAdapter({
    //         // Is this allowed? Do I need to create two sep clients or can upstash redis handle this?
    //         session: redis,
    //         userSession: redis
    //     })
    // },
    env: dev ? 'DEV' : 'PROD',
    middleware: sveltekit(),
    sessionCookie: {
        expires: false
    },
    getUserAttributes: (userData) => {
        return {
            email: userData.email,
            username: userData.username,
            userId: userData.id,
            // default_state_id: userData.default_state_id,
            // home_items: userData.home_items as string[],
            avatar: userData.avatar
        };
    },

    // TODO: sessioncookie, etc
});
export type Auth = typeof auth;
