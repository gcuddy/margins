import { Model } from "@effect/sql"
import { Context, Effect, Layer } from "effect"
import { User } from "../Domain/User.js"
import { SqlLive } from "../Sql"

export const make = Effect.gen(function* () {
  const repo = yield* Model.makeRepository(User, {
    tableName: "user",
    spanPrefix: "UserRepo",
    idColumn: "id",
  })

  return {
    ...repo,
  } as const
})

export class UserRepo extends Context.Tag("Users/Repo")<
  UserRepo,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(UserRepo, make).pipe(Layer.provide(SqlLive))
}
