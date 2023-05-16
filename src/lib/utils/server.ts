import { type RequestEvent, error } from "@sveltejs/kit";
import { parse } from "devalue";
import type { z } from "zod";

export async function queryctx<T extends z.ZodTypeAny>(req: RequestEvent, schema?: T): Promise<{
    input: z.infer<T>;
    ctx: {
        userId: string;
    };
}> {
    const { url, locals } = req;
    let userId = url.searchParams.get("userId");
    if (!userId) {
        const session = await locals.validate();
        if (!session) {
            throw error(401);
        }
        userId = session.userId;
    }
    if (!schema) {
        return {
            input: null,
            ctx: {
                userId
            }
        }
    }
    const input = url.searchParams.get("input");
    console.log({ input }) 
    if (!input) {
        console.warn("Provided schema but missing input");
        return {
            input: null,
            ctx: {
                userId
            }
        }
        // throw error(400, "Missing input");
    }
    const data = parse(input) as unknown;
    console.dir({ data }, { depth: null });
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
        throw error(400, "Data doesn't match schema");
    }
    return {
        input: parsed.data as z.infer<T>,
        ctx: {
            userId
        }
    };
}

export async function mutationctx<T extends z.ZodTypeAny>(req: RequestEvent, schema?: T): Promise<{
    input: z.infer<T>;
    ctx: {
        userId: string;
    };
}> {
    const raw = await req.request.text();
    const data = parse(raw);
    const { locals } = req;
    let { userId, input } = data;
    if (!userId) {
        const session = await locals.validate();
        if (!session) {
            throw error(401);
        }
        userId = session.userId;
    }
    if (!schema) {
        return {
            input: null,
            ctx: {
                userId
            }
        }
    }
    if (!input) {
        console.warn("Provided schema but missing input");
        return {
            input: null,
            ctx: {
                userId
            }
        }
        // throw error(400, "Missing input");
    }
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
        throw error(400, "Data doesn't match schema");
    }
    return {
        input: parsed.data,
        ctx: {
            userId
        }
    };
}
