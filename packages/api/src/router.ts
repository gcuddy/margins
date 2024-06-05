import { BunHttpServer, BunRuntime } from "@effect/platform-bun"
import * as Http from "@effect/platform/HttpServer"
import { Router, Rpc } from "@effect/rpc"
import { HttpRouter } from "@effect/rpc-http"
import { Console, Effect, Layer, flow } from "effect"
import { GetLink, SaveLink } from "./schema.js"
import { Parser, parse } from "./parse.js"
import * as p from "node-html-parser"
import type { Middlewares } from "effect-http"

// Implement the RPC server router
const router = Router.make(
  //   Rpc.stream(GetLink, ({ url }) =>
  //     Effect.gen(function* () {
  //       const data = yield* parse(url)
  //       return data
  //     }),
  //   ),
  Rpc.effect(GetLink, ({ url }) =>
    //   Effect.succeed({
    //     title: "test",
    //     image: "https://example.com/image.png",
    //     description: "test",
    //     url: URL(url),
    //   }),
    Effect.gen(function* () {
      console.log("getting link", url)
      const data = yield* parse(url)
      return data
    }),
  ),
  Rpc.effect(SaveLink, ({ url }) =>
    Effect.gen(function* () {
      const dat = yield* parse(url)
      return "ok"
    }),
  ),
)

export type APIRouter = typeof router
const port = 3000
const ServerLive = BunHttpServer.server.layer({ port, development: true })

const ParserLive = Layer.succeed(
  Parser,
  Parser.of({
    parse: (html: string) => p.parse(html),
  }),
)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Allow all origins (adjust as needed)
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  //   "Access-Control-Allow-Headers": "Content-Type, Authorization",
}
export const cors = (_options?: Partial<Middlewares.CorsOptions>) => {
  return Http.middleware.make(app =>
    Effect.gen(function* (_) {
      const request = yield* _(Http.request.ServerRequest)

      //   const origin = request.headers["origin"]
      //   const accessControlRequestHeaders =
      //     request.headers["access-control-request-headers"]

      yield* Console.log("request", { request })

      if (request.method === "OPTIONS") {
        yield* Console.log("OPTIONS")
        //   corsHeaders = { ...corsHeaders,
        //     ...allowMethods,
        //     ...allowHeaders(accessControlRequestHeaders),
        //     ...maxAge,
        //   }

        return Http.response.empty({
          status: 204,
          headers: Http.headers.fromInput(corsHeaders),
        })
      }

      const response = yield* _(app)

      yield* Console.log("response", { response })
      return response.pipe(Http.response.setHeaders(corsHeaders))
    }),
  )
}
const HttpLive = Http.router.empty.pipe(
  //   Http.headers.set("Access-Control-Allow-Origin", "*"),
  Http.router.options(
    "/rpc",
    Http.response.empty({
      status: 204,
      headers: Http.headers.fromInput(corsHeaders),
    }),
  ),
  Http.router.post("/rpc", HttpRouter.toHttpApp(router)),
  //   Http.router.post("/rpc", Http.response.text("ok")),
  Http.router.get("/", Http.response.text("Hello World!")),
  Http.router.get(
    "/hello",
    Effect.gen(function* () {
      yield* Console.log("hello")
      Http.response.setHeader("hi", "there")
      return yield* Http.response.text("Hello World!")
    }),
  ),
  Http.router.use(cors()),
  Effect.catchTag("RouteNotFound", _ => Http.response.text("Not found")),
  //   Http.server.serve(Middlewares.cors()),
  Http.server.serve(
    // flow(),
    //   Http.middleware.logger,
    //   Middlewares.cors({
    //     allowedOrigins: ["http://localhost:5173"],
    //   }),
    flow(
      Http.middleware.logger,
      //   cors(),
      //   cors(),
      //   Middlewares.cors({
      //     allowedOrigins: ["http://localhost:5173"],
      //     allowedMethods: ["GET", "POST"],
      //   }),
    ),
  ),
  // (),
  //   Http.server.withLogAddress,
  //   Http.middleware.logger,
  Layer.provide(ServerLive),
  Layer.provide(ParserLive),
)

BunRuntime.runMain(Layer.launch(Layer.provide(HttpLive, ServerLive)))
