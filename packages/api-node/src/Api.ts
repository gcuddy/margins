import { HttpApi, OpenApi } from "@effect/platform"
import { UsersApi } from "./Users/Api.js"
import { ReplicacheApi } from "./Replicache/Api.js"
import { EntriesApi } from "./Entries/Api.js"


export class Api extends HttpApi.empty
  .add(UsersApi)
  .add(EntriesApi)
  .add(ReplicacheApi)
  .annotate(OpenApi.Title, "Margins API") { }
