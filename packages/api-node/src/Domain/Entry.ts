import { Schema } from "@effect/schema"
import { Model } from "@effect/sql"
import {
  DateTimeFromDate,
  DateTimeString,
  DateTimeStringWithoutDefault,
} from "./DateTime.js"
import { HttpApiSchema } from "@effect/platform"
import { UserId } from "./User.js"
import * as FieldOption from "./FieldOption.js"
import { Option } from "effect"

export const EntryId = Schema.String.pipe(Schema.brand("EntryId"))
export type EntryId = typeof EntryId.Type

Schema.TaggedClass("Entry")

// TODO: One data field that contains all relevant data for each type, rather than a million fields
export class Entry extends Model.Class<Entry>("Entry")({
  id: Model.GeneratedByApp(EntryId),
  createdAt: DateTimeFromDate,
  updatedAt: DateTimeFromDate,
  author: FieldOption.String,
  title: Schema.Union(
    Schema.OptionFromNullishOr(Schema.NonEmptyTrimmedString, null),
    Schema.OptionFromNonEmptyTrimmedString,
  ).annotations({
    jsonSchema: {
      type: ["string"],
    },
  }),
  type: Model.Field(
    Schema.Literal(
      "article",
      "podcast",
      "rss",
      "pdf",
      "epub",
      "bookmark",
      "image",
      "video",
      "tweet",
      "audio",
      "book",
      "movie",
      "tv",
      "song",
      "album",
      "playlist",
      "recipe",
      "game",
      "board_game",
    ),
  ),
  uri: FieldOption.String,
  html: FieldOption.String,
  text: FieldOption.String,
  image: FieldOption.String,
  guid: FieldOption.String,
  wordCount: FieldOption.Number,
  siteName: FieldOption.String,
  summary: FieldOption.String,
  published: FieldOption.DateTime,
  updated: FieldOption.DateTime,
  feedId: FieldOption.Number,
  // original: FieldOption.Unknown,
  // recipe: FieldOption.Unknown,
  podcastIndexId: FieldOption.BigInt,
  duration: FieldOption.Number,
  enclosureLength: FieldOption.Number,
  enclosureType: FieldOption.String,
  enclosureUrl: FieldOption.String,
  googleBooksId: FieldOption.String,
  tmdbId: FieldOption.Number,
  // schemaOrg: FieldOption.Unknown,
  // tmdbData: FieldOption.Unknown,
  screenshot: FieldOption.String,
  // extended: FieldOption.Unknown,
  youtubeId: FieldOption.String,
  pageCount: FieldOption.Number,
  genres: FieldOption.String,
  language: FieldOption.String,
  publisher: FieldOption.String,
  // author_extra: FieldOption.Unknown,
  spotifyId: FieldOption.String,
  owned_by_id: FieldOption.String,
  pdf_fingerprint: FieldOption.String,
  estimatedReadingTime: FieldOption.Number,
  book_genre: Schema.OptionFromNullishOr(
    Schema.Literal("Fiction", "NonFiction"),
    undefined,
  ).annotations({
    jsonSchema: {
      type: ["string"],
      enum: ["Fiction", "NonFiction"],
      optional: true,
    },
  }),
  // remap to publicId?
  public_id: FieldOption.String,

  user_id: Schema.OptionFromNullishOr(UserId, undefined).annotations({
    jsonSchema: {
      type: ["string"],
      optional: true,
    },
  }),
  parent_id: Schema.OptionFromNullishOr(EntryId, undefined).annotations({
    jsonSchema: {
      type: ["string"],
      optional: true,
    },
  }),
}) {
  // TODO: use this for the replicache key value on be/fe
  static readonly key = "entries"
}

export class EntryNotFound extends Schema.TaggedError<EntryNotFound>()(
  "EntryNotFound",
  { id: EntryId },
  HttpApiSchema.annotations({ status: 404 }),
) {}
