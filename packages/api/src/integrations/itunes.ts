import { Effect } from "effect"
import {
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform"
import { Schema } from "@effect/schema"

export const Media = Schema.Literal(
  "movie",
  "podcast",
  "music",
  "musicVideo",
  "audiobook",
  "shortFilm",
  "tvShow",
  "software",
  "ebook",
  "all",
)

// TODO: entity, attributes

export const SearchInput = Schema.Struct({
  term: Schema.String,
  country: Schema.optional(Schema.String.pipe(Schema.length(2))),
  media: Schema.optional(Media),
})

export type SearchInput = Schema.Schema.Type<typeof SearchInput>

export const Item = Schema.partial(
  Schema.Struct({
    artistIds: Schema.Array(Schema.Number),
    artistId: Schema.Number,
    artistName: Schema.String,
    genres: Schema.Array(Schema.String),
    price: Schema.Number,
    description: Schema.String,
    releaseDate: Schema.Date,
    trackId: Schema.Number,
    trackName: Schema.String,
    trackCensoredName: Schema.String,
    artistViewUrl: Schema.String,
    trackViewUrl: Schema.String,
    artworkUrl60: Schema.String,
    artworkUrl100: Schema.String,
    currency: Schema.String,
    fileSizeBytes: Schema.Number,
    formattedPrice: Schema.String,
    genreIds: Schema.Array(Schema.String),
    kind: Schema.String,
    userRatingCount: Schema.optional(Schema.Number),
    averageUserRating: Schema.optional(Schema.Number),
  }),
)

export const SearchResponse = Schema.Struct({
  resultCount: Schema.Number,
  results: Schema.Array(Item),
})

export const search = (params: SearchInput) =>
  HttpClientRequest.get(
    `https://itunes.apple.com/search?term=${params.term}${params.country ? "&country=" + params.country : ""}${params.media ? "&media=" + params.media : ""}`,
  ).pipe(
    HttpClient.fetchOk,
    Effect.andThen(HttpClientResponse.schemaBodyJson(SearchResponse)),
    Effect.scoped,
  )

export const LookupResponse = Schema.Struct({
  resultCount: Schema.Literal(1),
  results: Schema.Array(Item),
})

export const lookup = (params: { id: number }) =>
  HttpClientRequest.get(`https://itunes.apple.com/lookup?id=${params.id}`).pipe(
    HttpClient.fetchOk,
    Effect.andThen(HttpClientResponse.schemaBodyJson(LookupResponse)),
    Effect.andThen(({ results }) => results[0]!),
    Effect.scoped,
  )

export class Lookup extends Schema.TaggedRequest<Lookup>()(
  "iTunesLookup",
  Schema.String,
  Item,
  {
    id: Schema.Number,
  },
) {}
