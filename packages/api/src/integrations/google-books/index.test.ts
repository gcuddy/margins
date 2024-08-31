import { Effect } from "effect"
import { expect, it } from "vitest"

import { program } from "."
import { GoogleBooksApi } from "./google-books"

const mainTest = program.pipe(Effect.provide(GoogleBooksApi.Live))

it("should return a list of books", async () => {
  const result = await Effect.runPromise(mainTest)
  console.log("result", result)
  expect(result).toBeDefined()
})
