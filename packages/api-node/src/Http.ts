import {
  HttpApiBuilder,
  HttpApiSwagger,
  HttpMiddleware,
  HttpRouter,
  HttpServer,
  HttpServerResponse,
} from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { router } from "./server/router.js"
import { createServer } from "node:http"
import { Effect, Layer } from "effect"
import { LuciaLayer } from "./Auth.js"
import { Api } from "./Api.js"
import { HttpUsersLive } from "./Users/Http.js"
import { HttpReplicacheLive } from "./Replicache/Http.js"

export const app = router.pipe(
  HttpServer.serve(),
  HttpServer.withLogAddress,
  Layer.provide(LuciaLayer.Live),
)

const ApiLive = HttpApiBuilder.api(Api).pipe(
  Layer.provide(HttpUsersLive),
  Layer.provide(HttpReplicacheLive),
)

export const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiSwagger.layer()),
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(ApiLive),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
)

// export const ServerLive = NodeHttpServer.layer(createServer, {
//   port: 3000,
// })
