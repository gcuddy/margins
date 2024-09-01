// import { HttpClient, HttpClientRequest } from "@effect/platform"
// import { RpcResolver } from "@effect/rpc"
// import { HttpRpcResolver } from "@effect/rpc-http"
// import type { AppRouter } from "@margins/api/src/router2.js"
// import { Effect } from "effect"
// import { RpcConfigLayer } from "./rpc-config.js"

// export const makeClient = Effect.gen(function* () {
//   const { url } = yield* RpcConfigLayer
//   return RpcResolver.toClient(
//     HttpRpcResolver.make<AppRouter>(
//       HttpClient.fetchOk.pipe(
//         HttpClient.mapRequest(HttpClientRequest.prependUrl(url)),
//       ),
//     ),
//   )
// })

// const client = RpcResolver.toClient(
//   HttpRpcResolver.make<AppRouter>(
//     HttpClient.fetchOk.pipe(
//       HttpClient.mapRequest(
//         HttpClientRequest.prependUrl("http://localhost:3000/rpc"),
//       ),
//     ),
//   ),
// )
