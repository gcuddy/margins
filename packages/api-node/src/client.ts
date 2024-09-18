import { RpcResolver } from "@effect/rpc"
import { HttpRpcResolver } from "@effect/rpc-http"
import type { AppRouter } from "./router.js"
import { HttpClient, HttpClientRequest } from "@effect/platform"

const client = RpcResolver.toClient(
  HttpRpcResolver.make<AppRouter>(
    HttpClient.fetchOk.pipe(
      HttpClient.mapRequest(
        HttpClientRequest.prependUrl("http://localhost:3000/rpc"),
      ),
    ),
  ),
)
