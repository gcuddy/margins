import { Schema } from "@effect/schema"
import { Model } from "@effect/sql"
import { Context, DateTime, Layer } from "effect"
import { Email } from "./Email.js"
import { DateTimeString } from "./DateTime.js"
import { SessionId } from "./SessionId.js"
// import { Context } from "effect"

export const UserId = Schema.String.pipe(Schema.brand("UserId"))
export type UserId = typeof UserId.Type

export class User extends Model.Class<User>("User")({
  id: Model.Generated(UserId),
  email: Email,
  // accountId: Model.GeneratedByApp(AccountId),
  // email: Email,
  // accessToken: Model.Sensitive(AccessToken),
  createdAt: Model.DateTimeFromDate.annotations({
    jsonSchema: {
      type: "string",
      format: "date-time",
    },
  }),
  updatedAt: Model.DateTimeFromDate.annotations({
    jsonSchema: {
      type: "string",
      format: "date-time",
    },
  }),
}) {}

export class CurrentUser extends Context.Tag("Domain/User/CurrentUser")<
  CurrentUser,
  User
>() {
  static readonly Test = Layer.succeed(
    this,
    User.make({
      createdAt: DateTime.unsafeNow(),
      updatedAt: DateTime.unsafeNow(),
      email: Email.make("test@test.com"),
      id: UserId.make("1"),
    }),
  )
}
export class UserWithSensitive extends Model.Class<UserWithSensitive>(
  "UserWithSensitive",
)({
  ...Model.fields(User),
  sessionId: SessionId,
}) {}

export class UserNotFound extends Schema.TaggedError<UserNotFound>()(
  "UserNotFound",
  {
    id: UserId,
  },
) {}
