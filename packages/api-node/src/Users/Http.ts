import { HttpApiBuilder } from "@effect/platform"
import { Api } from "../Api.js"
import { Effect, Layer, Option, pipe } from "effect"
import { Users } from "../Users.js"
import { UserNotFound, UserWithSensitive } from "../Domain/User.js"
import { policyUse, withSystemActor } from "../Domain/Actor.js"
import { UsersPolicy } from "./Policy.js"

export const HttpUsersLive = HttpApiBuilder.group(Api, "users", handlers =>
  Effect.gen(function* () {
    const users = yield* Users
    const policy = yield * UsersPolicy

    return handlers.pipe(
      HttpApiBuilder.handle("getUser", ({ path }) => {
        const a = pipe(
          users.findUserById(path.id),
          Effect.flatMap(
            Option.match({
              onSome: Effect.succeed,
              onNone: () => new UserNotFound({ id: path.id }),
            }),
          ),
          policyUse(policy.canRead(path.id)),
        )
        return a
      }),
      users.httpSecurity,
      HttpApiBuilder.handle("authenticate", ({ payload }) => {
        const a = pipe(
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
        return a
      }),
    )
  }),
).pipe(Layer.provide(Users.Live), Layer.provide(UsersPolicy.Live))
