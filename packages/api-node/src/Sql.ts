import { Config } from "effect"
import { MysqlClient } from "@effect/sql-mysql2"

export const SqlLive = MysqlClient.layerConfig({
  url: Config.redacted("DATABASE_URL"),
})
