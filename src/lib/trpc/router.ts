
import { bookmarks } from './routes/bookmarks';
import { entries } from './routes/entries';
import { parser } from './routes/parse';
import { t } from '$lib/trpc/t';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const router = t.router({
	entries,
	bookmarks,
	parser
});

export type Router = typeof router;


// 👇 type helpers 💡
export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
