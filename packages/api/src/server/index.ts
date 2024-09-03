import {
  getServerByName,
  routePartykitRequest,
  Server,
  type Connection,
} from "partyserver"
import { makeServerRuntime } from "./main"
import { router } from "./router"
import { HttpApp } from "@effect/platform"
import { ConfigProvider, pipe, Record } from "effect"

type Env = {
  DATABASE_HOST: string
  DATABASE_PASSWORD: string
  DATABASE_USERNAME: string
  MarginsServer: DurableObjectNamespace<MarginsServer>
  GOOGLE_BOOKS_API_KEY: string
}

// Define your Server - should I have sep servers for Sync etc? Or one for everything?
export class MarginsServer extends Server<Env> {
  onConnect(connection: Connection) {
    console.log("Connected", connection.id, "to server", this.name)
  }

  onMessage(connection: Connection, message: string) {
    console.log("Message from", connection.id, ":", message)
    // Send the message to every other connection
    this.broadcast(message, [connection.id])
  }

  onStart() {
    console.log("onStart", this.env)
  }

  async onRequest(request: Request): Promise<Response> {
    console.log("onRequest", request)
    const ConfigLive = pipe(
      this.env,
      ({ MarginsServer, ...rest }) => rest,
      Record.toEntries,
      env => new Map(env),
      ConfigProvider.fromMap,
    )
    const t0 = Date.now()
    // console.log("makeServerRuntime", t0)
    // TODO: maybe we should do this onStart and store it in class stateful instead of creating it every time?
    const runtime = await makeServerRuntime(ConfigLive).runtime()
    console.log("makeServerRuntime", Date.now() - t0)
    console.log("got to after runtime")
    // TODO: refactor this to be elsewhere?
    console.log({ ConfigLive })
    // return new Response("Hello, world!")
    return pipe(router, HttpApp.toWebHandlerRuntime(runtime))(request)
    // return handler(request)
  }
}

export default {
  async fetch(request: Request, env: Env) {
    console.log("fetch", request)
    return (await getServerByName(env.MarginsServer, "MarginsServer")).fetch(
      request,
    )
    return (
      (await routePartykitRequest(request, env)) ||
      new Response("Not Found", { status: 404 })
    )
  },
} satisfies ExportedHandler<Env>
