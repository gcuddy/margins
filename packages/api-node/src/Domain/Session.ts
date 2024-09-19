import { Schema } from "@effect/schema"
import { Model } from "@effect/sql"
import { Redacted } from "effect"
import { DateTimeString } from "./DateTime.js"
import { UserId } from "./User.js"

export const SessionIdString = Schema.String.pipe(Schema.brand("SessionId"))
// actually not sure this needs to be redacted.
export const SessionId = Schema.Redacted(SessionIdString)
export type SessionId = typeof SessionId.Type

export const sessionIdFromString = (token: string): SessionId =>
  Redacted.make(SessionIdString.make(token))

export const sessionIdFromRedacted = (token: Redacted.Redacted): SessionId =>
  token as SessionId

export class Session extends Model.Class<Session>("Session")({
  id: Model.GeneratedByApp(SessionId),
  user_id: UserId,
  expires_at: Model.GeneratedByApp(DateTimeString),
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
