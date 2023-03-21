import type { Config } from '@sveltejs/adapter-vercel';
import { db } from "$lib/db"
export const config: Config = {
  runtime: "edge",
//   external: ["twitter-api-v2"]
}

export const load = async () => {
  console.time("load");
//  const books  = "test";
  const books = await db
    .selectFrom("Entry")
    .selectAll()
    .where("type", "=", "book")
    .execute();
  console.timeEnd("load");
  return {
    books
  }
}
