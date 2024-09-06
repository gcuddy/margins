import { Schema } from "@effect/schema"
import type {
  Adapter,
  DatabaseSession,
  RegisteredDatabaseSessionAttributes,
  DatabaseUser,
  RegisteredDatabaseUserAttributes,
  UserId,
} from "lucia"

class Session extends Schema.Class<Session>("adapters/Lucia/Session")({
  id: Schema.String,
  userID: Schema.String,
  expiresAt: Schema.Number,
}) {}

export class DurableObjectAdapter implements Adapter {
  private readonly schema = Schema.decodeUnknownSync(Session)

  constructor(private readonly ctx: DurableObjectState) {}

  //   TODO: should we get the server here with getServerByName?

  public async deleteSession(sessionId: string): Promise<void> {
    await this.ctx.storage.delete(`session:${sessionId}`)
  }

  public async deleteUserSessions(userId: UserId): Promise<void> {
    await this.ctx.storage.delete(`user:${userId}`)
  }

  private async getSession(sessionId: string): Promise<DatabaseSession | null> {
    // TODO: effect schema
    const result = await this.ctx.storage.get(`session:${sessionId}`)
    const a = this.schema(result)
    if (!result) return null
    return result as DatabaseSession
  }

  //   getSessionAndUser(
  //     sessionId: string,
  //   ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
  //     this.ctx.storage.get(sessionId)
  //   }
}
