import { HttpClient, HttpClientRequest } from "@effect/platform"
import { RpcResolver } from "@effect/rpc"
import { HttpRpcResolverNoStream } from "@effect/rpc-http"
import type { AppRouter } from "@margins/api/src/router.js"

export const client = RpcResolver.toClient(
  HttpRpcResolverNoStream.make<AppRouter>(
    HttpClient.fetchOk.pipe(
      HttpClient.mapRequest(
        // TODO: dynamic config
        HttpClientRequest.prependUrl(`http://localhost:8787/rpc`),
      ),
    ),
  ),
)
