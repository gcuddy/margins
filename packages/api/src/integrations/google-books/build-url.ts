import { Config, Context, Effect, Layer, Redacted } from "effect"
import { GoogleBooksApiUrl } from "./google-books-api-url"

const make = Effect.gen(function* () {
  const googleBooksApiUrl = yield* GoogleBooksApiUrl
  const apiKey = yield* Config.redacted("GOOGLE_BOOKS_API_KEY")

  const url = new URL(googleBooksApiUrl)
  url.searchParams.set("key", Redacted.value(apiKey))

  const buildSearchUrl = (query: string) => {
    url.searchParams.set("q", query)
    return url.toString()
  }

  const buildGetUrl = (volumeId: string) => {
    return `${url.toString()}/${volumeId}`
  }

  return { buildSearchUrl, buildGetUrl } as const
})

export class BuildGoogleBooksUrl extends Context.Tag("BuildGoogleBooksUrl")<
  BuildGoogleBooksUrl,
  Effect.Effect.Success<typeof make>
>() {
  static readonly Live = Layer.effect(this, make).pipe(
    Layer.provide(GoogleBooksApiUrl.Live),
  )
}
