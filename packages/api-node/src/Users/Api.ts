import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import {
  User,
  UserId,
  UserNotFound,
  UserWithSensitive,
} from "../Domain/User.js"
import { security } from "../Api/Security.js"
import { Unauthorized } from "../Domain/Actor.js"

export class UsersApi extends HttpApiGroup.make("users")
  .add(
    HttpApiEndpoint.get("getUser", "/:id")
      .setPath(Schema.Struct({ id: UserId }))
      .addSuccess(User.json)
      .addError(UserNotFound),
  )
  // .annotateEndpoints(OpenApi.Security, security)
  // .addError(Unauthorized)
  .add(
    HttpApiEndpoint.post("authenticate", "/authenticate")
      .setPayload(Schema.Struct({ userId: UserId }))
      .addSuccess(UserWithSensitive.json)
      .addError(UserNotFound),
  ).prefix('/users') { }
