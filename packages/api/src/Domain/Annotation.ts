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

export class CssSelector extends Schema.Class<CssSelector>("CssSelector")({
  type: Schema.Literal("CssSelector"),
  value: Schema.String,
}) {}

export class TimestampSelector extends Schema.Class<TimestampSelector>(
  "TimestampSelector",
)({
  type: Schema.Literal("FragmentSelector"),
  conformsTo: Schema.Literal("http://www.w3.org/TR/media-frags/"),
  value: Schema.String,
}) {}

export class XPathSelector extends Schema.Class<XPathSelector>("XPathSelector")(
  {
    type: Schema.Literal("XPathSelector"),
    value: Schema.String,
  },
) {}

export class TextPositionSelector extends Schema.Class<TextPositionSelector>(
  "TextPositionSelector",
)({
  type: Schema.Literal("TextPositionSelector"),
  start: Schema.Number,
  end: Schema.Number,
}) {}

export class RangeSelector extends Schema.Class<RangeSelector>("RangeSelector")(
  {
    type: Schema.Literal("RangeSelector"),
    startSelector: Schema.Union(TextQuoteSelector, XPathSelector),
    endSelector: Schema.Union(TextQuoteSelector, XPathSelector),
  },
) {}

export class BookSelector extends Schema.Class<BookSelector>("BookSelector")({
  type: Schema.Literal("BookSelector"),
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
export class Target extends Schema.Class<Target>("Annotation?Target")({
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
  createdAt: Model.Generated(DateTimeString),
  updatedAt: Model.DateTimeUpdate,
  type: Model.Field(Schema.Literal("note", "annotation", "reply")),
  body: Model.FieldOption(Schema.String),

  //   could use parseJson, but our driver already casts it with JSON.parse. But worth thinking about.
  target: Model.FieldOption(Target),
}) {}
