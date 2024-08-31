import { Schema } from "@effect/schema"

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
