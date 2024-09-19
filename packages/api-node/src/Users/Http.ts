import { HttpApiBuilder } from "@effect/platform"
import { Api } from "../Api.js"
import { Effect, Layer, Option, pipe } from "effect"
import { Users } from "../Users.js"
import { UserNotFound, UserWithSensitive } from "../Domain/User.js"

export const HttpUsersLive = HttpApiBuilder.group(Api, "users", handlers =>
  Effect.gen(function* () {
    const users = yield* Users

    return handlers.pipe(
      HttpApiBuilder.handle("getUser", ({ path }) => {
        return pipe(
          users.findUserById(path.id),
          Effect.flatMap(
            Option.match({
              onSome: Effect.succeed,
              onNone: () => new UserNotFound({ id: path.id }),
            }),
          ),
        )
      }),
      HttpApiBuilder.handle("authenticate", ({ payload }) =>
        pipe(
          // TODO: authenticate with oauth/password
          users.findUserById(payload.userId),
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
        ),
      ),
    )
  }),
).pipe(Layer.provide(Users.Live))
