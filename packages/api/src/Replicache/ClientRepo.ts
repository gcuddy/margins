import { Model, SqlClient, SqlSchema } from "@effect/sql"
import { Effect } from "effect"
import { Cache, Context, Layer } from "effect"
import {
  ReplicacheClient,
  ReplicacheClientGroupId,
  SearchResult,
} from "../Domain/Replicache.js"
import { SqlLive } from "../Sql.js"
import { Schema } from "@effect/schema"

export const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient
  const repo = Model.makeRepository(ReplicacheClient, {
    tableName: "replicache_client",
    spanPrefix: "ReplicacheClientRepo",
    idColumn: "id",
  })

  const searchForClientGroup = SqlSchema.findAll({
    Request: ReplicacheClientGroupId,
    Result: SearchResult,
    // Result: ReplicacheClient.pipe(Schema.pick("id", "lastMutationID")),
    execute: clientGroupId =>
      sql`select id, lastMutationId as rowversion from replicache_client where clientGroupID = ${clientGroupId}`,
  })

  return {
    ...repo,
    searchForClientGroup,
  }
})
export class ReplicacheClientRepo extends Context.Tag("Replicache/ClientRepo")<
  ReplicacheClientRepo,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(ReplicacheClientRepo, make).pipe(
    Layer.provide(SqlLive),
  )
}
