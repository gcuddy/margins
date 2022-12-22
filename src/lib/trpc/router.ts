// lib/trpc/router.ts
import { initTRPC } from '@trpc/server';

import type { Context } from '$lib/trpc/context';

import { bookmarkRouter } from './routes/bookmarks';
import { entries } from './routes/entries';
import { parseRouter } from './routes/parse';

export const t = initTRPC.context<Context>().create();

export const router = t.router({
	entries,
	bookmarkRouter,
	parseRouter,
});

export type Router = typeof router;
