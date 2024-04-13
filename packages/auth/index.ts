import { Lucia, TimeSpan } from 'lucia';
import { PlanetScaleAdapter } from '@lucia-auth/adapter-mysql';
import {
	Client,
	type Config as PlanetScaleConfig,
} from '@planetscale/database';
import type { User } from '@margins/db/kysely/types';

export * as oauth from './oauth.js';

export const createAuth = (config: PlanetScaleConfig, dev = false) => {
	// TODO: write adapter that uses existing connection?
	const client = new Client(config);
	const adapter = new PlanetScaleAdapter(client, {
		session: 'user_session',
		user: 'user',
	});
	const auth = new Lucia(adapter, {
		getUserAttributes: (userData) => {
			return {
				avatar: userData.avatar,
				email: userData.email,
				emailVerified: Boolean(userData.email_verified),
				userId: userData.id,
				username: userData.username,
			};
		},
		sessionCookie: {
			// session cookies have very long lifespan (2 years)
			attributes: {
				secure: dev,
			},

			expires: false,
			name: 'session',
		},
		sessionExpiresIn: new TimeSpan(30, 'd'),
	});
	return auth;
};

declare module 'lucia' {
	interface Register {
		// DatabaseSessionAttributes: DatabaseSessionAttributes;
		DatabaseUserAttributes: User;
		Lucia: ReturnType<typeof createAuth>;
	}
}
