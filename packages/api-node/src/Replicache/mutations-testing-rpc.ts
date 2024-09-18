import { Rpc, RpcRouter } from "@effect/rpc"
import { EntryCreate } from "./mutations.js"
import { Effect } from "effect"

const server = RpcRouter.make(
  Rpc.effect(EntryCreate, req => Effect.succeed(req)),
)

// server.rpcs.has()

const x = RpcRouter.toHandlerNoStream(server)

const a = x("")

Effect.gen(function* () {
  const a = yield* x("")
  const d = a?.at(0)
  if (d) {
    d
  }
})
