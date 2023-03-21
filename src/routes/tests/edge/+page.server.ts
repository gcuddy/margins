import type { Config } from '@sveltejs/adapter-vercel';
import { config as pconfig, db } from "$lib/db"
export const config: Config = {
    runtime: "edge",
    //   external: ["twitter-api-v2"]
}

// const c = new Client(pconfig)
export const load = async ({ locals }) => {
    console.time("load");
    //  const books  = "test";

    // const {rows} = await c.execute("SELECT * FROM Entry WHERE type = 'book' limit 1;");
    const session = await locals.validate();
    if (!session) {
        return {
            books: null
        }
    }
    const books = await db
        .selectFrom("Bookmark as b")
        .innerJoin("Entry as e", "e.id", "b.entryId")
        .innerJoin("State as s", "s.id", "b.stateId")
        .leftJoin("Annotation as a", "a.entryId", "e.id")
        .select(["e.id", "e.title", "e.author", "e.uri", "a.contentData as annotation"])
        .where("s.type", "=", "later")
        .where("b.userId", "=", session.userId)
        .limit(10)
        .execute();
    console.timeEnd("load");
    return {
        books
    }
}
