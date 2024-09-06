import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSecurity,
  HttpApiSwagger,
  HttpApp,
  HttpPlatform,
  HttpRouter,
  HttpServerResponse,
} from "@effect/platform"
import { Schema } from "@effect/schema"
import { Lucia, type Adapter } from "lucia"
import {
  AuthorizationError,
  PushRequest,
  Replicache,
  UserData,
} from "../services/Replicache"
import {
  Context,
  DateTime,
  Effect,
  Layer,
  ManagedRuntime,
  Option,
  pipe,
  Redacted,
} from "effect"
import { DB, DBError } from "../services/db"
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
  Layer.provide(DB.Live),
  Layer.provide(UserData.Live),
)

const ApiLive = HttpApiBuilder.api(Api).pipe(Layer.provide(SyncApiLive))
const EnvLiveSwagger = HttpApiSwagger.layer()

// const HttpPlatformLive = Layer.effect(HttpPlatform.HttpPlatform)

const EnvLive = Layer.mergeAll(ApiLive, HttpApiBuilder.Router.Live)

const runtime = ManagedRuntime.make(EnvLive)

// const handlerPromise = Effect.gen(function*() {
//   const app = yield* HttpApiBuilder.httpApp
//   return HttpApp.toWebHandler(app)
// }).pipe(runtime.runPromise)

const HttpPlatformLive = HttpPlatform.make({
  fileResponse() {
    return HttpServerResponse.empty()
  },
  fileWebResponse(...args) {
    console.log("fileWebResponse", args)
    return HttpServerResponse.empty()
  },
})

// runtime.runSync(handler)

const app = HttpApiBuilder.httpApp.pipe(Effect.provide(ApiLive))

const x = HttpApiBuilder.serve()
// const b = HttpApiSwagger.layer()
// const a = app.pipe(
//   Effect.andThen(e => HttpApp.toWebHandler(e)),
//   Effect.provideService(HttpApiBuilder.Router, router),
// )

// Effect.runPromise(a)

// pipe(app, HttpApp.toWebHandler)

class CurrentUser extends Context.Tag("CurrentUser")<CurrentUser, User>() {}

declare const adapter: Adapter

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
})

class LuciaLayer extends Context.Tag("Lucia")<LuciaLayer, Lucia>() {}

const b = HttpApiSecurity.bearer
const m = HttpApiBuilder.middlewareSecurity(b, CurrentUser, token =>
  // TODO: here we would use Lucia to get user from token (Validate) https://lucia-auth.com/guides/validate-bearer-tokens
  // TODO: want this to be Effect<CurrentUser, AuthorizationError>
  Effect.gen(function* () {
    const lucia = yield* LuciaLayer
    const user = Option.fromNullable(
      lucia.readBearerToken(Redacted.value(token)),
    )
    // or Option.fromNullable
    if (!user) {
      yield* new AuthorizationError("No user found")
    }
    Effect.orDie
    return {
      createdAt: DateTime.unsafeNow(),
      id: 1,
      name: "",
    }
  }),
)

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
