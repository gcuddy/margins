import { Schema } from "@effect/schema"
import { Model } from "@effect/sql"

export const EntryId = Schema.String.pipe(Schema.brand("EntryId"))
export type EntryId = typeof EntryId.Type
export class Entry extends Model.Class<Entry>("Entry")({
  id: Model.Generated(EntryId),
  createdAt: Model.DateTimeInsert,
  updatedAt: Model.DateTimeUpdate,

  author: Model.FieldOption(Schema.String),
  title: Schema.String,
}) {}
