import { HttpApi, OpenApi } from "@effect/platform"
import { UsersApi } from "./Users/Api.js"
import { ReplicacheApi } from "./Replicache/Api.js"

export class Api extends HttpApi.empty.pipe(
  HttpApi.addGroup(UsersApi),
  HttpApi.addGroup(ReplicacheApi),
  OpenApi.annotate({ title: "Margins API" }),
) {}
