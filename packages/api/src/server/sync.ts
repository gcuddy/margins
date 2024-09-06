import {
  HttpRouter,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform"
import { Effect, Layer } from "effect"
import { Replicache } from "../Replicache"
import { Schema } from "@effect/schema"
import { PushRequest } from "../Domain/Replicache"
import { CurrentUser } from "../Domain/User"
// import { Replicache } from "../services/Replicache"

// Maybe should use HttpApi instead?
export const sync = HttpRouter.empty
  .pipe(
    HttpRouter.post(
      "/push",
      Effect.gen(function* () {
        // Is there a more elegant way to do this?
        const request = yield* HttpServerRequest.HttpServerRequest
        const body = yield* request.json
        const pushRequest = yield* Schema.decodeUnknown(PushRequest)(body)
        const user = yield* CurrentUser

        const replicache = yield* Replicache
        yield* replicache.push(user.id, pushRequest)
        return yield* HttpServerResponse.json({})
      }).pipe(
        Effect.tapErrorCause(Effect.logError),
        Effect.catchAllCause(_ =>
          HttpServerResponse.empty().pipe(HttpServerResponse.setStatus(500)),
        ),
        // Effect.catchAllCause(_ => Effect.succeed(HttpServerResponse.text("Error")))
      ),
    ),
    HttpRouter.post("/pull", HttpServerResponse.text("About birds")),
  )
  .pipe(Effect.provide(Replicache.Live))

// SyncApiLive.pipe(
//   HttpApiBuilder.httpApp
// )
