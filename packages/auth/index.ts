import dotenv from 'dotenv';
dotenv.config({
	path: '../../.env',
});

import { Lucia, TimeSpan } from 'lucia';
import { PlanetScaleAdapter } from '@lucia-auth/adapter-mysql';

import { Client } from '@planetscale/database';
import { config } from '@margins/db';
import type { User } from '@margins/db/kysely/types';

export * as oauth from './oauth';

const client = new Client(config);

const adapter = new PlanetScaleAdapter(client, {
	session: 'user_session',
	user: 'user',
});

export const auth = new Lucia(adapter, {
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
			secure: process.env.NODE_ENV === 'development' ? false : true,
		},

		expires: false,
		name: 'session',
	},
	sessionExpiresIn: new TimeSpan(30, 'd'),
});

declare module 'lucia' {
	interface Register {
		// DatabaseSessionAttributes: DatabaseSessionAttributes;
		DatabaseUserAttributes: User;
		Lucia: typeof auth;
	}
}
