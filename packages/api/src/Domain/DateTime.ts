import * as Schema from "@effect/schema/Schema"
import * as DateTime from "effect/DateTime"

export const DateTimeStringWithoutDefault = Schema.transform(
  Schema.String,
  Schema.DateTimeUtcFromSelf,
  {
    strict: true,
    decode: str => {
      return DateTime.unsafeMake(str.replace(" ", "T") + "Z")
    },
    encode: dt => {
      return DateTime.formatIso(dt).replace("T", " ").replace("Z", "")
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
