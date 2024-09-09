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

// TODO: use HttpApi instead / inside here to define declarative api
export const router = HttpRouter.empty
  .pipe(
    HttpRouter.get("/", HttpServerResponse.text("content 1")),
    HttpRouter.get("/foo", HttpServerResponse.text("content 2")),
    HttpRouter.mount("/sync", sync),
    HttpRouter.post("/rpc", HttpRpcRouterNoStream.toHttpApp(appRouter)),
    HttpRouter.get(
      "/create-session",
      Effect.gen(function* () {
        const lucia = yield* LuciaLayer
        const session = yield* Effect.tryPromise(() =>
          lucia.createSession("n0za7qlnp1rca3s", {}),
        )
        return yield* HttpServerResponse.json({ session })
      }),
    ),
    HttpRouter.options("*", HttpServerResponse.empty()),
    HttpRouter.use(flow(HttpMiddleware.cors(), HttpMiddleware.logger)),
  )
  .pipe(
    Effect.catchTags({
      // AuthorizationError: () =>
      //   HttpServerResponse.text("Unauthorized", { status: 401 }),
    }),
    Effect.catchAllCause(cause =>
      HttpServerResponse.text(cause.toString(), { status: 500 }),
    ),
  )
//  TODO: Can I use a runtime to avoid this?
// .pipe(Effect.tapErrorCause(Effect.logError))
