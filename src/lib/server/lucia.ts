import prisma from '@lucia-auth/adapter-prisma';
import lucia from 'lucia-auth';

import { dev } from '$app/environment';
import { db } from '$lib/db';

export const auth = lucia({
	adapter: prisma(db),
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
