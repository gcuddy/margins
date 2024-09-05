import {
  HttpRouter,
  HttpServerResponse,
} from "@effect/platform"
import { Effect } from "effect"
import { Replicache } from "../services/Replicache"

const test = Effect.gen(function* () {
  const x = yield* Replicache
})

// Maybe should use HttpApi instead?
export const sync = HttpRouter.empty.pipe(
  HttpRouter.post("/push", test.pipe(Effect.andThen(HttpServerResponse.json))),
  HttpRouter.post("/pull", HttpServerResponse.text("About birds")),
)

// SyncApiLive.pipe(
//   HttpApiBuilder.httpApp
// )
