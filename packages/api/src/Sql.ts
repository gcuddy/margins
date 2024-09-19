import { Config, ConfigProvider, Logger } from "effect"
import { MysqlClient } from "@effect/sql-mysql2"
// import * as PlanetscaleClient from "./adapters/planetscale.js"

// // TODO: fancy nested config thing
// export const SqlLive = PlanetscaleClient.layer(
//   Config.all({
//     host: Config.string("DATABASE_HOST"),
//     username: Config.string("DATABASE_USERNAME"),
//     password: Config.redacted("DATABASE_PASSWORD"),
//   }),
//   // .pipe(Config.nested("database")),
// )

export const SqlLive = MysqlClient.layer({
  url: Config.redacted("DATABASE_URL"),
})