import { HttpApi, OpenApi } from "@effect/platform"
import { UsersApi } from "./Users/Api.js"

export class Api extends HttpApi.empty.pipe(
  HttpApi.addGroup(UsersApi),
  OpenApi.annotate({ title: "Margins API" }),
) {}
