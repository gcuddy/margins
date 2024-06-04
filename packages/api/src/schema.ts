import * as S from "@effect/schema/Schema"
import { pipe } from "effect"

export const URL = pipe(S.String, S.brand("URL"))
export type URL = S.Schema.Type<typeof URL>

// export class BaseLink extends S.Class

export const BaseLink = S.Struct({
  url: URL,
  title: S.String,
  image: S.optional(S.String),
  description: S.optional(S.String),
})

export class GetLink extends S.TaggedRequest<GetLink>()(
  "GetLink",
  //   TODO
  S.Any,
  BaseLink,
  {
    url: URL,
  },
) {}
