import { Schema } from "@effect/schema"
import { Model } from "@effect/sql"
import { DateTimeString } from "./DateTime"

export const EntryId = Schema.String.pipe(Schema.brand("EntryId"))
export type EntryId = typeof EntryId.Type

export class Entry extends Model.Class<Entry>("Entry")({
  id: Model.GeneratedByApp(EntryId),
  createdAt: Model.Generated(DateTimeString),
  // updatedAt: Model.GeneratedByApp(DateTimeString),
  updatedAt: Model.DateTimeUpdate,

  author: Model.FieldOption(Schema.String),
  title: Schema.String,
}) {}
