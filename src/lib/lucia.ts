import lucia from 'lucia-sveltekit';
import prisma from '@lucia-sveltekit/adapter-prisma';
import { dev } from '$app/environment';
import { db } from '$lib/db';

export const auth = lucia({
	adapter: prisma(db),
	secret: import.meta.env.VITE_LUCIA_SECRET,
	env: dev ? 'DEV' : 'PROD',
});
