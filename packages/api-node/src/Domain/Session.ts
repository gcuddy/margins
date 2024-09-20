import { Schema } from "@effect/schema"
import { Model } from "@effect/sql"
import { Redacted } from "effect"
import { DateTimeString } from "./DateTime.js"
import { UserId } from "./User.js"
import {
  SessionId,
  sessionIdFromRedacted,
  sessionIdFromString,
  SessionIdString,
} from "./SessionId.js"

export {
  SessionId,
  sessionIdFromRedacted,
  sessionIdFromString,
  SessionIdString,
}

export class Session extends Model.Class<Session>("Session")({
  id: Model.GeneratedByApp(SessionId),
  user_id: UserId,
  expires_at: Model.DateTimeFromDate.annotations({
    jsonSchema: {
      type: "string",
      format: "date-time",
    },
  }),
}) {}

export class SessionWithMetadata extends Model.Class<SessionWithMetadata>(
  "SessionWithMetadata",
)({
  ...Model.fields(Session),
  fresh: Schema.Boolean.pipe(
    Schema.mutable,
    Schema.propertySignature,
    Schema.withConstructorDefault(() => false),
  ),
}) {}
