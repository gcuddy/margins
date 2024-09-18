import { HttpApiBuilder } from "@effect/platform"
import { Api } from "../Api.js"
import { Effect, Layer, Option, pipe } from "effect"
import { Users } from "../Users.js"
import { UserNotFound } from "../Domain/User.js"

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
    )
  }),
).pipe(Layer.provide(Users.Live))
