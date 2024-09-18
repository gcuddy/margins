import { Config, Context, Effect, Layer, Redacted, Runtime } from "effect"
import { LuciaAdapterLayer } from "./adapters/lucia-do.js"
import { Lucia } from "lucia"
import { User, UserId } from "./Domain/User.js"
import { Schema } from "@effect/schema"
import { PlanetScaleAdapter } from "@lucia-auth/adapter-mysql"
import { Client } from "@planetscale/database"

const make = Effect.gen(function* () {
  const { host, username, password } = yield* Config.all({
    host: Config.string("DATABASE_HOST"),
    username: Config.string("DATABASE_USERNAME"),
    password: Config.redacted("DATABASE_PASSWORD"),
  }).pipe(Config.unwrap)

  // TODO: share this
  const client = new Client({
    host,
    username,
    password: Redacted.value(password),
  })

  const adapter = new PlanetScaleAdapter(client, {
    user: "user",
    session: "user_session",
  })

  const lucia = new Lucia(adapter, {
    // TODO: options
    getUserAttributes: attributes => {
      console.log("attributes", attributes)
      return {
        ...attributes,
      }
    },
  })

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

declare module "lucia" {
  interface Register {
    Lucia: Effect.Effect.Success<typeof make>
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  email: string
  createdAt: string
  updatedAt: string
}
