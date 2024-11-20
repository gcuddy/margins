import { Schema } from "effect"
import { DateTimeFromDate } from "./DateTime.js"

// todo: variants
export const String = Schema.OptionFromNullishOr(
  Schema.String,
  undefined,
).annotations({
  jsonSchema: {
    type: ["string"],
    optional: true,
  },
})

export const Number = Schema.OptionFromNullishOr(
  Schema.Number,
  undefined,
).annotations({
  jsonSchema: {
    type: ["number"],
    optional: true,
  },
})

export const BigInt = Schema.OptionFromNullishOr(
  Schema.BigInt,
  undefined,
).annotations({
  jsonSchema: {
    type: ["number"],
    optional: true,
  },
})

export const DateTime = Schema.OptionFromNullishOr(
  DateTimeFromDate,
  undefined,
).annotations({
  jsonSchema: {
    type: ["string"],
    format: "date-time",
    optional: true,
  },
})

export const BooleanFromNumber = Schema.transform(
  Schema.Number,
  Schema.Boolean,
  {
    strict: true,
    encode: bool => bool ? 1 : 0,
    decode: num => num === 0 ? false : true
  }
)

export const Boolean = Schema.OptionFromNullishOr(
  BooleanFromNumber,
  undefined,
).annotations({
  jsonSchema: {
    type: ["boolean"],
    optional: true,
  },
})
