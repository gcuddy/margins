import { BunHttpServer, BunRuntime } from "@effect/platform-bun"
import {
  Headers,
  HttpMiddleware,
  HttpServerRequest,
  HttpServerResponse,
  HttpRouter,
  HttpServer,
} from "@effect/platform"
import { Router, Rpc } from "@effect/rpc"
import { HttpRouter as RpcHttpRouter } from "@effect/rpc-http"
import { Console, Effect, Layer, flow } from "effect"
import { GetLink, LinkError, SaveLink, SearchBooks } from "./schema.js"
import { Parser, parse } from "./parse.js"
import * as p from "node-html-parser"
import type { Middlewares } from "effect-http"
import { searchBooks } from "./integrations/openlibrary.js"

// Implement the RPC server router
const router = Router.make(
  //   Rpc.stream(GetLink, ({ url }) =>
  //     Effect.gen(function* () {
  //       const data = yield* parse(url)
  //       return data
  //     }),
  //   ),
  Rpc.effect(GetLink, ({ url }) =>
    Effect.gen(function* () {
      const data = yield* parse(url)
      return data
    }).pipe(
      // Effect.catchAll(_ => new LinkError({ message: "Error parsing link" })),
      Effect.mapError(_ => {
        return new LinkError({ message: "Error parsing link" })
      }),
    ),
  ),
  Rpc.effect(SaveLink, ({ url }) =>
    Effect.gen(function* () {
      console.log("saving link")
      yield* parse(url)
      // TODO: actor that saves it in db now
      return "ok"
    }).pipe(
      Effect.mapError(_ => new LinkError({ message: "Error parsing link" })),
    ),
  ),
  Rpc.effect(SearchBooks, ({ query }) =>
    Effect.gen(function* () {
      console.log("searching books", query)
      const data = yield* searchBooks(query)
      yield* Console.log("data", data)
      return data
    }).pipe(
      Effect.tapErrorCause(Effect.logError),
      Effect.mapError(_ => {
        if (_._tag === "ParseError") {
          return "Error parsing body"
        } else {
          return "Error searching books"
        }
      }),
    ),
  ),
)

export type APIRouter = typeof router
const port = 3000
const ServerLive = BunHttpServer.layer({ port, development: true })

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
  return HttpMiddleware.make(app =>
    Effect.gen(function* (_) {
      const request = yield* _(HttpServerRequest.HttpServerRequest)

      if (request.method === "OPTIONS") {
        return HttpServerResponse.empty({
          status: 204,
          headers: Headers.fromInput(corsHeaders),
        })
      }

      const response = yield* _(app)

      yield* Console.log("response", { response })
      return response.pipe(HttpServerResponse.setHeaders(corsHeaders))
    }),
  )
}
const HttpLive = HttpRouter.empty.pipe(
  //   Http.headers.set("Access-Control-Allow-Origin", "*"),
  HttpRouter.options(
    "/rpc",
    HttpServerResponse.empty({
      status: 204,
      headers: Headers.fromInput(corsHeaders),
    }),
  ),
  HttpRouter.post("/rpc", RpcHttpRouter.toHttpApp(router)),
  //   HttpRouter.post("/rpc", Http.response.text("ok")),
  HttpRouter.get("/", HttpServerResponse.text("Hello World!")),
  HttpRouter.get(
    "/hello",
    Effect.gen(function* () {
      yield* Console.log("hello")
      HttpServerResponse.setHeader("hi", "there")
      return yield* HttpServerResponse.text("Hello World!")
    }),
  ),
  HttpRouter.use(cors()),
  // Effect.catchTag("", _ => HttpServerResponse.text("Not found")),
  //   Http.server.serve(Middlewares.cors()),
  HttpServer.serve(
    // flow(),
    //   Http.middleware.logger,
    //   Middlewares.cors({
    //     allowedOrigins: ["http://localhost:5173"],
    //   }),
    flow(
      HttpMiddleware.logger,
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
