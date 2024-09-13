import { Effect } from "effect"
import { EntriesRepo } from "./Entries/Repo"
import { SqlClient } from "@effect/sql"

const make = Effect.gen(function* () {
  const repo = yield* EntriesRepo
  const sql = yield* SqlClient.SqlClient

  const create = Effect.gen(function* () {
    const entry = yield* repo.insert({
      title: "New Entry",
      content: "New Entry Content",
    })
  })
})
