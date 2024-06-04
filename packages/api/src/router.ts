import { BunHttpServer, BunRuntime } from "@effect/platform-bun"
import * as Http from "@effect/platform/HttpServer"
import { Router, Rpc } from "@effect/rpc"
import { HttpRouter } from "@effect/rpc-http"
import { Effect, Layer } from "effect"
import { GetLink } from "./schema.js"
import { Parser, parse } from "./parse.js"
import * as p from "node-html-parser"

// Implement the RPC server router
const router = Router.make(
  Rpc.effect(GetLink, ({ url }) =>
    Effect.gen(function* () {
      const data = yield* parse(url)
      return data
    }),
  ),
)

export type UserRouter = typeof router
const port = 3000
const ServerLive = BunHttpServer.server.layer({ port })

const ParserLive = Layer.succeed(
  Parser,
  Parser.of({
    parse: (html: string) => p.parse(html),
  }),
)

// Create the http server
const HttpLive = Http.router.empty.pipe(
  Http.router.post("/rpc", HttpRouter.toHttpApp(router)),
  Http.server.serve(Http.middleware.logger),
  Http.server.withLogAddress,
  Layer.provide(ServerLive),
  Layer.provide(ParserLive),
)

BunRuntime.runMain(Layer.launch(Layer.provide(HttpLive, ServerLive)))
