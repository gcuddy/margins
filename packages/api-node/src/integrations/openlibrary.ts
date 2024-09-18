import { Brand, Effect } from "effect"
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

const KeySchema = Schema.Struct({
  key: Schema.String,
})

const TextValueSchema = Schema.Union(
  Schema.String,
  Schema.transform(
    Schema.Struct({
      type: Schema.Literal("/type/text"),
      value: Schema.String,
    }),
    Schema.String,
    {
      strict: true,
      decode: ({ value }) => value,
      encode: value => ({
        type: "/type/text" as const,
        value,
      }),
    },
  ),
)

export const OpenLibraryWork = Schema.partial(
  Schema.Struct({
    title: Schema.String,
    key: Schema.String,
    first_publish_date: Schema.String,
    authors: Schema.Array(
      Schema.Struct({
        author: KeySchema,
        type: KeySchema,
      }),
    ),
    type: KeySchema,
    description: TextValueSchema,
    covers: Schema.Array(Schema.Number),
    subject_places: Schema.Array(Schema.String),
    subject_times: Schema.Array(Schema.String),
    location: Schema.String,
  }),
)

export const OpenLibraryEdition = Schema.partial(
  Schema.Struct({
    description: TextValueSchema,
    notes: TextValueSchema,
    identifiers: Schema.Struct({
      goodreads: Schema.NullishOr(Schema.Array(Schema.String)),
      librarything: Schema.NullishOr(Schema.Array(Schema.String)),
      amazon: Schema.NullishOr(Schema.Array(Schema.String)),
    }),
    title: Schema.String,
    authors: Schema.Array(KeySchema),
    publish_date: Schema.String,
    publishers: Schema.Array(Schema.String),
    series: Schema.Array(Schema.String),
    pagination: Schema.String,
    publish_places: Schema.Array(Schema.String),
    contributions: Schema.Array(Schema.String),
    genres: Schema.Array(Schema.String),
    source_records: Schema.Array(Schema.String),
    work_titles: Schema.Array(Schema.String),
    languages: Schema.Array(KeySchema),
    subjects: Schema.Array(Schema.String),
    publish_country: Schema.String,
    by_statement: Schema.String,
    type: KeySchema,
    covers: Schema.Array(Schema.Number),
    ocaid: Schema.String,
    isbn_10: Schema.Array(Schema.String),
    local_id: Schema.Array(Schema.String),
    key: Schema.String,
    number_of_pages: Schema.Number,
    weight: Schema.String,
    physical_format: Schema.String,
    isbn_13: Schema.Array(Schema.String),
    physical_dimension: Schema.String,
    edition_name: Schema.String,
  }),
)

export const OpenLibraryEditionsResponse = Schema.Struct({
  links: Schema.Struct({
    self: Schema.String,
    work: Schema.String,
    next: Schema.optional(Schema.String),
    prev: Schema.optional(Schema.String),
  }),
  size: Schema.Number,
  entries: Schema.mutable(Schema.Array(OpenLibraryEdition)),
})

export const OpenLibraryAuthor = Schema.partial(
  Schema.Struct({
    name: Schema.String,
    title: Schema.String,
    links: Schema.Array(
      Schema.Struct({
        title: Schema.String,
        url: Schema.String,
        type: Schema.Struct({
          key: Schema.Literal("/type/link"),
        }),
      }),
    ),
    bio: TextValueSchema,
    alternate_names: Schema.Array(Schema.String),
    photos: Schema.Array(Schema.Number),
    wikipedia: Schema.String,
    personal_name: Schema.String,
    entity_type: Schema.String,
    birth_date: Schema.String,
    source_records: Schema.Array(Schema.String),
    key: Schema.String,
    fuller_name: Schema.String,
    remote_ids: Schema.partial(
      Schema.Struct({
        viaf: Schema.String,
        goodreads: Schema.String,
        storygraph: Schema.String,
        isni: Schema.String,
        librarything: Schema.String,
        amazon: Schema.String,
        wikidata: Schema.String,
      }),
    ),
  }),
)

export class SearchBooksError {
  readonly _tag = "SearchBooksError"
}

export const searchBooks = (q: string) =>
  HttpClientRequest.get(
    `https://openlibrary.org/search.json?q=${q}&lang=en&sort=editions`,
  ).pipe(
    HttpClient.fetchOk,
    Effect.andThen(HttpClientResponse.schemaBodyJson(OpenLibrarySearchResult)),
    Effect.scoped,
  )

export type OpenLibraryKey = string & Brand.Brand<"OpenLibraryKey">

export const OpenLibraryKey = Brand.refined<OpenLibraryKey>(
  s => /^ol/i.test(s), // Predicate that the value must satisfy
  s => Brand.error(`Expected ${s} to be a OpenLibraryKey`), // Error message if the value is not an integer
)

export const getWork = (key: OpenLibraryKey) =>
  HttpClientRequest.get(`https://openlibrary.org/works/${key}.json`).pipe(
    HttpClient.fetchOk,
    Effect.andThen(HttpClientResponse.schemaBodyJson(OpenLibraryWork)),
    Effect.scoped,
  )

export const getEditionsForWork = (key: OpenLibraryKey, offset?: number) =>
  HttpClientRequest.get(
    `https://openlibrary.org/works/${key}/editions.json${offset ? `?offset=${offset}` : ""}`,
  ).pipe(
    HttpClient.fetchOk,
    Effect.andThen(
      HttpClientResponse.schemaBodyJson(OpenLibraryEditionsResponse),
    ),
    Effect.withRequestCaching(true),
    Effect.scoped,
  )

export const getAuthor = (key: OpenLibraryKey) =>
  HttpClientRequest.get(`https://openlibrary.org/authors/${key}.json`).pipe(
    HttpClient.fetchOk,
    Effect.andThen(HttpClientResponse.schemaBodyJson(OpenLibraryAuthor)),
    Effect.scoped,
  )

// export const searchBooks2 = (query: string) =>
//   Effect.tryPromise({
//     try: () =>
//       fetch(`https://openlibrary.org/search.json?q=${query}`).then(res =>
//         res.json(),
//       ),
//     catch: () => new SearchBooksError(),
//   })
