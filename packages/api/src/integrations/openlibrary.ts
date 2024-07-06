import { Effect } from "effect"
import {
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform"
import { Schema } from "@effect/schema"

// TODO: make not all partial
const SearchDoc = Schema.partial(
  Schema.Struct({
    author_alternative_names: Schema.NullishOr(Schema.Array(Schema.String)),
    author_key: Schema.Array(Schema.String),
    author_name: Schema.Array(Schema.String),
    cover_edition_key: Schema.String,
    cover_i: Schema.Number,
    ddc: Schema.NullishOr(Schema.Array(Schema.String)),
    edition_key: Schema.Array(Schema.String),
    first_publish_year: Schema.Number,
    ia: Schema.NullishOr(Schema.Array(Schema.String)),
    isbn: Schema.Array(Schema.String),
    key: Schema.String,
    language: Schema.Array(Schema.String),
    number_of_pages_median: Schema.Number,
    publish_date: Schema.Array(Schema.String),
    publish_place: Schema.Array(Schema.String),
    publish_year: Schema.Array(Schema.Number),
    publisher: Schema.Array(Schema.String),
    seed: Schema.Array(Schema.String),
    title: Schema.String,
    title_suggest: Schema.String,
    title_sort: Schema.String,
    type: Schema.String,
    id_librarything: Schema.Array(Schema.String),
    id_goodreads: Schema.Array(Schema.String),
    subject: Schema.Array(Schema.String),
    place: Schema.Array(Schema.String),
    publisher_facet: Schema.Array(Schema.String),
    subject_facet: Schema.Array(Schema.String),
    subject_key: Schema.Array(Schema.String),
    ddc_sort: Schema.NullishOr(Schema.String),
  }),
)

export const OpenLibrarySearchResult = Schema.Struct({
  numFound: Schema.Number,
  start: Schema.Number,
  numFoundExact: Schema.Boolean,
  offset: Schema.NullOr(Schema.Number),
  docs: Schema.Array(SearchDoc),
})

export class SearchBooksError {
  readonly _tag = "SearchBooksError"
}

export const searchBooks = (q: string) =>
  HttpClientRequest.get(`https://openlibrary.org/search.json?q=${q}`).pipe(
    HttpClient.fetchOk,
    Effect.andThen(HttpClientResponse.schemaBodyJson(OpenLibrarySearchResult)),
    Effect.scoped,
  )

export const searchBooks2 = (query: string) =>
  Effect.tryPromise({
    try: () =>
      fetch(`https://openlibrary.org/search.json?q=${query}`).then(res =>
        res.json(),
      ),
    catch: () => new SearchBooksError(),
  })
