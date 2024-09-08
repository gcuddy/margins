import { Context, Effect, Layer, Runtime } from "effect"
import { LuciaAdapterLayer } from "./adapters/lucia-do"
import { Lucia } from "lucia"
import { UserId } from "./Domain/User"
import { Schema } from "@effect/schema"

const make = Effect.gen(function* () {
  const adapter = yield* LuciaAdapterLayer
  const runtime = yield* Effect.runtime()
  const runPromise = Runtime.runPromise(runtime)

  const lucia = new Lucia(
    {
      deleteExpiredSessions: () => runPromise(adapter.deleteExpiredSessions()),
      deleteSession(sessionId) {
        return runPromise(adapter.deleteSession(sessionId))
      },
      deleteUserSessions(userId) {
        return runPromise(adapter.deleteUserSessions(UserId.make(userId)))
      },
      async getSessionAndUser(sessionId) {
        const [session, user] = await runPromise(
          adapter.getSessionAndUser(sessionId).pipe(
            Effect.catchTags({
              // TODO: catch tags
            }),
          ),
        )
        return [session, user]
      },
      async getUserSessions(userId) {
        const sessions = await runPromise(
          adapter.getUserSessions(UserId.make(userId)),
        )
        return [...sessions]
      },
      setSession(session) {
        return runPromise(adapter.setSession(session as any))
      },
      updateSessionExpiration(sessionId, expiresAt) {
        return runPromise(adapter.updateSessionExpiration(sessionId, expiresAt))
      },
    },
    {
      // TODO: options
    },
  )

  return lucia
})

export class LuciaLayer extends Context.Tag("Auth/Lucia")<
  LuciaLayer,
  Effect.Effect.Success<typeof make>
>() {
  static readonly Live = Layer.effect(this, make).pipe(
    Layer.provide(LuciaAdapterLayer.Live),
  )
}

export class AuthorizationError extends Schema.TaggedError<AuthorizationError>()(
  "AuthorizationError",
  {},
) {}
