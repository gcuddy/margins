import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApp,
} from "@effect/platform"
import { Schema } from "@effect/schema"
import {
  AuthorizationError,
  PushRequest,
  Replicache,
} from "../services/Replicache"
import { DateTime, Effect, Layer, pipe } from "effect"
import { DBError } from "../services/db"
import { DatabaseTransactional } from "../services/db-transaction"
import { router } from "./router"

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
          success: Schema.Boolean,
        }),
      ),
    ),
  ),
  // HttpApiGroup.add(
  //   HttpApiEndpoint.post("pull", "/pull").pipe(
  //     HttpApiEndpoint.setPayload(PullRequest),
  //     HttpApiEndpoint.setSuccess(PullResponse),
  //   ),
  // ),
  HttpApiGroup.add(
    HttpApiEndpoint.get("findById", "/users/:id").pipe(
      HttpApiEndpoint.setSuccess(User),
      HttpApiEndpoint.setPath(
        Schema.Struct({
          id: Schema.NumberFromString,
        }),
      ),
    ),
  ),
  HttpApiGroup.addError(AuthorizationError, {
    status: 401,
  }),
  HttpApiGroup.addError(DBError, {
    status: 500,
  }),
) {}

class Api extends HttpApi.empty.pipe(HttpApi.addGroup(SyncAPI)) {}

export const SyncApiLive = HttpApiBuilder.group(Api, "sync", handlers =>
  Effect.gen(function* () {
    const x = yield* Replicache
    return handlers.pipe(
      // the parameters & payload are passed to the handler function.
      HttpApiBuilder.handle("findById", ({ path: { id } }) =>
        Effect.succeed(
          new User({
            id,
            name: "John Doe",
            createdAt: DateTime.unsafeNow(),
          }),
        ),
      ),
      HttpApiBuilder.handle(
        "push",
        ({ payload }) =>
          x.push(payload).pipe(
            Effect.map(() => ({ success: true })),
            Effect.catchTags({
              FutureMutationError: () =>
                Effect.succeed({
                  success: false,
                  error: "FutureMutationError",
                }),
            }),
          ),
        // Effect.succeed({
        //   success: true,
        // }),
      ),
    )
  }),
).pipe(
  Layer.provide(Replicache.Live),
  Layer.provide(DatabaseTransactional.Live),
)

const MyApiLive = HttpApiBuilder.api(Api).pipe(Layer.provide(SyncApiLive))

const app = HttpApiBuilder.httpApp.pipe(Effect.provide(MyApiLive))

const a = app.pipe(
  Effect.andThen(e => HttpApp.toWebHandler(e)),
  Effect.provideService(HttpApiBuilder.Router, router),
)

Effect.runPromise(a)

pipe(app, HttpApp.toWebHandler)

// const b = app.pipe(
//   Effect.flatMap(e => HttpApp.toWebHandler(e))
// )

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
