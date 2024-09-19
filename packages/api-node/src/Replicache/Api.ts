import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Schema } from "@effect/schema"
import { User, UserId, UserNotFound } from "../Domain/User.js"
import { PullRequest, PullResponse } from "../Domain/Replicache.js"
import { Unauthorized } from "../Domain/Actor.js"

export class ReplicacheApi extends HttpApiGroup.make("replicache").pipe(
  HttpApiGroup.prefix("/sync"),
  HttpApiGroup.add(
    HttpApiEndpoint.post("pull", "/pull").pipe(
      HttpApiEndpoint.setPayload(PullRequest),
      HttpApiEndpoint.setSuccess(PullResponse),
      HttpApiEndpoint.addError(Unauthorized),
    ),
  ),
  HttpApiGroup.addError(Unauthorized),
  //   TODO: authentication
) {}
