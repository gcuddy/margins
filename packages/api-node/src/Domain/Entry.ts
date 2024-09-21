import { Schema } from "@effect/schema"
import { Model } from "@effect/sql"
import { DateTimeString, DateTimeStringWithoutDefault } from "./DateTime.js"
import { HttpApiSchema } from "@effect/platform"
import { UserId } from "./User.js"

export const EntryId = Schema.String.pipe(Schema.brand("EntryId"))
export type EntryId = typeof EntryId.Type

// TODO: One data field that contains all relevant data for each type, rather than a million fields
export class Entry extends Model.Class<Entry>("Entry")({
  id: Model.GeneratedByApp(EntryId),
  createdAt: Model.DateTimeFromDate.annotations({
    jsonSchema: {
      type: "string",
      format: "date-time",
    },
  }),
  updatedAt: Model.DateTimeFromDate.annotations({
    jsonSchema: {
      type: "string",
      format: "date-time",
    },
  }),

  author: Model.FieldOption(Schema.String),
  title: Model.FieldOption(Schema.String),
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
  uri: Model.FieldOption(Schema.String),
  html: Model.FieldOption(Schema.String),
  text: Model.FieldOption(Schema.String),
  image: Model.FieldOption(Schema.String),
  guid: Model.FieldOption(Schema.String),
  wordCount: Model.FieldOption(Schema.Number),
  siteName: Model.FieldOption(Schema.String),
  summary: Model.FieldOption(Schema.String),
  media: Model.FieldOption(Schema.Unknown),
  published: Model.FieldOption(
    Model.DateTimeFromDate.annotations({
      jsonSchema: {
        type: "string",
        format: "date-time",
      },
    }),
  ),
  updated: Model.FieldOption(
    Model.DateTimeFromDate.annotations({
      jsonSchema: {
        type: "string",
        format: "date-time",
      },
    }),
  ),
  feedId: Model.FieldOption(Schema.Number),
  original: Model.FieldOption(Schema.Unknown),
  recipe: Model.FieldOption(Schema.Unknown),
  podcastIndexId: Model.FieldOption(Schema.BigInt),
  duration: Model.FieldOption(Schema.Number),
  enclosureLength: Model.FieldOption(Schema.Number),
  enclosureType: Model.FieldOption(Schema.String),
  enclosureUrl: Model.FieldOption(Schema.String),
  googleBooksId: Model.FieldOption(Schema.String),
  tmdbId: Model.FieldOption(Schema.Number),
  schemaOrg: Model.FieldOption(Schema.Unknown),
  tmdbData: Model.FieldOption(Schema.Unknown),
  screenshot: Model.FieldOption(Schema.String),
  extended: Model.FieldOption(Schema.Unknown),
  youtubeId: Model.FieldOption(Schema.String),
  pageCount: Model.FieldOption(Schema.Number),
  genres: Model.FieldOption(Schema.String),
  language: Model.FieldOption(Schema.String),
  publisher: Model.FieldOption(Schema.String),
  author_extra: Model.FieldOption(Schema.Unknown),
  spotifyId: Model.FieldOption(Schema.String),
  owned_by_id: Model.FieldOption(Schema.String),
  pdf_fingerprint: Model.FieldOption(Schema.String),
  estimatedReadingTime: Model.FieldOption(Schema.Number),
  book_genre: Model.FieldOption(Schema.Literal("Fiction", "NonFiction")),
  // remap to publicId?
  public_id: Model.FieldOption(Schema.String),

  user_id: Model.FieldOption(UserId),
  parent_id: Model.FieldOption(EntryId),
}) {}

export class EntryNotFound extends Schema.TaggedError<EntryNotFound>()(
  "EntryNotFound",
  { id: EntryId },
  HttpApiSchema.annotations({ status: 404 }),
) {}
