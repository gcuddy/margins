import { Schema } from "@effect/schema"
import { Model } from "@effect/sql"
import { DateTimeString } from "./DateTime"

export class TextQuoteSelector extends Schema.Class<TextQuoteSelector>(
  "TextQuoteSelector",
)({
  exact: Schema.String,
  prefix: Schema.NullishOr(Schema.String),
  suffix: Schema.NullishOr(Schema.String),
  type: Schema.Literal("TextQuoteSelector"),
}) {}

// TODO: other selectors
export class Target extends Schema.Class<Target>("Annotation?Target")({
  source: Schema.NullishOr(Schema.String),
  selector: Schema.Union(TextQuoteSelector),
  html: Schema.NullishOr(Schema.String),
  page_num: Schema.NullishOr(Schema.Number),
}) {}

export const AnnotationId = Schema.String.pipe(Schema.brand("AnnotationId"))
export type AnnotationId = typeof AnnotationId.Type

export class Annotation extends Model.Class<Annotation>("Annotation")({
  id: Model.GeneratedByApp(AnnotationId),
  createdAt: Model.Generated(DateTimeString),
  updatedAt: Model.DateTimeUpdate,
  type: Model.Field(Schema.Literal("note", "annotation", "reply")),
  body: Model.FieldOption(Schema.String),

  //   could use parseJson, but our driver already casts it with JSON.parse. But worth thinking about.
  target: Model.FieldOption(Target),
}) {}
