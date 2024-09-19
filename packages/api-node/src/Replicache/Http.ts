import { HttpApiBuilder } from "@effect/platform"
import { Api } from "../Api.js"
import { Effect, Layer, Option, pipe } from "effect"
import { Users } from "../Users.js"
import { CurrentUser, UserNotFound } from "../Domain/User.js"
import { PullResponse } from "../Domain/Replicache.js"
import { Replicache } from "../Replicache.js"

export const HttpReplicacheLive = HttpApiBuilder.group(
  Api,
  "replicache",
  handlers =>
    Effect.gen(function* () {
      const user = yield* Users
      const x = handlers.pipe(
        HttpApiBuilder.handle("pull", ({ payload }) =>
          Effect.gen(function* () {
            const replicache = yield* Replicache
            const currentUser = yield* CurrentUser
            const pr = yield* replicache
              .pull(currentUser.id, payload)
              .pipe(Effect.orDie)
            return PullResponse.make(pr)
          }),
        ),
        user.httpSecurity,
      )
      return x
    }),
).pipe(Layer.provide(Users.Live), Layer.provide(Replicache.Live))
