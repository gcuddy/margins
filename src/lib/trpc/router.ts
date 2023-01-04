
import { bookmarks } from './routes/bookmarks';
import { entries } from './routes/entries';
import { publicRouter } from './routes/public';
import { subscriptions } from './routes/subscriptions';
import { user } from './routes/user';
import { router } from '$lib/trpc/t';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { createContext } from './context';

export const appRouter = router({
	entries,
	bookmarks,
	public: publicRouter,
	subscriptions,
	user
});

export type Router = typeof appRouter;

export const createCaller = async (evt: (Parameters<typeof createContext>)[0]) => {
	return appRouter.createCaller(await createContext(evt))
}


// 👇 type helpers 💡
export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
