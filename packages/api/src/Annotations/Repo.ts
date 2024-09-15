import { Model, SqlClient, SqlSchema } from "@effect/sql"
import { Context, Effect, Layer } from "effect"
import { Annotation, AnnotationId } from "../Domain/Annotation"
import { SearchResult } from "../Domain/Replicache"
import { UserId } from "../Domain/User"
import { Schema } from "@effect/schema"
import { EntryId } from "../Domain/Entry"
import { SqlLive } from "../Sql"

export const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient
  const repo = yield* Model.makeRepository(Annotation, {
    tableName: "Annotation",
    spanPrefix: "AnnotationsRepo",
    idColumn: "id",
  })

  const searchForUserId = SqlSchema.findAll({
    Request: UserId,
    Result: SearchResult,
    execute: userId =>
      sql`select id, updatedAt as rowversion from Annotation where userId = ${userId}`,
  })

  const getForIds = SqlSchema.findAll({
    Request: Schema.NonEmptyArray(AnnotationId),
    Result: Annotation,
    execute: ids => sql`select * from Annotation where ${sql.in("id", ids)}`,
  })

  //   TODO: policies to confirm

  return {
    ...repo,
    searchForUserId,
    getForIds,
  } as const
})

export class AnnotationsRepo extends Context.Tag("Annotations/Repo")<
  AnnotationsRepo,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(AnnotationsRepo, make).pipe(Layer.provide(SqlLive))
}
