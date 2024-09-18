import { Model, SqlClient, SqlSchema } from "@effect/sql"
import { Context, Effect, Layer } from "effect"
import { Annotation, AnnotationId } from "../Domain/Annotation.js"
import { SearchResult } from "../Domain/Replicache.js"
import { UserId } from "../Domain/User.js"
import { Schema } from "@effect/schema"
import { EntryId } from "../Domain/Entry.js"
import { SqlLive } from "../Sql.js"

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

  const getForUnknownIds = (ids?: string[]) =>
    Effect.gen(function* () {
      const nonEmptyArray = Schema.NonEmptyArray(AnnotationId)
      const decode = Schema.decodeUnknownOption(nonEmptyArray)
      const _ids = yield* decode(ids)
      const annotations = yield* getForIds(_ids)
      return annotations
    }).pipe(
      Effect.tapErrorCause(Effect.logError),
      Effect.withLogSpan("AnnotationsRepo.getForUnknownIds"),
      Effect.catchTag("ParseError", () =>
        Effect.succeed([] as readonly Annotation[]),
      ),
    )

  //   TODO: policies to confirm

  return {
    ...repo,
    searchForUserId,
    getForIds,
    getForUnknownIds,
  } as const
})

export class AnnotationsRepo extends Context.Tag("Annotations/Repo")<
  AnnotationsRepo,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(AnnotationsRepo, make).pipe(Layer.provide(SqlLive))
}
