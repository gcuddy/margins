import { Schema } from "@effect/schema"
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

export const Boolean = Schema.OptionFromNullishOr(
  Schema.Boolean,
  undefined,
).annotations({
  jsonSchema: {
    type: ["boolean"],
    optional: true,
  },
})
