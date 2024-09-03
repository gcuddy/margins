import { HttpRouter, HttpServerResponse } from "@effect/platform"
import { Effect } from "effect"

// eslint-disable-next-line require-yield
const test = Effect.gen(function* () {
  return "test"
})

// Maybe should use HttpApi instead?
export const sync = HttpRouter.empty.pipe(
  HttpRouter.post("/push", test.pipe(Effect.andThen(HttpServerResponse.json))),
  HttpRouter.post("/pull", HttpServerResponse.text("About birds")),
)
