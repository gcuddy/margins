import { Effect } from "effect"
import { GoogleBooksApi } from "./google-books.js"

export const program = Effect.gen(function* () {
  const googleBooksApi = yield* GoogleBooksApi
  return yield* googleBooksApi.search("the great gatsby")
})
