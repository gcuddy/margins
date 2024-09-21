import * as Schema from "@effect/schema/Schema"
import { Model } from "@effect/sql"
import * as DateTime from "effect/DateTime"


export const DateTimeFromString = Schema.transform(
  Schema.String,
  Schema.DateTimeUtcFromSelf,
  {
    decode: DateTime.unsafeMake,
    encode: DateTime.formatIso,
    strict: true,
  },
)

export const DateTimeFromDate = Schema.Union(
  Model.DateTimeFromDate,
  DateTimeFromString,
).annotations({
  jsonSchema: {
    type: "string",
    format: "date-time",
  },
})

export const DateTimeStringWithoutDefault = Schema.transform(
  Schema.String,
  Schema.Union(
    Schema.DateTimeUtcFromSelf,
    Schema.DateTimeUtc,
    Schema.DateFromString,
    Model.DateTimeFromDate,
  ),
  {
    strict: true,
    decode: str => {
      console.log("str", str)
      return DateTime.unsafeMake(str.replace(" ", "T") + "Z")
    },
    encode: dt => {
      console.log("dt", dt)
      if (DateTime.isDateTime(dt)) {
        return DateTime.formatIso(dt).replace("T", " ").replace("Z", "")
      }
      return new Date(dt).toISOString().replace("T", " ").replace("Z", "")
    },
  },
)

/**
 * Describes a schema made for MYSql that converts between Database String and DateTimeUTC (with defaults)
 */
export const DateTimeString = DateTimeStringWithoutDefault.pipe(
  Schema.propertySignature,
  Schema.withConstructorDefault(() => DateTime.unsafeNow()),
)
