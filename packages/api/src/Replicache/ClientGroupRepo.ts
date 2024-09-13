import { Model } from "@effect/sql"
import { Cache, Context, Effect, Layer, Option, pipe } from "effect"
import type { ReplicacheClientGroupId } from "../Domain/Replicache.js"
import { ReplicacheClientGroup } from "../Domain/Replicache.js"
import { SqlLive } from "../Sql.js"

export const make = Effect.gen(function* () {
  const repo = yield* Model.makeRepository(ReplicacheClientGroup, {
    tableName: "replicache_client_group",
    spanPrefix: "ReplicacheClientGroupRepo",
    idColumn: "id",
  })

  return { ...repo } as const
})
export class ReplicacheClientGroupRepo extends Context.Tag(
  "Replicache/ClientGroupRepo",
)<ReplicacheClientGroupRepo, Effect.Effect.Success<typeof make>>() {
  static Live = Layer.effect(ReplicacheClientGroupRepo, make).pipe(
    Layer.provide(SqlLive),
  )
}
