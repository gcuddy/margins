import { HttpApiBuilder } from "@effect/platform"
import { Api } from "../Api.js"
import { DateTime, Duration, Effect, Layer, Option, pipe, Redacted } from "effect"
import { Users } from "../Users.js"
import { UserId, UserNotFound, UserWithSensitive } from "../Domain/User.js"
import { policyUse, Unauthorized, withSystemActor } from "../Domain/Actor.js"
import { UsersPolicy } from "./Policy.js"
import { Authentication } from "./Api.js"
import { UsersRepo } from "./Repo.js"
import { sessionIdFromRedacted, SessionWithMetadata } from "../Domain/Session.js"
import { SessionRepo } from "./SessionRepo.js"

export const AuthenticationLive = Layer.effect(
  Authentication,
  Effect.gen(function* () {
    const userRepo = yield* UsersRepo
    const sessionRepo = yield* SessionRepo;


    return Authentication.of({
      bearer: token =>
        Effect.gen(function* () {
          const sessionId = sessionIdFromRedacted(token)
          const x = Redacted.value(sessionId)
          console.log({ x })
          const [user, session] =
            yield*
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
          const isPast = yield* DateTime.isPast(session.value.expires_at)
          if (Option.isNone(user) || isPast) {
            yield* sessionRepo.delete(session.value.id)
            return (
              yield*
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
          const _newSession = yield* Effect.if(
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
        }).pipe(Effect.withSpan("Users.httpSecurity"))
    })

  }),
).pipe(Layer.provide([
  UsersRepo.Default,
  SessionRepo.Live
]))

export const HttpUsersLive = HttpApiBuilder.group(Api, "users", handlers =>
  Effect.gen(function* () {
    const users = yield* Users
    const policy = yield* UsersPolicy

    return handlers
      .handle("getUser", ({ path }) =>
        pipe(
          users.findUserById(path.id),
          Effect.flatMap(
            Option.match({
              onSome: Effect.succeed,
              onNone: () => new UserNotFound({ id: path.id }),
            }),
          ),
          policyUse(policy.canRead(path.id)),
        )
      )
      .handle("authenticate", ({ payload }) =>
        pipe(
          // TODO: authenticate with oauth/password
          users.findUserById(payload.userId),
          withSystemActor,
          Effect.flatMap(
            Option.match({
              onNone: () => new UserNotFound({ id: payload.userId }),
              onSome: Effect.succeed,
            }),
          ),
          Effect.zip(users.createSession(payload.userId)),
          Effect.andThen(([user, session]) => {
            return UserWithSensitive.make({
              id: user.id,
              email: user.email,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              sessionId: session.id,
            })
          }),
        )
      )
  }),
).pipe(
  Layer.provide([Users.Default, UsersPolicy.Default, AuthenticationLive])
)
