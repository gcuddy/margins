import { SqlClient } from "@effect/sql"
import {
  DateTime,
  Duration,
  Effect,
  Layer,
  pipe,
} from "effect"
import { UsersRepo } from "./Users/Repo.js"
import type { UserId } from "./Domain/User.js";
import { SqlLive } from "./Sql.js"
import type {
  SessionId
} from "./Domain/Session.js";
import {
  sessionIdFromString,
} from "./Domain/Session.js"
import { policyRequire } from "./Domain/Actor.js"
import { SessionRepo } from "./Users/SessionRepo.js"
import { Nanoid } from "./Nanoid.js"

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient
  const userRepo = yield* UsersRepo
  const sessionRepo = yield* SessionRepo
  const nanoid = yield* Nanoid

  const findUserById = (id: UserId) =>
    pipe(
      userRepo.findById(id),
      Effect.tap(user => Effect.log("user", user)),
      Effect.withSpan("Accounts.findUserById", {
        attributes: { id },
      }),
      policyRequire("User", "read"),
    )

  const findUserBySessionId = (sessionId: SessionId) =>
    pipe(
      userRepo.findBySessionId(sessionId),
      Effect.withSpan("Accounts.findUserBySessionId", {
        attributes: { sessionId },
      }),
      policyRequire("User", "read"),
    )

  const createSession = (userId: UserId) =>
    pipe(
      nanoid.generateWithSize(40).pipe(Effect.map(sessionIdFromString)),
      Effect.tap(sessionId => Effect.log("sessionId", { sessionId, userId })),
      Effect.flatMap(sessionId =>
        // sheesh - should rewrite with do simulation or effect.gen
        Effect.flatMap(
          DateTime.now
            .pipe(
              Effect.map(now =>
                // 30 days from now - should be configurable
                now.pipe(DateTime.addDuration(Duration.days(30))),
              ),
            )
            .pipe(
              Effect.tap(expires_at => Effect.log("expires_at", expires_at)),
            ),
          expires_at =>
            sessionRepo.insert({
              id: sessionId,
              user_id: userId,
              expires_at,
            }),
        ).pipe(
          sql.withTransaction,
          Effect.orDie,
        )
      ),
    )

  return {
    findUserById,
    findUserBySessionId,
    createSession,
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
    Layer.provide(UsersRepo.Default),
    Layer.provide(SessionRepo.Live),
    Layer.provide(Nanoid.Live),
    // Layer.provide(Uuid.Live),
  )

  //   static Test = this.layer.pipe(
  //     Layer.provideMerge(SqlTest),
  //     Layer.provideMerge(Uuid.Test),
  //   )
}
