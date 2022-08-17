import lucia from 'lucia-sveltekit';
import prisma from '@lucia-sveltekit/adapter-prisma';
import { dev } from '$app/env';
import { db } from '$lib/db';

export const auth = lucia({
	adapter: prisma(db),
	secret: 'aWmJoT0gOdjh2-Zc2Zv3BTErb29qQNWEunlj',
	env: dev ? 'DEV' : 'PROD'
});
