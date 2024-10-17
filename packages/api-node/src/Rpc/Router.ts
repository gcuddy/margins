import { Rpc, RpcRouter } from "@effect/rpc"
import { GoogleBooksGet, GoogleBooksSearch } from "./Integrations/GoogleBooks/schema.js"
import { GoogleBooks } from "./Integrations/GoogleBooks/Service.js"
import { Effect, Layer, ManagedRuntime } from "effect"
import { HttpRpcRouter } from "@effect/rpc-http"
import { HttpRouter } from "@effect/platform"


export const IntegrationsLayer = Layer.mergeAll(
  GoogleBooks.Live,
)

export const rpcRuntime = ManagedRuntime.make(IntegrationsLayer)

export const router = RpcRouter.make(
  Rpc.effect(GoogleBooksGet, ({ id }) => GoogleBooks.pipe(
    Effect.andThen(_ => _.get(id))
  )),
  Rpc.effect(GoogleBooksSearch, ({ query }) => GoogleBooks.pipe(
    Effect.andThen(_ => _.search(query))
  )),
  // Rpc.effect(GoogleBooksGet, ({ id }) => GoogleBooks.get(id)),
  // Rpc.effect(GoogleBooksSearch, ({ query }) => GoogleBooks.search(query)),
)
export type Router = typeof router

export const httpRouter = HttpRouter.empty.pipe(
  HttpRouter.post('/rpc', HttpRpcRouter.toHttpApp(router).pipe(
    Effect.provide(rpcRuntime)
  ))
)
