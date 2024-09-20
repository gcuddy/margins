import { Schema } from "@effect/schema"
import { Redacted } from "effect"

export const SessionIdString = Schema.String.pipe(Schema.brand("SessionId"))
// actually not sure this needs to be redacted.
export const SessionId = Schema.Redacted(SessionIdString)
export type SessionId = typeof SessionId.Type

export const sessionIdFromString = (token: string): SessionId =>
  Redacted.make(SessionIdString.make(token))

export const sessionIdFromRedacted = (token: Redacted.Redacted): SessionId =>
  token as SessionId
