import { HttpClient, HttpClientRequest } from "@effect/platform"
import { RpcResolver } from "@effect/rpc"
import { HttpRpcResolver } from "@effect/rpc-http"
import type { AppRouter } from "@margins/api/src/router.js"

export const client = RpcResolver.toClient(
  HttpRpcResolver.make<AppRouter>(
    HttpClient.fetchOk.pipe(
      HttpClient.mapRequest(
        HttpClientRequest.prependUrl(`/sync/rpc`),
      ),
    ),
  ),
)

export const authedClient 