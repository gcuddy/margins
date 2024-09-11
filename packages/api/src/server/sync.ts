import {
  HttpMiddleware,
  HttpRouter,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform"
import { Effect, Layer, Option } from "effect"
import { Replicache } from "../Replicache.js"
import { Schema } from "@effect/schema"
import { PullRequest, PullResponse, PushRequest } from "../Domain/Replicache.js"
import { CurrentUser } from "../Domain/User.js"
import { AuthorizationError, LuciaLayer } from "../Auth.js"
// import { Replicache } from "../services/Replicache"
// Middleware constructor that logs the name of the middleware

const authMiddleWare = (name: string) =>
  HttpMiddleware.make(app =>
    Effect.gen(function* () {
      const req = yield* HttpServerRequest.HttpServerRequest
      const { authorization } = yield* HttpServerRequest.schemaHeaders(
        Schema.Struct({
          authorization: Schema.String,
        }),
      ).pipe(
        Effect.tapErrorCause(e => Effect.logError("Parse Error", e)),
        Effect.catchTag(
          "ParseError",
          () => new AuthorizationError("Incorrect Authorization Header"),
        ),
      )
      const lucia = yield* LuciaLayer
      // const authorizationHeader =  req.headers
      const sessionId = Option.fromNullable(
        lucia.readBearerToken(authorization),
      )
      if (Option.isNone(sessionId)) {
        // 401 and authorization error
        // or session not found?
        return yield* new AuthorizationError("No Session Found")
      }
      // TODO: should make validateSession return effects/options automatically
      const { user, session } = yield* Effect.tryPromise(() =>
        lucia.validateSession(sessionId.value),
      )
      return yield* app // Continue with the original application flow
    }).pipe(
      Effect.tapErrorCause(e => Effect.logError("auth middleware error", e)),
      Effect.catchTag("AuthorizationError", e =>
        HttpServerResponse.text("Unauthorized", { status: 401 }),
      ),
    ),
  )

// Maybe should use HttpApi instead?
export const sync = HttpRouter.empty.pipe(
  HttpRouter.post(
    "/push",
    Effect.gen(function* () {
      const pushRequest = yield* HttpServerRequest.schemaBodyJson(PushRequest)
      const replicache = yield* Replicache

      yield* replicache.push(pushRequest)

      return yield* HttpServerResponse.json({})
    }).pipe(
      Effect.tapErrorCause(Effect.logError),
      Effect.catchAllCause(_ =>
        HttpServerResponse.empty().pipe(HttpServerResponse.setStatus(500)),
      ),
      // Effect.catchAllCause(_ => Effect.succeed(HttpServerResponse.text("Error")))
    ),
  ),
  HttpRouter.post(
    "/pull",
    Effect.gen(function* () {
      const pullRequest = yield* HttpServerRequest.schemaBodyJson(PullRequest)
      const replicache = yield* Replicache

      const pr = replicache.pull(pullRequest)

      const a = HttpServerResponse.schemaJson(PullResponse)
      return HttpServerResponse.text("About birds")
    }),
  ),
  HttpRouter.use(authMiddleWare("auth")),
  // Effect.provide(Replicache.Live),
)
// .pipe(Layer.provide(Replicache.Live))

// SyncApiLive.pipe(
//   HttpApiBuilder.httpApp
// )
