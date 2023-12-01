import { lucia } from 'lucia';
// import "lucia-auth/polyfill/node";
import { planetscale } from '@lucia-auth/adapter-mysql';

import { dev } from '$app/environment';
import { sveltekit } from 'lucia/middleware';

// import { db } from '$lib/db';
// import kysely from "$lib/auth/kysley-pscale-adapter";
import { config } from '$lib/db';
import { connect } from '@planetscale/database';

const connection = connect(config);

export const auth = lucia({
	// TODO: type error here?
	adapter: planetscale(connection, {
		user: 'auth_user',
		key: 'auth_key',
		session: 'auth_session',
	}),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	getUserAttributes: (userData) => {
		return {
			email: userData.email,
			username: userData.username,
			userId: userData.id,
			avatar: userData.avatar,
			emailVerified: Boolean(userData.email_verified),
			hypothesisApiKey: userData.hypothseis_api_key,
		};
	},
	experimental: {
		debugMode: true,
	},

	// TODO: sessioncookie, etc
});
export type Auth = typeof auth;
