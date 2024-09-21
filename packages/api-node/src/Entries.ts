import { Effect, Layer, Option, pipe } from "effect"
import { EntriesRepo } from "./Entries/Repo.js"
import { SqlClient } from "@effect/sql"
import { Entry, EntryId, EntryNotFound } from "./Domain/Entry.js"
import { policyRequire } from "./Domain/Actor.js"
import { SqlLive } from "./Sql.js"

const make = Effect.gen(function* () {
  const repo = yield * EntriesRepo
  const sql = yield * SqlClient.SqlClient

  // TODO: move non-db level stuff to here

  const findEntryById = (id: EntryId) =>
    pipe(
      repo.findById(id),
      Effect.withSpan("Entries.findEntryById", {
        attributes: { id },
      }),
      policyRequire("Entry", "read"),
    )

  const with_ = <A, E, R>(
    id: EntryId,
    f: (entry: Entry) => Effect.Effect<A, E, R>,
  ): Effect.Effect<A, E | EntryNotFound, R> =>
    pipe(
      repo.findById(id),
      Effect.flatMap(
        Option.match({
          onNone: () => new EntryNotFound({ id }),
          onSome: Effect.succeed,
        }),
      ),
      Effect.flatMap(f),
      sql.withTransaction,
      Effect.catchTag("SqlError", err => Effect.die(err)),
      Effect.withSpan("Entries.with", { attributes: { id } }),
    )

  return {
    findEntryById,
    with: with_,
  } as const
})

export class Entries extends Effect.Tag("Entries")<
  Entries,
  Effect.Effect.Success<typeof make>
>() {
  static layer = Layer.effect(Entries, make)
  static Live = this.layer.pipe(
    Layer.provide(EntriesRepo.Live),
    Layer.provide(SqlLive),
  )
}
