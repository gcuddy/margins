import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { t } from "$lib/trpc/t";

import { createContext } from "./context";
import { annotationRouter } from "./routes/annotations";
import { bookmarks } from "./routes/bookmarks";
import { booksRouter } from "./routes/books";
import { collectionsRouter } from "./routes/collections";
import { entriesRouter } from "./routes/entries";
import { favoritesRouter } from "./routes/favorites";
import { filterRouter } from "./routes/filters";
import { logRouter } from "./routes/log";
import { moviesRouter } from "./routes/movies";
import { musicRouter } from "./routes/music";
import { podcastsRouter } from "./routes/podcasts";
import { publicRouter } from "./routes/public";
import { subscriptions } from "./routes/subscriptions";
import { userRouter } from "./routes/user";


export const appRouter = t.router({
    entries: entriesRouter,
    bookmarks,
    public: publicRouter,
    subscriptions,
    user: userRouter,
    filters: filterRouter,
    annotations: annotationRouter,
    collections: collectionsRouter,
    podcasts: podcastsRouter,
    books: booksRouter,
    movies: moviesRouter,
    music: musicRouter,
    favorites: favoritesRouter,
    log: logRouter,
});

export type Router = typeof appRouter;

export const createCaller = async (evt: Parameters<typeof createContext>[0]) => {
    return appRouter.createCaller(await createContext(evt));
};

// 👇 type helpers 💡
export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
