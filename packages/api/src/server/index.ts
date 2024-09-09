import {
  getServerByName,
  routePartykitRequest,
  Server,
  type Connection,
} from "partyserver"
import { makeServerRuntime } from "./main"
import { router } from "./router"
import { HttpApp } from "@effect/platform"
import { ConfigProvider, Effect, pipe, Record } from "effect"
import { CurrentUser } from "../Domain/User"

type Env = {
  MarginsServer: DurableObjectNamespace<MarginsServer>
  DATABASE_HOST: string
  DATABASE_PASSWORD: string
  DATABASE_USERNAME: string
  GOOGLE_BOOKS_API_KEY: string
}

const makeConfig = (env: Env) => {
  return pipe(
    env,
    ({ MarginsServer, ...rest }) => rest,
    Record.toEntries,
    env => new Map(env),
    ConfigProvider.fromMap,
  )
}

// Define your Server - should I have sep servers for Sync etc? Or one for everything?
export class MarginsServer extends Server<Env> {
  private ServerRuntime: ReturnType<typeof makeServerRuntime>

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    this.ServerRuntime = pipe(makeConfig(env), config =>
      makeServerRuntime(config, ctx),
    )
  }

  onConnect(connection: Connection) {
    console.log("Connected", connection.id, "to server", this.name)
    const a = this.getConnections()
  }

  onMessage(connection: Connection, message: string) {
    console.log("Message from", connection.id, ":", message)
    const x = getServerByName(this.env.MarginsServer, "MarginsServer").then(
      server => server.broadcast(message, [connection.id]),
    )
    // Send the message to every other connection
    this.broadcast(message, [connection.id])
  }

  async onBeforeRequest() {}

  async onRequest(request: Request): Promise<Response> {
    const runtime = await this.ServerRuntime.runtime()
    // const luciaAdapter = new DurableObjectAdapter(this.ctx)
    // TODO: Lucia and get current user and authenticate
    return pipe(
      router,
      // TODO: get current user from session
      Effect.provide(CurrentUser.Test),
      Effect.tapErrorCause(Effect.logError),
      Effect.withLogSpan("MarginsServer.onRequest"),
      HttpApp.toWebHandlerRuntime(runtime),
    )(request)

    router
    // return pipe(
    //   router,
    //   // HttpApp.toWebHandler,
    //   Effect.tapErrorCause(Effect.logError),
    //   HttpApp.toWebHandlerRuntime(this.runtime!),
    // )(request)
  }
}

export default {
  async fetch(request: Request, env: Env) {
    // TODO: auth layer here
    // TODO: poke backend (layer), figuring out how to get
    // Todo: server should be either user, workspace, session, or shared list. need to figure out how...
    // partysocket should pass room, which should go to here - session.id, user.id, or whatever it needs to be...
    // is it possible to do multiple though? so session.id server talks to list.id server...
    return (await getServerByName(env.MarginsServer, "MarginsServer")).fetch(
      request,
    )
    return (
      (await routePartykitRequest(request, env)) ||
      new Response("Not Found", { status: 404 })
    )
  },
} satisfies ExportedHandler<Env>
