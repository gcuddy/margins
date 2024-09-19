import { Model, SqlClient, SqlSchema } from "@effect/sql"
import { Context, Effect, Layer, Option, pipe } from "effect"
import { User } from "../Domain/User.js"
import { SqlLive } from "../Sql.js"
import { Session, SessionId } from "../Domain/Session.js"

export const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient
  const repo = yield* Model.makeRepository(User, {
    tableName: "user",
    spanPrefix: "UserRepo",
    idColumn: "id",
  })

  // TODO: use kysely for this?
  const findBySessionIdSchema = SqlSchema.findOne({
    Request: SessionId,
    Result: User,
    execute: sessionId =>
      sql`select user.* from user_session inner join user on user.id = user_session.user_id where user_session.id = ${sessionId}`,
  })

  const findSessionByIdSchema = SqlSchema.findOne({
    Request: SessionId,
    Result: Session,
    execute: sessionId =>
      sql`select * from user_session where id = ${sessionId}`,
  })

  const findBySessionId = (sessionId: SessionId) =>
    pipe(
      findBySessionIdSchema(sessionId),
      Effect.orDie,
      Effect.withSpan("UsersRepo.findBySessionId"),
    )

  const findSessionById = (sessionId: SessionId) =>
    pipe(
      findSessionByIdSchema(sessionId),
      Effect.orDie,
      Effect.withSpan("UsersRepo.findSessionById"),
    )

  const findUserAndSessionBySessionId = (sessionId: SessionId) =>
    pipe(
      Effect.zip(findBySessionId(sessionId), findSessionById(sessionId), {
        concurrent: true,
      }),
      // Note: there's probably a more elegant way to express this part
      Effect.flatMap(([user, session]) =>
        Effect.succeed(Option.all([user, session])),
      ),
      Effect.withSpan("UsersRepo.findUserAndSessionBySessionId"),
    )

  return {
    ...repo,
    findBySessionId,
    findSessionById,
    findUserAndSessionBySessionId,
  } as const
})

export class UserRepo extends Context.Tag("Users/Repo")<
  UserRepo,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(UserRepo, make).pipe(Layer.provide(SqlLive))
}
