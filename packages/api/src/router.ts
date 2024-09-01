import { RpcRouter, Rpc } from "@effect/rpc"
import { Effect, Layer, pipe } from "effect"
import { GoogleBooksGet, GoogleBooksSearch } from "./request.js"
import { GoogleBooksApi } from "./integrations/google-books/google-books.js"
import { HttpRpcRouter } from "@effect/rpc-http"
import { HttpApp } from "@effect/platform"
import {
  GetOpenLibraryAuthor,
  GetOpenLibraryBook,
  GetOpenLibraryBookEditions,
  SearchItunes,
  SearchOpenLibrary,
} from "./schema.js"
import * as OpenLibrary from "./integrations/openlibrary.js"
import * as Itunes from "./integrations/itunes.js"

const MainLayer = Layer.mergeAll(GoogleBooksApi.Live)

// const RpcRuntime = ManagedRuntime.make(MainLayer)

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
  Rpc.effect(SearchOpenLibrary, ({ query }) =>
    Effect.gen(function* () {
      console.log("searching books", query)
      const data = yield* OpenLibrary.searchBooks(query)
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
  Rpc.effect(GetOpenLibraryBook, ({ key }) =>
    OpenLibrary.getWork(key).pipe(
      Effect.tapErrorCause(Effect.logError),
      Effect.mapError(_ => "Error getting book"),
    ),
  ),
  Rpc.effect(GetOpenLibraryAuthor, ({ key }) =>
    OpenLibrary.getAuthor(key).pipe(
      Effect.tapErrorCause(Effect.logError),
      Effect.mapError(_ => "Error getting author"),
    ),
  ),
  Rpc.effect(GetOpenLibraryBookEditions, ({ key, offset }) =>
    OpenLibrary.getEditionsForWork(key, offset).pipe(
      Effect.tapErrorCause(Effect.logError),
      Effect.mapError(_ => "Error getting book editions"),
    ),
  ),
  Rpc.effect(SearchItunes, params =>
    Itunes.search(params).pipe(
      Effect.tapErrorCause(Effect.logError),
      Effect.mapError(_ => "Error searching itunes"),
    ),
  ),
)

export type AppRouter = typeof appRouter

export const handler = pipe(
  appRouter,
  HttpRpcRouter.toHttpApp,
  Effect.provide(MainLayer),
  HttpApp.toWebHandler,
)
