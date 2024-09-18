import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Schema } from "@effect/schema"
import { User, UserId, UserNotFound } from "../Domain/User.js"

export class UsersApi extends HttpApiGroup.make("users").pipe(
  HttpApiGroup.add(
    HttpApiEndpoint.get("getUser", "/users/:id").pipe(
      HttpApiEndpoint.setPath(Schema.Struct({ id: UserId })),
      HttpApiEndpoint.setSuccess(User.json),
      HttpApiEndpoint.addError(UserNotFound),
    ),
  ),
  //   TODO: authentication
) {}
