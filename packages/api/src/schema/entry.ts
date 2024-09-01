import { Schema } from "@effect/schema"
import { generate } from "@rocicorp/rails"

export class Entry extends Schema.Class<Entry>("Entry")({
  id: Schema.String,
  updatedAt: Schema.Date,
  uri: Schema.String,
  title: Schema.String,
  summary: Schema.String,
  image: Schema.String,
}) {}

export const actions = generate("Entry", Schema.decodeUnknownSync(Entry))
