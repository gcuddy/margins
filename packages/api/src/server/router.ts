import {
  HttpMiddleware,
  HttpRouter,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform"
import { appRouter } from "../router"
import { Effect, flow, Option, Redacted } from "effect"
import { HttpRpcRouterNoStream } from "@effect/rpc-http"
import { sync } from "./sync"
import { AuthorizationError, LuciaLayer } from "../Auth"
import { Schema } from "@effect/schema"
// import { ServerRuntime } from "./main"y

// Middleware constructor that logs the name of the middleware
const authMiddleWare = (name: string) =>
  HttpMiddleware.make(app =>
    Effect.gen(function* () {
      console.log(name) // Log the middleware name when a route is accessed
      const { Authorization } = yield* HttpServerRequest.schemaHeaders(
        Schema.Struct({
          Authorization: Schema.String,
        }),
      )
      const lucia = yield* LuciaLayer
      // const authorizationHeader =  req.headers
      const sessionId = Option.fromNullable(
        lucia.readBearerToken(Authorization),
      )
      if (Option.isNone(sessionId)) {
        // 401 and authorization error
        // or session not found?
        yield* new AuthorizationError("No Session Found")
      }
      return yield* app // Continue with the original application flow
    }).pipe(
      Effect.catchTag("AuthorizationError", () =>
        HttpServerResponse.text("Unauthorized", { status: 401 }),
      ),
    ),
  )

// TODO: use HttpApi instead / inside here to define declarative api
export const router = HttpRouter.empty.pipe(
  HttpRouter.get("/", HttpServerResponse.text("content 1")),
  HttpRouter.get("/foo", HttpServerResponse.text("content 2")),
  HttpRouter.mount("/sync", sync),
  HttpRouter.use(authMiddleWare("auth")),
  HttpRouter.post("/rpc", HttpRpcRouterNoStream.toHttpApp(appRouter)),
  HttpRouter.options("*", HttpServerResponse.empty()),
  HttpRouter.use(flow(HttpMiddleware.cors(), HttpMiddleware.logger)),
)
//  TODO: Can I use a runtime to avoid this?
// .pipe(Effect.tapErrorCause(Effect.logError))
