import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "@effect/schema"
import {
  User,
  UserId,
  UserNotFound,
  UserWithSensitive,
} from "../Domain/User.js"
import { security } from "../Api/Security.js"
import { Unauthorized } from "../Domain/Actor.js"

export class UsersApi extends HttpApiGroup.make("users").pipe(
  HttpApiGroup.add(
    HttpApiEndpoint.get("getUser", "/users/:id").pipe(
      HttpApiEndpoint.setPath(Schema.Struct({ id: UserId })),
      HttpApiEndpoint.setSuccess(User.json),
      HttpApiEndpoint.addError(UserNotFound),
    ),
  ),
  HttpApiGroup.annotateEndpoints(OpenApi.Security, security),
  HttpApiGroup.addError(Unauthorized),
  HttpApiGroup.add(
    HttpApiEndpoint.post("authenticate", "/users/authenticate").pipe(
      HttpApiEndpoint.setPayload(Schema.Struct({ userId: UserId })),
      HttpApiEndpoint.setSuccess(UserWithSensitive.json),
      HttpApiEndpoint.addError(UserNotFound),
    ),
  ),
  //   TODO: authentication
) {}
