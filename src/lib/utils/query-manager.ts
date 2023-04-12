import { query } from "$lib/utils/client";
import { fetchRss } from "@/src/routes/tests/(app2)/rss/fetch.server"
import type { RequestEvent } from "@sveltejs/kit";
import type { z } from "zod";

export function createQueryManager() {

}

const map = new Map<string, () => any>()


// could this just be handled by hooks instead?
const queries = {
    list_rss: {
        endpoint: "/tests/rss",
        fn: fetchRss,
    }
} as const;

type InputFn = <T extends z.ZodTypeAny>(schema: T) => T;


type Procedure = {
    input: InputFn;
}

const procedure: Procedure = {
    input: () => {

    },
    // query: () => {

    // }
}

procedure.input(z.string().optional())



const app: Router = {
    rss: ({ input, ctx }) => {
        fetchRss({ input, ctx })
    }
}


type Router = {
    [key: string]: (input: any, ctx: any) => any
}

export const sq = (init?: RequestEvent, ctx?: {
    userId?: string | null;
}) => {
    // return an object with all the queries, where calling them calls our query helper function fully typed
    return Object.fromEntries(Object.entries(queries).map(([key, value]) => {
        return [
            key,
            (data: any) => {
                return query<typeof value.fn>(value.endpoint, data, {
                    fetcher: fetch,
                    userId: ctx?.userId,
                })
            }
        ]
    }))
}