import * as S from "@effect/schema/Schema"
import { Brand, pipe } from "effect"
import {
  OpenLibraryAuthor,
  OpenLibraryEditionsResponse,
  OpenLibrarySearchResult,
  OpenLibraryWork,
} from "./integrations/openlibrary.js"
import * as ITunes from "./integrations/itunes.js"

// export const URL = pipe(S.String, S.brand("URL"))
export type URL = string & Brand.Brand<"URL">

export const URL = Brand.refined<URL>(
  s => /^https?:\/\//i.test(s),
  s => Brand.error(`Expected ${s} to be a url`), // Error message if the value is not an integer
)

// export class BaseLink extends S.Class

export class LinkError extends S.TaggedError<LinkError>()("LinkError", {
  message: S.String,
}) {}

export const BaseLink = S.Struct({
  url: pipe(S.String, S.brand("URL")),
  title: S.String,
  image: S.optional(S.String),
  description: S.optional(S.String),
  author: S.optional(S.String),
  markdown: S.optional(S.String),
  html: S.optional(S.String),
  published: S.optional(S.Date),
  wordCount: S.optional(S.Number),
})

export class GetLink extends S.TaggedRequest<GetLink>()(
  "GetLink",
  //   TODO
  LinkError,
  BaseLink,
  {
    url: pipe(S.String, S.brand("URL")),
  },
) {}

export class SaveLink extends S.TaggedRequest<SaveLink>()(
  "SaveLink",
  LinkError,
  S.String,
  {
    url: pipe(S.String, S.brand("URL")),
  },
) {}

export class GetOpenLibraryBook extends S.TaggedRequest<GetOpenLibraryBook>()(
  "GetOpenLibraryBook",
  S.String,
  OpenLibraryWork,
  {
    key: pipe(S.String, S.brand("OpenLibraryKey")),
  },
) {}

export class GetOpenLibraryBookEditions extends S.TaggedRequest<GetOpenLibraryBookEditions>()(
  "GetOpenLibraryBookEditions",
  S.String,
  OpenLibraryEditionsResponse,
  {
    key: pipe(S.String, S.brand("OpenLibraryKey")),
    offset: S.optional(S.Number),
  },
) {}

export class GetOpenLibraryAuthor extends S.TaggedRequest<GetOpenLibraryAuthor>()(
  "GetOpenLibraryAuthor",
  S.String,
  OpenLibraryAuthor,
  {
    key: pipe(S.String, S.brand("OpenLibraryKey")),
  },
) {}

export class SearchOpenLibrary extends S.TaggedRequest<SearchOpenLibrary>()(
  "SearchOpenLibrary",
  S.String,
  OpenLibrarySearchResult,
  {
    query: S.String,
  },
) {}

export class SearchItunes extends S.TaggedRequest<SearchItunes>()(
  "SearchItunes",
  S.String,
  ITunes.SearchResponse,
  {
    term: S.String,
    country: S.optional(S.String),
    media: S.optional(ITunes.Media),
  },
) {}
