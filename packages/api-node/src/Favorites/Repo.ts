import { Model, SqlClient, SqlSchema } from "@effect/sql"
import { Context, Effect, Layer } from "effect"
import { SqlLive } from "../Sql.js"
import { UserId } from "../Domain/User.js"
import { Schema } from "@effect/schema"
import { SearchResult } from "../Domain/Replicache.js"
import { Favorite, FavoriteId } from "../Domain/Favorite.js"

export const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient

  const repo = yield* Model.makeRepository(Favorite, {
    tableName: "Favorite",
    spanPrefix: "FavoritesRepo",
    idColumn: "id",
  })

  const searchForUserId = SqlSchema.findAll({
    Request: UserId,
    // Result: Entry.pipe(Schema.pick("id", "updatedAt")),
    Result: SearchResult,
    //TODO: maybe use kysely here?
    execute: userId =>
      sql`select id, updatedAt as rowversion from Favorite where userId = ${userId}`,
  })

  const getForIds = SqlSchema.findAll({
    Request: Schema.NonEmptyArray(FavoriteId),
    Result: Favorite,
    execute: ids => sql`select * from Favorite where ${sql.in("id", ids)}`,
  })

  //   TODO: create a generic one for all repos
  const getForUnknownIds = (ids?: string[]) =>
    Effect.gen(function* () {
      const nonEmptyArray = Schema.NonEmptyArray(FavoriteId)
      const decode = Schema.decodeUnknownOption(nonEmptyArray)
      const _ids = yield* decode(ids)
      const favorites = yield* getForIds(_ids)
      return favorites
    }).pipe(
      Effect.tapErrorCause(Effect.logError),
      Effect.withLogSpan("FavoritesRepo.getForUnknownIds"),
      Effect.catchTag("ParseError", () =>
        Effect.succeed([] as readonly Favorite[]),
      ),
    )

  return {
    ...repo,
    searchForUserId,
    getForIds,
    getForUnknownIds,
  } as const
})

export class FavoritesRepo extends Context.Tag("Favorites/Repo")<
  FavoritesRepo,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(FavoritesRepo, make).pipe(Layer.provide(SqlLive))
}
