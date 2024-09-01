import { Schema } from "@effect/schema"
import { Config, Context, Effect, Layer } from "effect"

class RPCConfig extends Schema.Class<RPCConfig>("@margins/RpcConfigSchema")({
  url: Schema.String,
}) {}

export class RpcConfigLayer extends Context.Tag("@margins/RpcConfig")<
  RpcConfigLayer,
  RPCConfig
>() {
  static readonly Live = Layer.effect(
    this,
    Effect.gen(function* () {
      const url = yield* Config.string("PARTYKIT_URL")
      return {
        url: `${url}/rpc`,
      }
    }),
  )
}
