import { Rpc, RpcRouter } from "@effect/rpc"
import { GoogleBooksGet, GoogleBooksSearch } from "./Integrations/GoogleBooks/schema.js"
import { GoogleBooks } from "./Integrations/GoogleBooks/Service.js"
import { Effect, Layer } from "effect"
import { HttpRpcRouter } from "@effect/rpc-http"
import { HttpRouter } from "@effect/platform"


export const IntegrationsLayer = Layer.mergeAll(
    GoogleBooks.Live,
)
export const router = RpcRouter.make(
    Rpc.effect(GoogleBooksGet, ({ id }) => GoogleBooks.get(id)),
    Rpc.effect(GoogleBooksSearch, ({ query }) => GoogleBooks.search(query)),
)

export type Router = typeof router


export const httpApp = HttpRpcRouter.toHttpApp(router).pipe(
    // Layer.provide(Integrations),
)

const http = HttpRouter.empty.pipe(
    // HttpRouter.post('/rpc', x)
)