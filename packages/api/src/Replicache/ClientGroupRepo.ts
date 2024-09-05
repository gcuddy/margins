import { Model } from "@effect/sql"
import type { Effect } from "effect"
import { Cache, Context, Layer } from "effect"
import { ReplicacheClientGroup } from "../Domain/Replicache.js"
import { SqlLive } from "../Sql.js"

export const make = Model.makeRepository(ReplicacheClientGroup, {
  tableName: "replicache_client_group",
  spanPrefix: "ReplicacheClientGroupRepo",
  idColumn: "id",
})
export class ReplicacheClientGroupRepo extends Context.Tag(
  "Replicache/ClientGroupRepo",
)<ReplicacheClientGroupRepo, Effect.Effect.Success<typeof make>>() {
  static Live = Layer.effect(ReplicacheClientGroupRepo, make).pipe(
    Layer.provide(SqlLive),
  )
}
