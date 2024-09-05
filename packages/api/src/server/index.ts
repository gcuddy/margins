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
  private runtime?: Awaited<
    ReturnType<ReturnType<typeof makeServerRuntime>["runtime"]>
  >

  onConnect(connection: Connection) {
    console.log("Connected", connection.id, "to server", this.name)
  }

  onMessage(connection: Connection, message: string) {
    console.log("Message from", connection.id, ":", message)
    // Send the message to every other connection
    this.broadcast(message, [connection.id])
  }

  async onStart() {
    await this.makeRuntime()
  }

  async makeRuntime() {
    const Runtime = makeConfig(this.env).pipe(makeServerRuntime)
    this.runtime = await Runtime.runtime()
  }

  async onRequest(request: Request): Promise<Response> {
    // IDK about this pattern!
    if (!this.runtime) {
      await this.makeRuntime()
    }
    return pipe(
      router,
      HttpApp.toWebHandler,
      // Effect.tapErrorCause(Effect.logError),
      // HttpApp.toWebHandlerRuntime(this.runtime!),
    )(request)
  }
}

export default {
  async fetch(request: Request, env: Env) {
    console.log("fetch", request)
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
