import { Schema } from "@effect/schema"
import { Model } from "@effect/sql"
// import { Context } from "effect"

export const UserId = Schema.Number.pipe(Schema.brand("UserId"))
export type UserId = typeof UserId.Type
export class User extends Model.Class<User>("User")({
  id: Model.Generated(UserId),
  // accountId: Model.GeneratedByApp(AccountId),
  // email: Email,
  // accessToken: Model.Sensitive(AccessToken),
  createdAt: Model.DateTimeInsert,
  updatedAt: Model.DateTimeUpdate,
}) {}
