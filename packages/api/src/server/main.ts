import { type ConfigProvider, Layer, ManagedRuntime } from "effect"
import { GoogleBooksApi } from "../integrations/google-books/google-books"
import { Replicache } from "../Replicache"
// import { ConfigProviderLayer } from "./config"

// TODO: some of these layers should maybe be provided closer to handlers
const MainLayer = Layer.mergeAll(GoogleBooksApi.Live, Replicache.Live)

export const ServerRuntime = ManagedRuntime.make(MainLayer)
// TODO: not sure if this is the right pattern... maybe make into an effect?
export const makeServerRuntime = (config: ConfigProvider.ConfigProvider) =>
  ManagedRuntime.make(Layer.provide(MainLayer, Layer.setConfigProvider(config)))
