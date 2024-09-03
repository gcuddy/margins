import { HttpRouter, HttpServerResponse } from "@effect/platform"
import { appRouter } from "../router"
import { Effect } from "effect"
import { HttpRpcRouterNoStream } from "@effect/rpc-http"
import { sync } from "./sync"
// import { ServerRuntime } from "./main"

// TODO: use HttpApi instead
export const router = HttpRouter.empty
  .pipe(
    HttpRouter.get("/", HttpServerResponse.text("content 1")),
    HttpRouter.get("/foo", HttpServerResponse.text("content 2")),
    HttpRouter.mount("/sync", sync),
    HttpRouter.post("/rpc", HttpRpcRouterNoStream.toHttpApp(appRouter)),
  )
  //  TODO: Can I use a runtime to avoid this?
  .pipe(Effect.tapErrorCause(e => Effect.logError(e)))
