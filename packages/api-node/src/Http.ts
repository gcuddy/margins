import {
  HttpApiBuilder,
  HttpApiSwagger,
  HttpMiddleware,
  HttpServer,
} from "@effect/platform"
import { NodeHttpServer } from "@effect/platform-node"
import { createServer } from "node:http"
import { Layer } from "effect"
import { Api } from "./Api.js"
import { HttpUsersLive } from "./Users/Http.js"
import { HttpReplicacheLive } from "./Replicache/Http.js"
import { HttpEntriesLive } from "./Entries/Http.js"
import { httpRouter } from "./Rpc/Router.js"

const ApiLive = HttpApiBuilder.api(Api).pipe(
  Layer.provide(HttpUsersLive),
  Layer.provide(HttpReplicacheLive),
  Layer.provide(HttpEntriesLive),
)

const RpcRouterLive = HttpApiBuilder.Router.use(
  router => router.concat(httpRouter)
)

export const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiSwagger.layer()),
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(ApiLive),
  Layer.provide(RpcRouterLive),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3030 })),
)
