import { Model, SqlClient, SqlResolver, SqlSchema } from "@effect/sql"
import { Context, Effect, Layer } from "effect"
import { Entry, EntryId } from "../Domain/Entry"
import { SqlLive } from "../Sql"
import { UserId } from "../Domain/User"
import { Schema } from "@effect/schema"
import { SearchResult } from "../Domain/Replicache"

export const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient

  const repo = yield* Model.makeRepository(Entry, {
    tableName: "Entry",
    spanPrefix: "EntriesRepo",
    idColumn: "id",
  })
  //   TODO: better name
  const searchForUserId = SqlSchema.findAll({
    Request: UserId,
    // Result: Entry.pipe(Schema.pick("id", "updatedAt")),
    Result: SearchResult,
    //TODO: maybe use kysely here?
    execute: userId =>
      // Soemthing like this?
      sql`select id, updatedAt as rowversion from Entry where id in (select entryId from Bookmark where userId = ${userId})`,
    //   sql`select id, updatedAt from Entry where userId = ${userId}`,
  })

  const getForIds = SqlSchema.findAll({
    Request: Schema.NonEmptyArray(EntryId),
    Result: Entry,
    execute: ids => sql`select * from Entry where ${sql.in("id", ids)}`,
  })

  return {
    ...repo,
    searchForUserId,
    getForIds,
  } as const
})

export class EntriesRepo extends Context.Tag("Entries/Repo")<
  EntriesRepo,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(EntriesRepo, make).pipe(Layer.provide(SqlLive))
}
