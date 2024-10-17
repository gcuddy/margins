import { Config, Effect, flow, Layer, Metric, Redacted, Schedule } from "effect"
import {
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform"
import { GoogleBookVolume, GoogleBookVolumes } from "./schema.js"
import { NodeHttpClient } from "@effect/platform-node"

const make = Effect.gen(function* () {
  const apiKey = yield* Config.redacted("GOOGLE_BOOKS_API_KEY")

  const client = (yield* HttpClient.HttpClient).pipe(
    HttpClient.filterStatusOk,
    HttpClient.mapRequest(
      flow(
        HttpClientRequest.prependUrl(
          'https://www.googleapis.com/books/v1/volumes'
        ),
        HttpClientRequest.setUrlParam('key', Redacted.value(apiKey)),
        HttpClientRequest.acceptJson,
      )
    )
  )

  const get = (volumeId: string) => {
    return client.get(`/${volumeId}`).pipe(
      Effect.flatMap(HttpClientResponse.schemaBodyJson(GoogleBookVolume)),
      Effect.scoped,
      Effect.retry({
        times: 3,
        schedule: Schedule.exponential(200),
      }),
      Effect.orDie,
      Effect.withSpan("google-books-api-get"),
    )
  }

  const search = (query: string) => {
    return client.pipe(
      HttpClient.mapRequest(
        flow(
          HttpClientRequest.appendUrlParam('q', query)
        )
      )
    ).get('/').pipe(
      Effect.flatMap(HttpClientResponse.schemaBodyJson(GoogleBookVolumes)),
      Effect.scoped,
      Effect.retry({
        times: 3,
        schedule: Schedule.exponential(200),
      }),
      Effect.orDie,
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

export class GoogleBooks extends Effect.Tag("GoogleBooks")<
  GoogleBooks,
  Effect.Effect.Success<typeof make>
>() {
  static readonly Live = Layer.effect(this, make).pipe(
    Layer.provide(NodeHttpClient.layerUndici)
  )
}

