import type { Config } from '@sveltejs/adapter-vercel';
import { config as pconfig, db } from "$lib/db"
import { sql } from "kysely"
import { createCaller } from '$lib/trpc/router';
export const config: Config = {
    runtime: "edge",
    //   external: ["twitter-api-v2"]
}

// const c = new Client(pconfig)
export const load = async (event) => {
    console.time("load");
    //  const books  = "test";
    // const {rows} = await c.execute("SELECT * FROM Entry WHERE type = 'book' limit 1;");
    // const session = await locals.validate();
    // console.log({ session })
    // if (!session) {
    //     return {
    //         entries: []
    //     }
    // }
    // const userId = 'kvDQosqGkyqwGwo'
    // const entries = db
    //     .selectFrom("Bookmark as b")
    //     .innerJoin("Entry as e", "e.id", "b.entryId")
    //     .innerJoin("State as s", "s.id", "b.stateId")
    //     .leftJoin("EntryInteraction as i", (j) => j.onRef("i.entryId", "=", "e.id").on("i.userId", "=", userId))
    //     .select(["e.id", "e.image", "e.published", "e.title", "e.author", "e.uri", "i.progress", "s.name as state", sql<string>`(select count(a.id) from Annotation a where a.entryId = e.id)`.as("annotations"), sql<string>`(select count(r.id) from Relation r where r.entryId = e.id or r.relatedEntryId = e.id)`.as("relations")])
    //     // .where("s.type", "=", "later")
    //     .where("b.userId", "=", userId)
    //     .where("s.type", "=", "inbox")
    //     .orderBy("b.createdAt", "desc")
    //     .limit(10)
    //     .execute();
    // console.timeEnd("load");
    const caller = await createCaller(event);
    const entries = await caller.entries.listBookmarks({
        location: "inbox"
    })
    return {
        entries
    }
}
