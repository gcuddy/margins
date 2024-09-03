import { type ConfigProvider, Layer, ManagedRuntime } from "effect"
import { GoogleBooksApi } from "../integrations/google-books/google-books"
// import { ConfigProviderLayer } from "./config"

const MainLayer = Layer.mergeAll(GoogleBooksApi.Live)

export const ServerRuntime = ManagedRuntime.make(MainLayer)
// TODO: not sure if this is the right pattern... maybe make into an effect?
export const makeServerRuntime = (config: ConfigProvider.ConfigProvider) =>
  ManagedRuntime.make(Layer.provide(MainLayer, Layer.setConfigProvider(config)))
