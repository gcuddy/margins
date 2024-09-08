import { Context, Layer } from "effect"

export class DurableObjectStateLayer extends Context.Tag("core/durableObject")<
  DurableObjectStateLayer,
  DurableObjectState
>() {
  static Live = (state: DurableObjectState) => Layer.succeed(this, state)
}
