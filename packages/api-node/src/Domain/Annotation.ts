import { Schema } from "@effect/schema"
import { Model } from "@effect/sql"
import { DateTimeString, DateTimeStringWithoutDefault } from "./DateTime.js"

export class TextQuoteSelector extends Schema.Class<TextQuoteSelector>(
  "TextQuoteSelector",
)({
  exact: Schema.String,
  prefix: Schema.NullishOr(Schema.String),
  suffix: Schema.NullishOr(Schema.String),
  type: Schema.Literal("TextQuoteSelector"),
}) {}

export class CssSelector extends Schema.Class<CssSelector>("CssSelector")({
  type: Schema.tag("CssSelector"),
  value: Schema.String,
}) {}

export class TimestampSelector extends Schema.Class<TimestampSelector>(
  "TimestampSelector",
)({
  type: Schema.tag("FragmentSelector"),
  conformsTo: Schema.Literal("http://www.w3.org/TR/media-frags/"),
  value: Schema.String,
}) {}

export class XPathSelector extends Schema.Class<XPathSelector>("XPathSelector")(
  {
    type: Schema.tag("XPathSelector"),
    value: Schema.String,
  },
) {}

export class TextPositionSelector extends Schema.Class<TextPositionSelector>(
  "TextPositionSelector",
)({
  type: Schema.tag("TextPositionSelector"),
  start: Schema.Number,
  end: Schema.Number,
}) {}

export class RangeSelector extends Schema.Class<RangeSelector>("RangeSelector")(
  {
    type: Schema.tag("RangeSelector"),
    startSelector: Schema.Union(TextQuoteSelector, XPathSelector),
    endSelector: Schema.Union(TextQuoteSelector, XPathSelector),
  },
) {}

export class BookSelector extends Schema.Class<BookSelector>("BookSelector")({
  type: Schema.tag("BookSelector"),
  value: Schema.NullishOr(Schema.String),
  pageNumber: Schema.Number,
}) {}

export const Selector = Schema.Union(
  TextQuoteSelector,
  CssSelector,
  TimestampSelector,
  XPathSelector,
  TextPositionSelector,
  RangeSelector,
  BookSelector,
)

// TODO: other selectors
export class Target extends Schema.Class<Target>("Annotation/Target")({
  source: Schema.NullishOr(Schema.String),
  selector: Schema.Union(
    Selector,
    Schema.Tuple(TextQuoteSelector, TextPositionSelector),
    Schema.Tuple(TextQuoteSelector, BookSelector),
  ),
  html: Schema.NullishOr(Schema.String),
  page_num: Schema.NullishOr(Schema.Number),
}) {}

export const AnnotationId = Schema.String.pipe(Schema.brand("AnnotationId"))
export type AnnotationId = typeof AnnotationId.Type

export class Annotation extends Model.Class<Annotation>("Annotation")({
  id: Model.GeneratedByApp(AnnotationId),
  createdAt: Model.DateTimeFromDate,
  updatedAt: Model.DateTimeFromDate,
  body: Model.FieldOption(Schema.String),
  type: Model.Field(
    Schema.Literal("note", "annotation", "reply", "bookmark", "document", "qa"),
  ),
  private: Model.Field(Schema.Boolean),
  target: Model.FieldOption(Target),
  entryId: Model.FieldOption(Schema.String),
  parentId: Model.FieldOption(Schema.String),
  deleted: Model.FieldOption(Model.DateTimeFromDate),
  userId: Model.Field(Schema.String),
  sortOrder: Model.Field(Schema.Number),
  bookmarkId: Model.FieldOption(Schema.String),
  editedAt: Model.FieldOption(Model.DateTimeFromDate),
  color: Model.FieldOption(Schema.String),
  contentData: Model.FieldOption(Schema.Unknown),
  title: Model.FieldOption(Schema.String),
  chosenIcon: Model.FieldOption(Schema.Unknown),
  html: Model.FieldOption(Schema.String),
  quote: Model.FieldOption(Schema.String),
  exact: Model.FieldOption(Schema.String),
  start: Model.FieldOption(Schema.Number),
  due_timestamp: Model.FieldOption(Model.DateTimeFromDate),
  interval_ms: Model.FieldOption(Schema.BigInt),
  last_reviewed_at: Model.FieldOption(Model.DateTimeFromDate),
  srs: Model.Field(Schema.Boolean),
  srs_created_at: Model.FieldOption(Model.DateTimeFromDate),
  response: Model.FieldOption(Schema.String),
  icon: Model.FieldOption(Schema.String),
  highlight_color: Model.Field(
    Schema.Literal("Yellow", "Blue", "Green", "Pink", "Purple"),
  ),
}) {}

