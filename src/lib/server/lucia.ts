import prisma from '@lucia-auth/adapter-prisma';
import lucia from 'lucia-auth';

import { dev } from '$app/environment';
import { db } from '$lib/db';
import { redis, redisSessionAdapter } from '$lib/redis';

export const auth = lucia({
     // TODO: type error here?
	adapter: {
        user: prisma(db),
        session: redisSessionAdapter({
            // Is this allowed? Do I need to create two sep clients or can upstash redis handle this?
            session: redis,
            userSession: redis
        })
    },
	env: dev ? 'DEV' : 'PROD',
	transformUserData: (userData) => {
		return {
			email: userData.email,
			username: userData.username,
			default_state_id: userData.default_state_id,
			userId: userData.id,
		};
	},
});
export type Auth = typeof auth;
