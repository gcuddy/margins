import { RpcRouter, Rpc } from "@effect/rpc"
import { Effect, Layer, ManagedRuntime, pipe } from "effect"
import { GoogleBooksGet, GoogleBooksSearch } from "./request.js"
import { GoogleBooksApi } from "./integrations/google-books/google-books.js"
import { HttpRpcRouter } from "@effect/rpc-http"
import { HttpApp } from "@effect/platform"

const MainLayer = Layer.mergeAll(GoogleBooksApi.Live)

const RpcRuntime = ManagedRuntime.make(MainLayer)

export const appRouter = RpcRouter.make(
  Rpc.effect(GoogleBooksSearch, ({ query }) =>
    Effect.gen(function* () {
      const googleBooksApi = yield* GoogleBooksApi
      return yield* googleBooksApi.search(query)
    }).pipe(
      Effect.tapErrorCause(Effect.logError),
      Effect.mapError(_ => "There was an error searching. Try again later."),
    ),
  ),
  Rpc.effect(GoogleBooksGet, ({ id }) =>
    Effect.gen(function* () {
      const googleBooksApi = yield* GoogleBooksApi
      return yield* googleBooksApi.get(id)
    }).pipe(
      Effect.tapErrorCause(Effect.logError),
      Effect.mapError(
        _ => "There was an error getting the book. Try again later.",
      ),
    ),
  ),
)

export type AppRouter = typeof appRouter


export const handler = pipe(
  appRouter,
  HttpRpcRouter.toHttpApp,
  //   Not so sure about this...
  Effect.provide(MainLayer),
  HttpApp.toWebHandler,
)
