import * as SqlKysely from "@effect/sql-kysely/Kysely"
import { PlanetScaleDialect } from "kysely-planetscale"

import {
  Config,
  Context,
  Effect,
  Layer,
  Redacted,
} from "effect"
import type { KyselyDB as Database } from "@margins/db"
import { Schema } from "@effect/schema"

const make = Effect.gen(function* () {
  const host = yield* Config.redacted("host")
  const username = yield* Config.redacted("username")
  const password = yield* Config.redacted("password")
  return SqlKysely.make<Database>({
    dialect: new PlanetScaleDialect({
      // Hacky way to get around cloudflare not supporting cache rn,
      // see https://github.com/cloudflare/workerd/issues/698
      fetch: (url, init) => {
        if (init) delete init["cache"]
        return fetch(url, init)
      },
      host: Redacted.value(host),
      username: Redacted.value(username),
      password: Redacted.value(password),
    }),
  })
})
// .pipe(
//   Effect.withConfigProvider(
//     // TODO: probably don't want to use fromEnv - instead
//     ConfigProvider.fromEnv().pipe(
//       ConfigProvider.nested("database"),
//       ConfigProvider.constantCase,
//     ),
//   ),
// )

export class DB extends Context.Tag("@margins/KyselyDB")<
  DB,
  Effect.Effect.Success<typeof make>
>() {
  static readonly Live = Layer.effect(this, make)
}

export class DBError extends Schema.TaggedError<DBError>()("DBError", {}) {}
