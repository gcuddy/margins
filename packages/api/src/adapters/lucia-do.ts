import { Schema } from "@effect/schema"
import type {
  Adapter,
  DatabaseSession,
  RegisteredDatabaseSessionAttributes,
  DatabaseUser,
  RegisteredDatabaseUserAttributes,
} from "lucia"
import { PlanetScaleAdapter } from "@lucia-auth/adapter-mysql"
import type { Connection, Client } from "@planetscale/database"
import { Effect, Option, pipe } from "effect"
import { SqlLive } from "../Sql"
import { SqlClient, SqlSchema } from "@effect/sql"
import { User, UserId, UserNotFound } from "../Domain/User"
import { KeyValueStore } from "@effect/platform"
import { UserRepo } from "../Users/Repo"

class Session extends Schema.Class<Session>("adapters/Lucia/Session")({
  id: Schema.String,
  userID: UserId,
  expiresAt: Schema.Number,
}) {}

export class SessionNotFound extends Schema.TaggedError<SessionNotFound>()(
  "SessionNotFound",
  {
    id: Schema.String,
  },
) {}

// Each durable object is a user? I think a user. We can also spin up per session, or per workspace, or per list.
// Each durable object represents a user's sessions.

// TODO: extend MySqlAdapter, overwrite
// TODO: allow other Adapters beside PlanetScaleAdapter
export class DurableObjectAdapter extends PlanetScaleAdapter {
  private readonly schema = Schema.decodeUnknownOption(Session)
  private client: Connection | Client

  constructor(
    private readonly ctx: DurableObjectState,
    connection: ConstructorParameters<typeof PlanetScaleAdapter>[0],
    tableNames: ConstructorParameters<typeof PlanetScaleAdapter>[1],
  ) {
    super(connection, tableNames)
    this.client = connection
  }

  //   TODO: should we get the server here with getServerByName?

  public async deleteSession(sessionId: string): Promise<void> {
    await this.ctx.storage.delete(sessionId)
  }

  public async deleteUserSessions(userId: UserId): Promise<void> {
    await this.ctx.storage.deleteAll()
  }

  public async getSessionAndUser(
    sessionId: string,
  ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
    const session = this.getSession_(sessionId)
  }

  public async updateSessionExpiration(
    sessionId: string,
    expiresAt: Date,
  ): Promise<void> {
    // TODO: alarm?
    // Transaction?
    const session = await this.getSession_(sessionId)
    if (!session) return
    await this.ctx.storage.put<Session>(sessionId, {
      ...session,
      expiresAt: expiresAt.getTime(),
    })
  }

  protected async getSession_(sessionId: string): Promise<Session | null> {
    const result = await this.ctx.storage.get(`session:${sessionId}`)
    return Option.match(this.schema(result), {
      onNone: () => null,
      onSome: session => session,
    })
  }

  protected async getUserFromSessionId_(
    sessionId: string,
  ): Promise<DatabaseUser | null> {
    const program = Effect.gen(function* () {
      const store = (yield* KeyValueStore.KeyValueStore).forSchema(Session)
      const sql = yield* SqlClient.SqlClient
      const schema = SqlSchema.findOne({
        Request: Schema.String,
        Result: User,
        execute: request => sql`SELECT * FROM ${User} WHERE id = ${request}`,
      })
    })
    const result = await this.controller.get(
      `SELECT ${this.escapedUserTableName}.* FROM ${this.escapedSessionTableName} INNER JOIN ${this.escapedUserTableName} ON ${this.escapedUserTableName}.id = ${this.escapedSessionTableName}.user_id WHERE ${this.escapedSessionTableName}.id = ?`,
      [sessionId],
    )
    if (!result) return null
    return transformIntoDatabaseUser(result)
  }
}

const make = Effect.gen(function* () {
  const store = (yield* KeyValueStore.KeyValueStore).forSchema(Session)
  const userRepo = yield* UserRepo
  const sql = yield* SqlClient.SqlClient

  const getUserFromSessionId = (sessionId: string) =>
    Effect.gen(function* () {
      const session = yield* store.get(sessionId)
      // TODO: more idiomatic approach
      if (Option.isNone(session)) {
        return yield* new SessionNotFound({ id: sessionId })
      }
      const user = yield* userRepo.findById(session.value.userID)
      if (Option.isNone(user)) {
        return yield* new UserNotFound({ id: session.value.userID })
      }
      return user.value
    })
  // Effect.zipWith(
  //   store.get(sessionId),
  //   userRepo.findById(session.userID),
  //   (session, user) => {
  //     return {
  //       session,
  //       user,
  //     }
  //   },
  // )
  // store.get(sessionId).pipe(
  //   Effect.flatMap(
  //     Option.match({
  //       onNone: () => Effect.fail(new SessionNotFound({ id: sessionId })),
  //       onSome: session => userRepo.findById(session.userID),
  //     }),
  //   ),
  //   Effect.zipLeft(userRepo.findById(session.userID)),
  //   Effect.flatMap(user => {
  //     return Option.match(user, {
  //       onNone: () => Effect.fail(new UserNotFound({ id: session.userID })),
  //       onSome: Effect.succeed,
  //     })
  //   }),
  // )
  // pipe(
  //   store.get(sessionId),
  //   Effect.flatMap(
  //     Option.match({
  //       onNone: () => Effect.fail(new SessionNotFound({ id: sessionId })),
  //       onSome: session =>
  //         pipe(
  //           userRepo.findById(session.userID),
  //           Effect.flatMap(
  //             Option.match({
  //               onNone: () => Effect.fail(new UserNotFound({ id: session.userID })),
  //               onSome: Effect.succeed,
  //             }),
  //           ),
  //         ),
  //     }),
  //   ),
  // )
  // pipe(
  //   store.get(sessionId),
  //   Effect.flatMap(
  //     Option.match({
  //       onNone: () => Effect.fail(new Error("Session not found")),
  //       onSome: session => userRepo.findById(session.userID),
  //     }),
  //   ),
  //   Effect.flatMap(
  //     Option.match({
  //       onNone: () => new UserNotFound({ id:  }),
  //       onSome: Effect.succeed,
  //     }),
  //   ),
  // )

  // Effect.gen(function* () {
  //   const session = yield* store.get(sessionId)
  //   return Option.match(session, {
  //     onNone: () => null,
  //     onSome: session => userRepo.findById(session.userID),
  //   })
  // })
})

//   getSessionAndUser(
//     sessionId: string,
//   ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
//     this.ctx.storage.get(sessionId)
//   }
