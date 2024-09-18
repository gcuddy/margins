import { HttpRouter, HttpServer, HttpServerResponse } from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { router } from "./server/router.js"
import { createServer } from "node:http"
import { Effect, Layer } from "effect"
import { LuciaLayer } from "./Auth.js"

export const app = router.pipe(
  HttpServer.serve(),
  HttpServer.withLogAddress,
  Layer.provide(LuciaLayer.Live),
)

export const HttpLive = NodeHttpServer.layer(createServer, {
  port: 3000,
})
