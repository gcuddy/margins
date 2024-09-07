import { Schema } from "@effect/schema"
import type {
  Adapter,
  DatabaseSession,
  RegisteredDatabaseSessionAttributes,
  DatabaseUser,
  RegisteredDatabaseUserAttributes,
  UserId,
} from "lucia"
import { PlanetScaleAdapter } from "@lucia-auth/adapter-mysql"
import type { Connection } from "@planetscale/database"
import { Option } from "effect"

class Session extends Schema.Class<Session>("adapters/Lucia/Session")({
  id: Schema.String,
  userID: Schema.String,
  expiresAt: Schema.Number,
}) {}

// Each durable object is a user? I think a user. We can also spin up per session, or per workspace, or per list.

// TODO: extend MySqlAdapter, overwrite
// TODO: allow other Adapters beside PlanetScaleAdapter
export class DurableObjectAdapter extends PlanetScaleAdapter {
  private readonly schema = Schema.decodeUnknownOption(Session)

  constructor(
    private readonly ctx: DurableObjectState,
    connection: ConstructorParameters<typeof PlanetScaleAdapter>[0],
    tableNames: ConstructorParameters<typeof PlanetScaleAdapter>[1],
  ) {
    super(connection, tableNames)
  }

  //   TODO: should we get the server here with getServerByName?

  public async deleteSession(sessionId: string): Promise<void> {
    await this.ctx.storage.delete(`session:${sessionId}`)
  }

  public async deleteUserSessions(userId: UserId): Promise<void> {
    await this.ctx.storage.delete(`user:${userId}`)
  }

  public async updateSessionExpiration(
    sessionId: string,
    expiresAt: Date,
  ): Promise<void> {
    // TODO: alarm?
    // Transaction?
    const session = await this.getSession_(sessionId)
    if (!session) return
    await this.ctx.storage.put<Session>(`session:${sessionId}`, {
      ...session,
      expiresAt: expiresAt.getTime(),
    })
  }

  public async getSession_(sessionId: string): Promise<Session | null> {
    const result = await this.ctx.storage.get(`session:${sessionId}`)
    return Option.match(this.schema(result), {
      onNone: () => null,
      onSome: session => session,
    })
  }

  //   getSessionAndUser(
  //     sessionId: string,
  //   ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
  //     this.ctx.storage.get(sessionId)
  //   }
}
