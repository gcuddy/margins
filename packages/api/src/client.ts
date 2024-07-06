import { SearchBooks } from "./schema.js"
import { client } from "../../features/rpc/rpc-client.js"
import { Effect, Console } from "effect"
export let link: string

// const a = client(
//   new GetLink({
//     url: URL("https://www.ft.com/content/46d8bd13-1be1-4c59-8be7-d30f9d756d92"),
//   }),
// ).pipe(Effect.tap(Console.log), Effect.runFork)

client(
  new SearchBooks({
    query: "The Great Gatsby",
  }),
).pipe(
  Effect.tap(Console.log),
  Effect.tapError(Effect.logError),
  Effect.runFork,
)
