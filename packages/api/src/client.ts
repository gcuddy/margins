import { GetOpenLibraryAuthor } from "./schema.js"
import { client } from "../../features/rpc/rpc-client.js"
import { Effect, Console } from "effect"
import { OpenLibraryKey } from "./integrations/openlibrary.js"
export let link: string

// const a = client(
//   new GetLink({
//     url: URL("https://www.ft.com/content/46d8bd13-1be1-4c59-8be7-d30f9d756d92"),
//   }),
// ).pipe(Effect.tap(Console.log), Effect.runFork)

client(
  new GetOpenLibraryAuthor({
    key: OpenLibraryKey("OL5358901A"),
  }),
).pipe(
  Effect.tap(Console.log),
  Effect.tapError(Effect.logError),
  Effect.runFork,
)
