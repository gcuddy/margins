import { SqlClient } from "@effect/sql"
import { DateTime, Duration, Effect, Layer, Option, pipe } from "effect"
import { UserRepo } from "./Users/Repo.js"
import { CurrentUser, UserId } from "./Domain/User.js"
import { SqlLive } from "./Sql.js"
import { HttpApiBuilder } from "@effect/platform"
import { security } from "./Api/Security.js"
import {
  Session,
  sessionIdFromRedacted,
  SessionWithMetadata,
} from "./Domain/Session.js"
import { Unauthorized } from "./Domain/Actor.js"
import { SessionRepo } from "./Users/SessionRepo.js"

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient
  const userRepo = yield* UserRepo
  const sessionRepo = yield * SessionRepo

  const findUserById = (id: UserId) =>
    pipe(
      userRepo.findById(id),
      Effect.withSpan("Accounts.findUserById", {
        attributes: { id },
      }),
      //   policyRequire("User", "read"),
    )

  const httpSecurity = HttpApiBuilder.middlewareSecurity(
    security,
    CurrentUser,
    token =>
      Effect.gen(function* () {
        const sessionId = sessionIdFromRedacted(token)
        const [user, session] = yield* Effect.zip(
          userRepo.findBySessionId(sessionId),
          userRepo.findSessionById(sessionId),
          {
            concurrent: true,
          },
        )
        // TODO: refactor into pipe and remove repetitive code
        if (Option.isNone(session)) {
          return yield* new Unauthorized({
            actorId: UserId.make("-1"),
            entity: "User",
            action: "read",
          })
        }
        if (Option.isNone(user) || DateTime.isPast(session.value.expires_at)) {
          yield* sessionRepo.delete(session.value.id)
          return yield* new Unauthorized({
            actorId: UserId.make("-1"),
            entity: "User",
            action: "read",
          })
        }
        const sessionExpiresIn = Duration.days(30)
        const activePeriodExpirationDate = session.value.expires_at.pipe(
          DateTime.subtractDuration(
            sessionExpiresIn.pipe(Duration.unsafeDivide(2)),
          ),
        )
        const _newSession = Effect.if(
          DateTime.isPast(activePeriodExpirationDate),
          {
            onTrue: () =>
              Effect.gen(function* () {
                const newSession = SessionWithMetadata.make({
                  ...session.value,
                  fresh: true,
                  expires_at: session.value.expires_at.pipe(
                    DateTime.addDuration(sessionExpiresIn),
                  ),
                })
                yield* sessionRepo.updateVoid({
                  id: newSession.id,
                  expires_at: newSession.expires_at,
                })
                return newSession
              }),
            onFalse: () =>
              Effect.succeed(SessionWithMetadata.make(session.value)),
          },
        )
        return user.value
      }).pipe(Effect.withSpan("Users.httpSecurity")),

    // Pipe way:
    // userRepo.findBySessionId(sessionIdFromRedacted(token)).pipe(
    //   Effect.flatMap(
    //     Option.match({
    //       onNone: () =>
    //         new Unauthorized({
    //           actorId: UserId.make("-1"),
    //           entity: "User",
    //           action: "read",
    //         }),
    //       onSome: Effect.succeed,
    //     }),
    //   ),
    //   // TODO: handle session expiration dates
    //   Effect.andThen(([user]) => user),
    //   Effect.withSpan("Accounts.httpSecurity"),
    // ),
  )

  return {
    findUserById,
    httpSecurity,
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
    Layer.provide(SessionRepo.Live),
    // Layer.provide(Uuid.Live),
  )

  //   static Test = this.layer.pipe(
  //     Layer.provideMerge(SqlTest),
  //     Layer.provideMerge(Uuid.Test),
  //   )
}
