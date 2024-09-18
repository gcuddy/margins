import { Config, Context, Effect, Layer } from "effect"

export class GoogleBooksApiUrl extends Context.Tag("GoogleBooksApiUrl")<
  GoogleBooksApiUrl,
  string
>() {
  static readonly Live = Layer.effect(
    this,
    Effect.gen(function* () {
      const baseUrl = yield* Config.string("GOOGLE_API_URL")
      return `${baseUrl}/books/v1/volumes`
    }),
  )
}
