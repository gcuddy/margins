import { HttpApi, OpenApi } from "@effect/platform"
import { UsersApi } from "./Users/Api.js"
import { ReplicacheApi } from "./Replicache/Api.js"
import { EntriesApi } from "./Entries/Api.js"

export class Api extends HttpApi.empty.pipe(
  HttpApi.addGroup(UsersApi),
  HttpApi.addGroup(ReplicacheApi),
  HttpApi.addGroup(EntriesApi),
  OpenApi.annotate({ title: "Margins API" }),
) {}
