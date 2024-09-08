import { Schema } from "@effect/schema"
import {
  type Adapter,
  type DatabaseSession,
  type RegisteredDatabaseSessionAttributes,
  type DatabaseUser,
  type RegisteredDatabaseUserAttributes,
  Lucia,
} from "lucia"
import { PlanetScaleAdapter } from "@lucia-auth/adapter-mysql"
import type { Connection, Client } from "@planetscale/database"
import { Array, Context, Effect, Layer, Option, pipe } from "effect"
import { SqlLive } from "../Sql"
import { SqlClient, SqlSchema } from "@effect/sql"
import { User, UserId, UserNotFound } from "../Domain/User"
import { KeyValueStore } from "@effect/platform"
import { UserRepo } from "../Users/Repo"
import { DurableObjectStateLayer } from "../DurableObject"

// Lucia compatible session, need to work on encoding/decoding
// Probably a way to use Schema Transformations to do this
class Session extends Schema.Class<Session>("adapters/Lucia/Session")({
  id: Schema.String,
  userId: UserId,
  expiresAt: Schema.Number,
  //
  // fresh: Schema.Boolean,
}) {}
// to lucia session

class LuciaSession extends Schema.Class<LuciaSession>(
  "adapters/Lucia/LuciaSession",
)({
  id: Schema.String,
  userId: UserId,
  expiresAt: Schema.Date,
  attributes: Schema.Record({
    key: Schema.String,
    value: Schema.Unknown,
  }),
  // fresh: Schema.Boolean,
}) {}

const LuciaUser = Schema.Struct({
  id: Schema.String,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
  attributes: Schema.Record({
    key: Schema.String,
    value: Schema.Unknown,
  }),
})

const transformUser = Schema.transform(LuciaUser, User, {
  strict: true,
  decode: user => {
    return {
      createdAt: user.createdAt.toString(),
      updatedAt: user.updatedAt.toString(),
      id: user.id,
    }
  },
  encode: user => {
    const { id, createdAt, updatedAt, ...attributes } = user
    return {
      id,
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt),
      attributes,
    }
  },
})

const encodeLuciaUser = Schema.encode(transformUser, {
  onExcessProperty: "ignore",
})

const transformSession = Schema.transform(Session, LuciaSession, {
  strict: true,
  decode: session => {
    return {
      id: session.id,
      expiresAt: new Date(session.expiresAt).toISOString(),
      userId: session.userId,
      attributes: {},
    }
  },
  encode: luciaSession => {
    return {
      id: luciaSession.id,
      expiresAt: new Date(luciaSession.expiresAt).getTime(),
      userId: UserId.make(luciaSession.userId),
    }
  },
})

const encodeLuciaSession = Schema.decode(transformSession)
const encodeLuciaSessionUnknown = Schema.decodeUnknown(transformSession)

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
// export class DurableObjectAdapter extends PlanetScaleAdapter {
//   private readonly schema = Schema.decodeUnknownOption(Session)
//   private client: Connection | Client

//   constructor(
//     private readonly ctx: DurableObjectState,
//     connection: ConstructorParameters<typeof PlanetScaleAdapter>[0],
//     tableNames: ConstructorParameters<typeof PlanetScaleAdapter>[1],
//   ) {
//     super(connection, tableNames)
//     this.client = connection
//   }

//   //   TODO: should we get the server here with getServerByName?

//   public async deleteSession(sessionId: string): Promise<void> {
//     await this.ctx.storage.delete(sessionId)
//   }

//   public async deleteUserSessions(userId: UserId): Promise<void> {
//     await this.ctx.storage.deleteAll()
//     this.ctx.storage.deleteAlarm({})
//   }

//   public async getSessionAndUser(
//     sessionId: string,
//   ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
//     const session = this.getSession_(sessionId)
//   }

//   public async updateSessionExpiration(
//     sessionId: string,
//     expiresAt: Date,
//   ): Promise<void> {
//     // TODO: alarm?
//     // Transaction?
//     const session = await this.getSession_(sessionId)
//     if (!session) return
//     await this.ctx.storage.put<Session>(sessionId, {
//       ...session,
//       expiresAt: expiresAt.getTime(),
//     })
//   }

//   protected async getSession_(sessionId: string): Promise<Session | null> {
//     const result = await this.ctx.storage.get(`session:${sessionId}`)
//     return Option.match(this.schema(result), {
//       onNone: () => null,
//       onSome: session => session,
//     })
//   }

//   protected async getUserFromSessionId_(
//     sessionId: string,
//   ): Promise<DatabaseUser | null> {
//     const program = Effect.gen(function* () {
//       const store = (yield* KeyValueStore.KeyValueStore).forSchema(Session)
//       const sql = yield* SqlClient.SqlClient

//       const schema = SqlSchema.findOne({
//         Request: Schema.String,
//         Result: User,
//         execute: request => sql`SELECT * FROM ${User} WHERE id = ${request}`,
//       })
//     })
//     const result = await this.controller.get(
//       `SELECT ${this.escapedUserTableName}.* FROM ${this.escapedSessionTableName} INNER JOIN ${this.escapedUserTableName} ON ${this.escapedUserTableName}.id = ${this.escapedSessionTableName}.user_id WHERE ${this.escapedSessionTableName}.id = ?`,
//       [sessionId],
//     )
//     if (!result) return null
//     return transformIntoDatabaseUser(result)
//   }
// }

const make = Effect.gen(function* () {
  // User Sessions Store
  // or just use the DurableObjectStateLayer... but we currently only need that for list
  const store = (yield* KeyValueStore.KeyValueStore).forSchema(Session)
  const state = yield* DurableObjectStateLayer
  const userRepo = yield* UserRepo

  // TODO: this should be nullable?
  const getSessionAndUser = (sessionId: string) =>
    Effect.gen(function* () {
      const session = yield* store.get(sessionId)
      // TODO: more idiomatic approach
      if (Option.isNone(session)) {
        return yield* new SessionNotFound({ id: sessionId })
      }
      const user = yield* userRepo.findById(session.value.userId)
      if (Option.isNone(user)) {
        return yield* new UserNotFound({ id: session.value.userId })
      }
      const luciaSession = yield* encodeLuciaSession(session.value)
      const luciaUser = yield* encodeLuciaUser(user.value)
      return [luciaSession, luciaUser] as const
    })

  const deleteSession = (sessionId: string) => store.remove(sessionId)

  const deleteUserSessions = (userId: UserId) => store.clear

  // TODO: eventually could figure out a way to do this with alarms. We'd
  // need to have a durable object per session then. Maybe workable!
  const updateSessionExpiration = (sessionId: string, expiresAt: Date) =>
    Effect.gen(function* () {
      const session = yield* store.get(sessionId)
      if (Option.isNone(session)) {
        return yield* new SessionNotFound({ id: sessionId })
      }

      yield* store.set(sessionId, {
        ...session.value,
        expiresAt: expiresAt.getTime(),
      })
    })

  const getUserSessions = (userId: UserId) =>
    pipe(
      Effect.tryPromise(() => state.storage.list()),
      Effect.andThen(sessions => sessions.entries()),
      Effect.flatMap(
        Effect.forEach(([_, session]) =>
          Effect.gen(function* () {
            const decoded = yield* encodeLuciaSessionUnknown(session)
            return decoded
          }),
        ),
      ),
    )

  const setSession = (session: Session) => store.set(session.id, session)

  // Again, should probably use alarms... but then we need to have a durable object per session
  const deleteExpiredSessions = () =>
    pipe(
      Effect.tryPromise(() => state.storage.list()),
      Effect.andThen(sessions => sessions.entries()),
      Effect.flatMap(
        Effect.forEach(([id, session]) =>
          Effect.gen(function* () {
            const sessionParsed = Schema.decodeUnknownSync(Session)(session)
            if (sessionParsed.expiresAt < Date.now()) {
              yield* store.remove(id)
            }
          }),
        ),
      ),
      Effect.flatMap(() => Effect.void),
    )

  return {
    getSessionAndUser,
    deleteSession,
    deleteUserSessions,
    updateSessionExpiration,
    getUserSessions,
    setSession,
    deleteExpiredSessions,
  } as const
})

export class LuciaAdapterLayer extends Effect.Tag("adapters/lucia")<
  LuciaAdapterLayer,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(this, make).pipe(
    Layer.provide(SqlLive),
    Layer.provide(UserRepo.Live),
  )
}

//   getSessionAndUser(
//     sessionId: string,
//   ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
//     this.ctx.storage.get(sessionId)
//   }
// const validateSession = (sessionId: string) =>
//   pipe(
//     getSessionAndUser(sessionId),
//     Effect.tap(session => {
//       if (session.expiresAt < Date.now()) {
//         return Effect.fail(new SessionExpired({ id: sessionId }))
//       }
//       return Effect.succeed(session)
//     }),
//     Effect.catchTag("SessionNotFound", () => Effect.succeed(null)),
// Effect.flatMap(([session, user]) => {
//   if (session.expiresAt < Date.now()) {
//     return Effect.fail(new SessionExpired({ id: sessionId }))
//   }
//   return Effect.succeed(session)
// }),
// )
//   Effect.gen(function* () {
//   const [session, user] = yield* getSessionAndUser(sessionId).pipe(
//     Effect.flatMap(session => {
//       if (session.expiresAt < Date.now()) {
//         return yield* new SessionExpired({ id: sessionId })
//       }
//     }),
//   )

// })

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
