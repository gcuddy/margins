import type { Config } from '@sveltejs/adapter-vercel';
import { db } from "$lib/pscale"
export const config: Config = {
  runtime: "edge",
//   external: ["twitter-api-v2"]
}

export const load = async () => {
  console.time("load");
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
