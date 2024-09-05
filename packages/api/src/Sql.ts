import { Config } from "effect"
import * as PlanetscaleClient from "./adapters/planetscale"

export const SqlLive = PlanetscaleClient.layer({
  host: Config.string("host"),
  username: Config.string("username"),
  password: Config.redacted("password"),
})
