import { HttpClient, HttpClientRequest } from "@effect/platform"
import { Resolver } from "@effect/rpc"
import { HttpResolver } from "@effect/rpc-http"
import type { APIRouter } from "@margins/api/src/router.js"

// Create the client
export const client = HttpResolver.make<APIRouter>(
  HttpClient.fetchOk.pipe(
    HttpClient.mapRequest(
      HttpClientRequest.prependUrl("http://localhost:3000/rpc"),
    ),
  ),
).pipe(Resolver.toClient)
