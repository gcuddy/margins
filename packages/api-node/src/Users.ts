import { SqlClient } from "@effect/sql"
import {
  DateTime,
  Duration,
  Effect,
  Layer,
  Option,
  pipe,
  Redacted,
} from "effect"
import { UserRepo } from "./Users/Repo.js"
import { CurrentUser, UserId } from "./Domain/User.js"
import { SqlLive } from "./Sql.js"
import { HttpApiBuilder } from "@effect/platform"
import { security } from "./Api/Security.js"
import {
  Session,
  SessionId,
  sessionIdFromRedacted,
  sessionIdFromString,
  SessionWithMetadata,
} from "./Domain/Session.js"
import { policyRequire, Unauthorized } from "./Domain/Actor.js"
import { SessionRepo } from "./Users/SessionRepo.js"
import { Nanoid } from "./Nanoid.js"

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient
  const userRepo = yield* UserRepo
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
        ),
      ),
    )

  const httpSecurity = HttpApiBuilder.middlewareSecurity(
    security,
    CurrentUser,
    token =>
      Effect.gen(function* () {
        const sessionId = sessionIdFromRedacted(token)
        const [user, session] =
          yield *
          Effect.zip(
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
        const isPast = yield * DateTime.isPast(session.value.expires_at)
        if (Option.isNone(user) || isPast) {
          yield * sessionRepo.delete(session.value.id)
          return (
            yield *
            new Unauthorized({
              actorId: UserId.make("-1"),
              entity: "User",
              action: "read",
            })
          )
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
                  user_id: newSession.user_id,
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
    findUserBySessionId,
    httpSecurity,
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
    Layer.provide(UserRepo.Live),
    Layer.provide(SessionRepo.Live),
    Layer.provide(Nanoid.Live),
    // Layer.provide(Uuid.Live),
  )

  //   static Test = this.layer.pipe(
  //     Layer.provideMerge(SqlTest),
  //     Layer.provideMerge(Uuid.Test),
  //   )
}
