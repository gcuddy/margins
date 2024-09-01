import * as MysqlKysely from "@effect/sql-kysely/Mysql"
import * as K from "@effect/sql-kysely/Kysely"
import * as MySql from "@effect/sql-mysql2"
import { PlanetScaleDialect } from "kysely-planetscale"

const a = K.make<KyselyDB>({
  dialect: new PlanetScaleDialect({
    url: "",
  }),
})

import { Context, Effect, Layer } from "effect"
import type { KyselyDB } from "@margins/db"

class DB extends Context.Tag("@margins/db")<
  DB,
  //   MysqlKysely.EffectKysely<KyselyDB>
  K.EffectKysely<KyselyDB>
>() {}

const SqlLive = MySql.MysqlClient.layer({})

const KyselyLive = Layer.effect(DB, MysqlKysely.make<KyselyDB>())
const KyselyLive2 = Layer.effect(
  DB,
  Effect.gen(function* () {
    return K.make<KyselyDB>({
      dialect: new PlanetScaleDialect({
        url: "",
      }),
    })
  }),
)

const LibsqlClientLive = Layer.scoped(
  LibsqlClient,
  Effect.gen(function* () {
    const client = createDb({})
    yield* Effect.addFinalizer(() =>
      Effect.andThen(
        Effect.sync(() => client.close()),
        Effect.log(`closing libsql connection`),
      ),
    )
    return client
  }),
)
