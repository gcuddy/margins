import type { ConfigProvider } from "effect"
import { Effect, Layer, ManagedRuntime, Option } from "effect"
import { GoogleBooksApi } from "../integrations/google-books/google-books.js"
import { Replicache } from "../Replicache.js"
import { LuciaLayer } from "../Auth.js"
import { LuciaAdapterLayer } from "../adapters/lucia-do.js"
import { KeyValueStore } from "@effect/platform"
import {
  DurableObjectStateLayer,
  DurableObjectStorageLayer,
  StorageLayer,
} from "../DurableObject.js"
import { CVRCache } from "../Replicache/ClientViewRecord.js"
import { CurrentUser } from "../Domain/User.js"
// import { ConfigProviderLayer } from "./config"

// TODO: move this, but also probably just use durableObjectStateLayer for everything instead of extra stringifying??
const KeyValueStoreLive = Layer.effect(
  KeyValueStore.KeyValueStore,
  Effect.gen(function* () {
    const state = yield* DurableObjectStateLayer
    // TODO
    return KeyValueStore.make({
      clear: Effect.promise(() => state.storage.deleteAll()),
      // eslint-disable-next-line require-yield
      get: key =>
        Effect.gen(function* () {
          const value = yield* Effect.promise(() =>
            state.storage.get<string>(key),
          )
          return Option.fromNullable(value)
        }),
      remove: key => Effect.promise(() => state.storage.delete(key)),
      set: (key, value) => Effect.promise(() => state.storage.put(key, value)),
      // TODO: this is not really performant, should be avoided
      size: Effect.promise(() => state.storage.list().then(list => list.size)),
      getUint8Array: key => Effect.dieMessage("Uint8Array not implemented"),
      modifyUint8Array: key => Effect.dieMessage("Uint8Array not implemented"),
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
  Layer.provide(CVRCache.Live),
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
    Layer.provide(MainLayer, Layer.setConfigProvider(config))
      .pipe(
        Layer.provide(DurableObjectStateLayer.Live(state)),
        Layer.provide(StorageLayer.Live),
      )
      .pipe(Layer.provide(DurableObjectStorageLayer.Live(state.storage)))
      .pipe(Layer.provide(CurrentUser.Test)),
  )
