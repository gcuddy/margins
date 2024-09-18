import { SqlClient } from "@effect/sql"
import { Effect, Layer, pipe } from "effect"
import { UserRepo } from "./Users/Repo.js"
import { UserId } from "./Domain/User.js"
import { SqlLive } from "./Sql.js"

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient
  const userRepo = yield* UserRepo

  const findUserById = (id: UserId) =>
    pipe(
      userRepo.findById(id),
      Effect.withSpan("Accounts.findUserById", {
        attributes: { id },
      }),
      //   policyRequire("User", "read"),
    )

  return {
    findUserById,
  } as const
})

// or rename accounts?
export class Users extends Effect.Tag("Users")<
  Users,
  Effect.Effect.Success<typeof make>
>() {
  static layer = Layer.effect(Users, make)

  static Live = this.layer.pipe(
    Layer.provide(SqlLive),
    // Layer.provide(AccountsRepo.Live),
    Layer.provide(UserRepo.Live),
    // Layer.provide(Uuid.Live),
  )

  //   static Test = this.layer.pipe(
  //     Layer.provideMerge(SqlTest),
  //     Layer.provideMerge(Uuid.Test),
  //   )
}
