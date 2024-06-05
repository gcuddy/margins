import * as S from "@effect/schema/Schema"
import { Brand, pipe } from "effect"

// export const URL = pipe(S.String, S.brand("URL"))
export type URL = string & Brand.Brand<"URL">

export const URL = Brand.refined<URL>(
  s => /^https?:\/\//i.test(s),
  s => Brand.error(`Expected ${s} to be a url`), // Error message if the value is not an integer
)

// export class BaseLink extends S.Class

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
  S.Any,
  BaseLink,
  {
    url: pipe(S.String, S.brand("URL")),
  },
) {}

export class SaveLink extends S.TaggedRequest<SaveLink>()(
  "SaveLink",
  S.Any,
  S.String,
  {
    url: pipe(S.String, S.brand("URL")),
  },
) {}
