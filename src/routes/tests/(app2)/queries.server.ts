import { z } from "zod";
import { db } from "$lib/db"

interface Query<I extends (z.ZodTypeAny | null), Data> {
    staleTime: number;
    fn: (args: {
        input: I extends z.ZodTypeAny ? z.infer<I> : undefined, ctx: {
            userId: string;
        }
    }) => Promise<Data>;
    schema?: I;
}

export const query = <I extends z.ZodTypeAny, Data>(args: Query<I, Data>) => args;


export const queries = ({
    tags: query({
        staleTime: 1000,
        fn: ({ input, ctx }) => {
            return db.selectFrom("Tag")
                .where("userId", "=", ctx.userId)
                .selectAll()
                .execute();
        },
    })
}) as const;

export const query_keys = Object.keys(queries) as (keyof typeof queries)[];


//usage $sq.tags // returns tags