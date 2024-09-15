import { Schema } from "@effect/schema"
import { Model } from "@effect/sql"
import { DateTimeString, DateTimeStringWithoutDefault } from "./DateTime"

export const BookmarkId = Schema.String.pipe(Schema.brand("BookmarkId"))
export type BookmarkId = typeof BookmarkId.Type

// TODO: One data field that contains all relevant data for each type, rather than a million fields
export class Bookmark extends Model.Class<Bookmark>("Bookmark")({
  id: Model.GeneratedByApp(BookmarkId),
  createdAt: Model.Generated(DateTimeString),
  updatedAt: Model.DateTimeUpdate,
  uri: Model.FieldOption(Schema.String),
  entryId: Model.FieldOption(Schema.String),
  userId: Model.Field(Schema.String),
  sortOrder: Model.FieldOption(Schema.Number),
  data: Model.FieldOption(Schema.Unknown),
  stateId: Model.FieldOption(Schema.Number),
  private: Model.Field(Schema.Boolean),
  interactionId: Model.FieldOption(Schema.Number),
  favoriteId: Model.FieldOption(Schema.Number),
  deleted: Model.FieldOption(DateTimeStringWithoutDefault),
  is_read: Model.Field(Schema.Boolean),
  progress: Model.Field(Schema.Number),
  context: Model.FieldOption(Schema.Unknown),
  screenshot: Model.FieldOption(Schema.String),
  source: Model.FieldOption(Schema.String),
  dueDate: Model.FieldOption(DateTimeStringWithoutDefault),
  snoozedUntil: Model.FieldOption(DateTimeStringWithoutDefault),
  originalUrl: Model.FieldOption(Schema.String),
  status: Model.FieldOption(Schema.Literal("Backlog", "Now", "Archive")),
  sort_order: Model.Field(Schema.Number),
  review_timestamp: Model.FieldOption(Schema.Number),
  title: Model.FieldOption(Schema.String),
  author: Model.FieldOption(Schema.String),
  pdf_url: Model.FieldOption(Schema.String),
  rating: Model.FieldOption(Schema.Number),
  seen_at: Model.FieldOption(DateTimeStringWithoutDefault),
  bookmarked_at: Model.FieldOption(DateTimeStringWithoutDefault),
}) {}
