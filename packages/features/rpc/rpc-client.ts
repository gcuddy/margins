import * as Http from "@effect/platform/HttpClient"
import { Resolver } from "@effect/rpc"
import { HttpResolver } from "@effect/rpc-http"
import type { APIRouter } from "@margins/api/src/router.js"
import { Effect, Console } from "effect"
import { GetLink } from "@margins/api/src/schema.js"

// Create the client
export const client = HttpResolver.make<APIRouter>(
  Http.client.fetchOk.pipe(
    Http.client.mapRequest(
      Http.request.prependUrl("http://localhost:3000/rpc"),
    ),
  ),
).pipe(Resolver.toClient)
// client(new GetLink({ url: "https://google.com" })).pipe(
//   Effect.tap(Console.log),
//   Effect.runFork,
// )
