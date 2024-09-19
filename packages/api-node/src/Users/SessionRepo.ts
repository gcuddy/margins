import { Model } from "@effect/sql"
import { Session } from "../Domain/Session.js"
import { Context, Effect, Layer } from "effect"
import { SqlLive } from "../Sql.js"

export const make = Model.makeRepository(Session, {
  tableName: "user_session",
  idColumn: "id",
  spanPrefix: "SessionRepo",
})

export class SessionRepo extends Context.Tag("Users/SessionRepo")<
  SessionRepo,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(SessionRepo, make).pipe(Layer.provide(SqlLive))
}
