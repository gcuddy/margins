import { ConfigProvider, Layer } from "effect"

// TODO: make this make more sense
const configProviderMap = ConfigProvider.fromMap(
  new Map([["GOOGLE_API_URL", "https://www.googleapis.com"]]),
)

export const ConfigProviderLayer = Layer.setConfigProvider(configProviderMap)
