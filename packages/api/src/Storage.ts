import { Context, Layer } from "effect"

// TODO: should the be generic so that if we swap out cloudflare DO it works?
export class StorageLayer extends Context.Tag("Storage")<
  StorageLayer,
  DurableObjectState
>() {
  static Live = (state: DurableObjectState) => Layer.succeed(this, state)
}
