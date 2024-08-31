import { Schema } from "@effect/schema"
import { Config, Effect } from "effect"
import { BuildGoogleBooksUrl } from "./build-url"
import {
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform"

export class GoogleBook extends Schema.Class<GoogleBook>("GoogleBook")({
  title: Schema.String,
  author: Schema.String,
  publisher: Schema.String,
  publishedDate: Schema.String,
  description: Schema.String,
  pageCount: Schema.Number,
  categories: Schema.Array(Schema.String),
  imageLinks: Schema.Struct({
    smallThumbnail: Schema.String,
    thumbnail: Schema.String,
  }),
  language: Schema.String,
  previewLink: Schema.String,
  infoLink: Schema.String,
  canonicalVolumeLink: Schema.String,
}) {}

const make = Effect.gen(function* () {
  const buildGoogleBooksUrl = yield* BuildGoogleBooksUrl

  const getBook = (volumeId: string) => {
    const url = buildGoogleBooksUrl.buildGetUrl(volumeId)
    return HttpClientRequest.get(url).pipe(
      HttpClient.fetchOk,
      Effect.andThen(HttpClientResponse.schemaBodyJson(GoogleBook)),
      Effect.scoped,
    )
  }

  const search = (query: string) => {
    const url = buildGoogleBooksUrl.buildSearchUrl(query)
    return HttpClientRequest.get(url).pipe(
      HttpClient.fetchOk,
      Effect.andThen(HttpClientResponse.schemaBodyJson(GoogleBook)),
      Effect.scoped,
    )
  }

  return { get: getBook, search } as const
})
