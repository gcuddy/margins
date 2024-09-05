import { Model } from "@effect/sql"
import type { Effect } from "effect"
import { Cache, Context, Layer } from "effect"
import { ReplicacheClient } from "../Domain/Replicache.js"
import { SqlLive } from "../Sql.js"

export const make = Model.makeRepository(ReplicacheClient, {
  tableName: "replicache_client",
  spanPrefix: "ReplicacheClientRepo",
  idColumn: "id",
})
export class ReplicacheClientRepo extends Context.Tag("Replicache/ClientRepo")<
  ReplicacheClientRepo,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(ReplicacheClientRepo, make).pipe(
    Layer.provide(SqlLive),
  )
}
