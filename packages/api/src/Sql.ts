import { Config, ConfigProvider } from "effect"
import * as PlanetscaleClient from "./adapters/planetscale"

// TODO: fancy nested config thing
export const SqlLive = PlanetscaleClient.layer(
  Config.all({
    host: Config.string("DATABASE_HOST"),
    username: Config.string("DATABASE_USERNAME"),
    password: Config.redacted("DATABASE_PASSWORD"),
  }),
  // .pipe(Config.nested("database")),
)
