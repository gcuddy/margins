import {
  HttpApiBuilder,
  HttpApiSwagger,
  HttpMiddleware,
  HttpServer,
  Etag,
} from "@effect/platform"
import {
  NodeContext,
  NodeHttpPlatform,
  NodeHttpServer,
} from "@effect/platform-node"
import { createServer } from "node:http"
import { Effect, Layer, Logger, LogLevel } from "effect"
import { Api } from "./Api.js"
import { HttpUsersLive } from "./Users/Http.js"
import { HttpReplicacheLive } from "./Replicache/Http.js"

const ApiLive = HttpApiBuilder.api(Api).pipe(
  Layer.provide(HttpUsersLive),
  Layer.provide(HttpReplicacheLive),
)
HttpApiBuilder.httpApp
export const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiSwagger.layer()),
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(ApiLive),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
)
