import { Context, Effect, Layer, Metric } from "effect"
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
      Effect.withSpan("google-books-api-get"),
    )
  }

  const search = (query: string) => {
    const url = buildGoogleBooksUrl.buildSearchUrl(query)
    return HttpClientRequest.get(url).pipe(
      HttpClient.fetchOk,
      Effect.andThen(HttpClientResponse.schemaBodyJson(GoogleBookVolumes)),
      Effect.scoped,
      Metric.trackAll(
        Metric.counter("google-books-api_calls", {
          bigint: true,
          incremental: true,
        }),
        1n,
      ),
      Effect.withSpan("google-books-api-search"),
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
