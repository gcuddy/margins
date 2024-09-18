import { Model, SqlClient, SqlResolver, SqlSchema } from "@effect/sql"
import { Context, Effect, Layer, Logger, LogLevel } from "effect"
import { Bookmark, BookmarkId } from "../Domain/Bookmark.js"
import { SqlLive } from "../Sql.js"
import { UserId } from "../Domain/User.js"
import { Schema } from "@effect/schema"
import { SearchResult } from "../Domain/Replicache.js"

export const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient

  const repo = yield* Model.makeRepository(Bookmark, {
    tableName: "Bookmark",
    spanPrefix: "BookmarksRepo",
    idColumn: "id",
  })
  //   TODO: better name
  const searchForUserId = SqlSchema.findAll({
    Request: UserId,
    // Result: Entry.pipe(Schema.pick("id", "updatedAt")),
    Result: SearchResult,
    //TODO: maybe use kysely here?
    execute: userId =>
      // Soemthing like this?
      sql`select id, updatedAt as rowversion from Bookmark where userId = ${userId}`,
    //   sql`select id, updatedAt from Entry where userId = ${userId}`,
  })

  const getForIds = SqlSchema.findAll({
    Request: Schema.NonEmptyArray(BookmarkId),
    Result: Bookmark,
    execute: ids => sql`select * from Bookmark where ${sql.in("id", ids)}`,
  })

  const getForUnknownIds = (ids?: string[]) =>
    Effect.gen(function* () {
      const nonEmptyArray = Schema.NonEmptyArray(BookmarkId)
      const decode = Schema.decodeUnknownOption(nonEmptyArray)
      const _ids = yield* decode(ids)
      const bookmarks = yield* getForIds(_ids)
      return bookmarks
    }).pipe(
      Effect.tapErrorCause(Effect.logError),
      Effect.withLogSpan("BookmarksRepo.getForUnknownIds"),
      Effect.catchTag("ParseError", () =>
        Effect.succeed([] as readonly Bookmark[]),
      ),
    )

  return {
    ...repo,
    searchForUserId,
    getForIds,
    getForUnknownIds,
  } as const
})

export class BookmarksRepo extends Context.Tag("Bookmarks/Repo")<
  BookmarksRepo,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(BookmarksRepo, make).pipe(Layer.provide(SqlLive))
}
