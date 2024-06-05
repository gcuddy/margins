import * as Http from "@effect/platform/HttpClient"
import { Resolver } from "@effect/rpc"
import { HttpResolver } from "@effect/rpc-http"
import type { APIRouter } from "@margins/api/src/router.js"

// Create the client
export const client = HttpResolver.make<APIRouter>(
  Http.client.fetchOk.pipe(
    Http.client.mapRequest(
      Http.request.prependUrl("http://localhost:3000/rpc"),
    ),
  ),
).pipe(Resolver.toClient)

// Use the client
// client(new GetLink()).pipe(
//   Stream.runCollect,
//   Effect.flatMap(
//     Effect.forEach(id => client(new GetUser({ id })), { batching: true }),
//   ),
//   Effect.tap(Console.log),
//   Effect.runFork,
// )
