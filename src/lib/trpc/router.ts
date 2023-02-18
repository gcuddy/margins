import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import nlp from "compromise";
import { z } from "zod";

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
    favorites: favoritesRouter,
    log: logRouter,
    nlp: t.procedure.input(z.object({
        entryId: z.number()
    })).query(async ({ input, ctx }) => {
        const entry = await ctx.prisma.entry.findUnique({
            where: {
                id: input.entryId
            }
        });
        if (!entry || !entry.text) {
            return {};
        }
        const doc = nlp(entry.text);
        return doc.topics().json();
    })
});

export type Router = typeof appRouter;

export const createCaller = async (evt: Parameters<typeof createContext>[0]) => {
    return appRouter.createCaller(await createContext(evt));
};

// 👇 type helpers 💡
export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
