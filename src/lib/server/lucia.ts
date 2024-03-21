import { Lucia, TimeSpan } from 'lucia';
// import "lucia-auth/polyfill/node";
import { PlanetScaleAdapter } from '@lucia-auth/adapter-mysql';

import { dev } from '$app/environment';

// import { db } from '$lib/db';
// import kysely from "$lib/auth/kysley-pscale-adapter";
import { Client } from '@planetscale/database';
import { config } from '$lib/db';
import type { AuthUser } from '$lib/prisma/kysely/types';

const client = new Client(config);

const adapter = new PlanetScaleAdapter(client, {
	user: 'user',
	session: 'user_session',
});

export const auth = new Lucia(adapter, {
	// sessionCookie: {
	//     expires: false
	// },
	sessionCookie: {
		name: 'session',
		expires: false, // session cookies have very long lifespan (2 years)
		attributes: {
			secure: dev ? false : true,
		},
	},
	sessionExpiresIn: new TimeSpan(30, 'd'), // no more active/idle
	getUserAttributes: (userData) => {
		return {
			email: userData.email,
			username: userData.username,
			userId: userData.id,
			// default_state_id: userData.default_state_id,
			// home_items: userData.home_items as string[],
			avatar: userData.avatar,
			emailVerified: Boolean(userData.email_verified),
		};
	},
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof auth;
		// DatabaseSessionAttributes: DatabaseSessionAttributes;
		DatabaseUserAttributes: AuthUser;
	}
}
