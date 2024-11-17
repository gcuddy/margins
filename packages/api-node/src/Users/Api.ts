import { HttpApiEndpoint, HttpApiGroup, HttpApiMiddleware, HttpApiSecurity, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import {
  CurrentUser,
  User,
  UserId,
  UserNotFound,
  UserWithSensitive,
} from "../Domain/User.js"
import { security } from "../Api/Security.js"
import { Unauthorized } from "../Domain/Actor.js"

export class Authentication extends HttpApiMiddleware.Tag<Authentication>()(
  "Users/Api/Authentication",
  {
    provides: CurrentUser,
    failure: Unauthorized,
    security: {
      bearer: HttpApiSecurity.bearer,
    },
  },
) { }

export class UsersApi extends HttpApiGroup.make("users")
  .add(
    HttpApiEndpoint.get("getUser", "/:id")
      .setPath(Schema.Struct({ id: UserId }))
      .addSuccess(User.json)
      .addError(UserNotFound),
  )
  .middlewareEndpoints(Authentication)
  // .annotateEndpoints(OpenApi.Security, security)
  // .addError(Unauthorized)
  .add(
    HttpApiEndpoint.post("authenticate", "/authenticate")
      .setPayload(Schema.Struct({ userId: UserId }))
      .addSuccess(UserWithSensitive.json)
      .addError(UserNotFound),
  ).prefix('/users')
  .annotate(OpenApi.Title, "Users")
  .annotate(OpenApi.Description, "Manage users") { }
