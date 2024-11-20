import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { PullRequest, PullResponse, PushRequest } from "../Domain/Replicache.js"
import { Authentication } from "../Users/Api.js"

export class ReplicacheApi extends HttpApiGroup.make("replicache")
  .add(
    HttpApiEndpoint.post("pull", "/pull")
      .setPayload(PullRequest)
      .addSuccess(PullResponse)
  )
  // .add(
  //   HttpApiEndpoint.post('push', '/push')
  //     .setPayload(PushRequest)
  // )
  .middleware(Authentication)
  .prefix("/sync") { }
//   TODO: authentication
