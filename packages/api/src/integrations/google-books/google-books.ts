import { Context, Effect, Layer } from "effect"
import { BuildGoogleBooksUrl } from "./build-url.js"
import {
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform"
import { GoogleBookVolume, GoogleBookVolumes } from "./schema.js"

const make = Effect.gen(function* () {
  const buildGoogleBooksUrl = yield* BuildGoogleBooksUrl

  const get = (volumeId: string) => {
    const url = buildGoogleBooksUrl.buildGetUrl(volumeId)
    return HttpClientRequest.get(url).pipe(
      HttpClient.fetchOk,
      Effect.andThen(HttpClientResponse.schemaBodyJson(GoogleBookVolume)),
      Effect.scoped,
    )
  }

  const search = (query: string) => {
    const url = buildGoogleBooksUrl.buildSearchUrl(query)
    return HttpClientRequest.get(url).pipe(
      HttpClient.fetchOk,
      Effect.andThen(HttpClientResponse.schemaBodyJson(GoogleBookVolumes)),
      Effect.scoped,
    )
  }

  return { get, search } as const
})

export class GoogleBooksApi extends Context.Tag("GoogleBooksApi")<
  GoogleBooksApi,
  Effect.Effect.Success<typeof make>
>() {
  static readonly Live = Layer.effect(this, make).pipe(
    Layer.provide(BuildGoogleBooksUrl.Live),
  )
}
