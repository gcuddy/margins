import { GetLink, URL } from "./schema.js"
export let link: string
import { client } from "../../features/rpc/rpc-client.js"
import { Effect, Console } from "effect"

const a = client(
  new GetLink({
    url: URL("https://www.ft.com/content/46d8bd13-1be1-4c59-8be7-d30f9d756d92"),
  }),
).pipe(Effect.tap(Console.log), Effect.runFork)

// this works, but it doesn't work in browser...
