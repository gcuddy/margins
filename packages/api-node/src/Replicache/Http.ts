import { HttpApiBuilder } from "@effect/platform"
import { Api } from "../Api.js"
import { Effect, Layer, Option, pipe } from "effect"
import { Users } from "../Users.js"
import { CurrentUser, UserNotFound } from "../Domain/User.js"
import { PullResponse } from "../Domain/Replicache.js"
import { Replicache } from "../Replicache.js"
import { ClientGroupPolicy } from "./ClientGroupPolicy.js"
import { AuthenticationLive } from "../Users/Http.js"

export const HttpReplicacheLive = HttpApiBuilder.group(
  Api,
  "replicache",
  handlers =>
    Effect.gen(function* () {
      const user = yield* Users
      const replicache = yield* Replicache

      const h = handlers
        .handle("pull", ({ payload }) =>
          CurrentUser.pipe(
            Effect.flatMap(user => replicache.pull(user.id, payload)),
            Effect.andThen(pr =>
              Effect.succeed(PullResponse.make(pr)).pipe(
                Effect.withLogSpan("PullResponse.make"),
              ),
            ),
            Effect.tapErrorCause(Effect.logError),
            Effect.orDie,
          ),
        )

      return h;
    }),
).pipe(
  Layer.provide([
    AuthenticationLive,
    Users.Default,
    Replicache.Default
  ])
)
