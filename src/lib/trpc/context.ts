// lib/trpc/context.ts
import type { RequestEvent } from "@sveltejs/kit";
import type { inferAsyncReturnType } from "@trpc/server";

import { db } from "$lib/db";
import { redis } from "$lib/redis";

export async function createContext(event: RequestEvent) {
    console.log(`createContext()`)
    const { session, user } = await event.locals.validateUser();
    return {
        session,
        userId: session?.userId || "",
        db,
        user,
        redis
    };
}

export type Context = inferAsyncReturnType<typeof createContext>;
