import {
  HttpMiddleware,
  HttpRouter,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform"
import { Context, DateTime, Effect, Layer, Option } from "effect"
import { Replicache } from "../Replicache.js"
import { Schema } from "@effect/schema"
import { PullRequest, PullResponse, PushRequest } from "../Domain/Replicache.js"
import { CurrentUser, User, UserId } from "../Domain/User.js"
import { AuthorizationError, LuciaLayer } from "../Auth.js"
import { Email } from "../Domain/Email.js"
// import { Replicache } from "../services/Replicache"
// Middleware constructor that logs the name of the middleware

const authMiddleWare = (name: string) =>
  HttpMiddleware.make(app =>
    Effect.gen(function* () {
      const { authorization } = yield* HttpServerRequest.schemaHeaders(
        Schema.Struct({
          authorization: Schema.String,
        }),
      ).pipe(
        Effect.tapErrorCause(e => Effect.logError("Parse Error", e)),
        Effect.catchTag(
          "ParseError",
          () => new AuthorizationError("Incorrect Authorization Header"),
        ),
      )

      const lucia = yield* LuciaLayer
      // const authorizationHeader =  req.headers
      const sessionId = Option.fromNullable(
        lucia.readBearerToken(authorization),
      )
      if (Option.isNone(sessionId)) {
        // 401 and authorization error
        // or session not found?
        return yield* new AuthorizationError("No Session Found")
      }
      return yield* app // Continue with the original application flow
    }).pipe(
      Effect.tapErrorCause(e => Effect.logError("auth middleware error", e)),
      Effect.catchTag("AuthorizationError", e =>
        HttpServerResponse.text("Unauthorized", { status: 401 }),
      ),
    ),
  )

const AuthorizationSchema = Schema.String
export type AuthorizationToken = typeof AuthorizationSchema.Type
export const AuthorizationToken =
  Context.GenericTag<AuthorizationToken>("AuthorizationToken")

const AuthorizationHeader = Schema.Struct({
  authorization: AuthorizationSchema,
}).pipe(Schema.pick("authorization"))

// export const sss = HttpMiddleware.make(app =>
//   Effect.provideServiceEffect(
//     app,
//     AuthorizationToken,
//     HttpServerRequest.schemaHeaders(AuthorizationHeader).pipe(
//       Effect.catchTag("ParseError", () =>
//         HttpServerResponse.unsafeJson(
//           {
//             message: "Unauthorized",
//           },
//           { status: 401 },
//         ),
//       ),
//     ),
//   ),
// )
export const aaa = HttpMiddleware.make(app =>
  Effect.provideServiceEffect(
    app,
    CurrentUser,
    Effect.gen(function* () {
      console.log("CurrentUser")
      // TODO: lucia here and do.
      // If 401 on Replicache side, go to login
      if (Math.random() > 0) {
        console.log("throwing")
        return yield* new AuthorizationError("No Session Found")
      }
      return User.make({
        id: UserId.make("1"),
        email: Email.make("test@test.com"),
        createdAt: DateTime.unsafeNow(),
        updatedAt: DateTime.unsafeNow(),
      })
    }),
  ).pipe(
    Effect.tapErrorCause(e => Effect.logError("CurrentUser error", e)),
    // Effect.catchTag("AuthorizationError", () =>
    //   HttpServerResponse.text("Unauthorized").pipe(
    //     HttpServerResponse.setStatus(401),
    //   ),
    // ),
    // Effect.orDie,
  ),
)
// const authy = HttpMiddleware.make(app =>
//   HttpRouter.provideServiceEffect(
//     app,
//     CurrentUser,
//     Effect.gen(function* () {
//       const { authorization } = yield* HttpServerRequest.schemaHeaders(
//         Schema.Struct({
//           authorization: Schema.String,
//         }),
//       ).pipe(
//         Effect.tapErrorCause(e => Effect.logError("Parse Error", e)),
//         Effect.catchTag(
//           "ParseError",
//           () => new AuthorizationError("Incorrect Authorization Header"),
//         ),
//       )
//       const lucia = yield* LuciaLayer
//       console.log("lucia", lucia)
//       // const authorizationHeader =  req.headers
//       const sessionId = Option.fromNullable(
//         lucia.readBearerToken(authorization),
//       )
//       console.log("sessionId", sessionId)
//       if (Option.isNone(sessionId)) {
//         // 401 and authorization error
//         // or session not found?
//         return yield* new AuthorizationError("No Session Found")
//       }
//       // TODO: should make validateSession return effects/options automatically
//       const { user, session } = yield* Effect.tryPromise(() =>
//         lucia.validateSession(sessionId.value),
//       )
//       if (user === null || session === null) {
//         return yield* new AuthorizationError("No Session Found")
//       }
//       return User.make({
//         createdAt: DateTime.unsafeMake(user.createdAt),
//         updatedAt: DateTime.unsafeMake(user.updatedAt),
//         email: Email.make(user.email),
//         id: UserId.make(user.id),
//       })
//     }).pipe(Effect.tapErrorCause(Effect.logError)),
//   ),
// )

// Maybe should use HttpApi instead?
export const sync = HttpRouter.empty.pipe(
  HttpRouter.post(
    "/push",
    Effect.gen(function* () {
      const pushRequest = yield* HttpServerRequest.schemaBodyJson(PushRequest)
      const replicache = yield* Replicache

      yield* replicache.push(pushRequest)

      return yield* HttpServerResponse.json({})
    }).pipe(
      Effect.tapErrorCause(Effect.logError),
      Effect.provide(Replicache.Live),
      // Effect.catchAllCause(_ => Effect.succeed(HttpServerResponse.text("Error")))
    ),
  ),
  HttpRouter.post(
    "/pull",
    Effect.gen(function* () {
      const pullRequest = yield* HttpServerRequest.schemaBodyJson(PullRequest)
      const replicache = yield* Replicache
      console.log("pullRequest", pullRequest)
      console.log("replicache", replicache)

      const pr = yield* replicache.pull(pullRequest)
      return yield* HttpServerResponse.schemaJson(PullResponse)(pr)
    }).pipe(
      Effect.tapErrorCause(Effect.logError),
      // Effect.catchTags({
      //   ParseError: e => {
      //     console.log("ParseError", e)
      //     return HttpServerResponse.empty().pipe(
      //       HttpServerResponse.setStatus(400),
      //     )
      //   },
      //   RequestError: e => {
      //     return HttpServerResponse.empty().pipe(
      //       HttpServerResponse.setStatus(400),
      //     )
      //   },
      //   Unauthorized: e => {
      //     return HttpServerResponse.text("Unauthorized").pipe(
      //       HttpServerResponse.setStatus(401),
      //     )
      //   },
      // }),
      Effect.provide(Replicache.Live),
      // Effect.catchAllCause(_ =>
      //   HttpServerResponse.empty().pipe(HttpServerResponse.setStatus(500)),
      // ),
    ),
  ),
  // HttpRouter.use(authMiddleWare("auth")),
  HttpRouter.use(aaa),
  // HttpRouter.use(
  //   Effect.provideServiceEffect(
  //     CurrentUser,
  //     Effect.succeed(
  //       User.make({
  //         createdAt: DateTime.unsafeNow(),
  //         updatedAt: DateTime.unsafeNow(),
  //         email: Email.make("test@test.com"),
  //         id: UserId.make("1"),
  //       }),
  //     ),
  //   ),
  // ),
  // Effect.provide(Replicache.Live),
)
// .pipe(Effect.provide(Replicache.Live))
// .pipe(Layer.provide(Replicache.Live))

// SyncApiLive.pipe(
//   HttpApiBuilder.httpApp
// )
