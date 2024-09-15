import { Model, SqlClient, SqlSchema } from "@effect/sql"
import { Context, Effect, Layer } from "effect"
import { SqlLive } from "../Sql"
import { UserId } from "../Domain/User"
import { Schema } from "@effect/schema"
import { SearchResult } from "../Domain/Replicache"
import { Favorite, FavoriteId } from "../Domain/Favorite"

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

  return {
    ...repo,
    searchForUserId,
    getForIds,
  } as const
})

export class FavoritesRepo extends Context.Tag("Favorites/Repo")<
  FavoritesRepo,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(FavoritesRepo, make).pipe(Layer.provide(SqlLive))
}
