import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Schema } from "@effect/schema"
import { PullRequest, PullResponse, PushRequest } from "../services/Replicache"

// Our domain "User" Schema
class User extends Schema.Class<User>("User")({
  id: Schema.Number,
  name: Schema.String,
  createdAt: Schema.DateTimeUtc,
}) {}


class SyncAPI extends HttpApiGroup.make("sync").pipe(
  HttpApiGroup.add(
    HttpApiEndpoint.post("push", "/push").pipe(
      HttpApiEndpoint.setPayload(PushRequest),
      HttpApiEndpoint.setSuccess(
        Schema.Struct({
          success: Schema.Literal(true),
        }),
      ),
    ),
  ),
  HttpApiGroup.add(
    HttpApiEndpoint.post("pull", "/pull").pipe(
      HttpApiEndpoint.setPayload(PullRequest),
      HttpApiEndpoint.setSuccess(PullResponse),
    ),
  ),
) {}

class API extends HttpApi.empty.pipe(HttpApi.addGroup(SyncAPI)) {}

// --------------------------------------------
// Implementation
// --------------------------------------------

// TODO:
// const SyncAPILive = HttpApiBuilder.group(API, "sync", handlers =>
//   handlers.pipe(
//     HttpApiBuilder.handle("pull", ({ payload }) => {
//       return Effect.succeed({
//         cookie: payload.cookie,
//         lastMutationIDChanges: {},
//         patch: [],
//       })
//     }),
//     HttpApiBuilder.handle("push", ({ payload }) => {
//       return Effect.succeed({
//         success: true,
//       })
//     }),
//   ),
// )

// const MyApiLive = HttpApiBuilder.api(API).pipe(Layer.provide(SyncAPILive))

// export const app = HttpApiBuilder.httpApp.pipe(Effect.provide(MyApiLive))
