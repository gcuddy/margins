import { Schema } from "@effect/schema"
import { Model } from "@effect/sql"
import { DateTimeString, DateTimeStringWithoutDefault } from "./DateTime.js"

export const FavoriteId = Schema.String.pipe(Schema.brand("FavoriteId"))
export type FavoriteId = typeof FavoriteId.Type

export class Favorite extends Model.Class<Favorite>("Favorite")({
  id: Model.GeneratedByApp(FavoriteId),
  createdAt: Model.Generated(DateTimeString),
  updatedAt: Model.GeneratedByApp(DateTimeString),
  userId: Model.Field(Schema.String),
  deleted: Model.FieldOption(DateTimeStringWithoutDefault),
  tagId: Model.FieldOption(Schema.Number),
  smartListId: Model.FieldOption(Schema.Number),
  annotationId: Model.FieldOption(Schema.String),
  bookmarkId: Model.FieldOption(Schema.String),
  entryId: Model.FieldOption(Schema.String),
  feedId: Model.FieldOption(Schema.Number),
  sortOrder: Model.FieldOption(Schema.Number),
  folderName: Model.FieldOption(Schema.String),
  parentId: Model.FieldOption(Schema.String),
  type: Model.Field(Schema.Literal("FOLDER", "FAVORITE")),
  collectionId: Model.FieldOption(Schema.Number),
}) {}
