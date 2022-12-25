
import { bookmarks } from './routes/bookmarks';
import { entries } from './routes/entries';
import { publicParse } from './routes/publicParse';
import { subscriptions } from './routes/subscriptions';
import { user } from './routes/user';
import { t } from '$lib/trpc/t';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const router = t.router({
	entries,
	bookmarks,
	publicParse,
	subscriptions,
	user
});

export type Router = typeof router;


// 👇 type helpers 💡
export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
