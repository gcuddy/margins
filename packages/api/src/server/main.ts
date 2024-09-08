import type { ConfigProvider } from "effect"
import { Effect, Layer, ManagedRuntime, Option } from "effect"
import { GoogleBooksApi } from "../integrations/google-books/google-books"
import { Replicache } from "../Replicache"
import { LuciaLayer } from "../Auth"
import { LuciaAdapterLayer } from "../adapters/lucia-do"
import { KeyValueStore } from "@effect/platform"
import { DurableObjectStateLayer } from "../DurableObject"
// import { ConfigProviderLayer } from "./config"
const KeyValueStoreLive = Layer.effect(
  KeyValueStore.KeyValueStore,
  Effect.gen(function* () {
    const state = yield* DurableObjectStateLayer
    // TODO
    return KeyValueStore.makeStringOnly({
      clear: Effect.promise(() => state.storage.deleteAll()),
      get: key => Effect.succeed(Option.some("")),
      remove: key => Effect.void,
      set: (key, value) => Effect.void,
      size: Effect.succeed(0),
    })
  }),
)
// TODO: some of these layers should maybe be provided closer to handlers
const MainLayer = Layer.mergeAll(
  GoogleBooksApi.Live,
  Replicache.Live,
  LuciaLayer.Live,
).pipe(
  Layer.provide(KeyValueStoreLive),
  // Layer.provide(DurableObjectStateLayer.Live({} as any)),
)

// export const ServerRuntime = ManagedRuntime.make(MainLayer)
// TODO: not sure if this is the right pattern... maybe make into an effect?
export const makeServerRuntime = (
  config: ConfigProvider.ConfigProvider,
  // TODO: is there another way besides accepting an argument?
  state: DurableObjectState,
) =>
  ManagedRuntime.make(
    Layer.provide(MainLayer, Layer.setConfigProvider(config)).pipe(
      Layer.provide(DurableObjectStateLayer.Live(state)),
    ),
  )
