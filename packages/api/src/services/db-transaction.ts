import { Context, Data, Effect, type Exit, Layer, pipe } from "effect"
import type { Transaction } from "kysely"
import { DB } from "./db.js"
import type { KyselyDB } from "@margins/db"

// const LibsqlClientLive = Layer.scoped(
//     LibsqlClient,
//     Effect.gen(function* () {
//       const client = createClient({ url: '' });
//       yield* Effect.addFinalizer(() =>
//         Effect.andThen(
//           Effect.sync(() => client.close()),
//           Effect.log(`closing libsql connection`)
//         )
//       );
//       return client;
//     })
//   );

type DBTX = {
  db: Transaction<KyselyDB>
  operation: Promise<void>
  commit: () => void
  rollback: () => void
}

class RollbackError extends Data.TaggedError("RollbackError") {
  static isRollback(e: unknown): e is RollbackError {
    return e instanceof this && e._tag === "RollbackError"
  }
}

const acquire = Effect.gen(function* () {
  const db = yield* DB

  return yield* Effect.async<DBTX>(resume => {
    const txSuspend = Promise.withResolvers()
    const operation = db
      .transaction()
      .setIsolationLevel("serializable")
      .execute(async tx => {
        resume(
          Effect.succeed({
            db: tx,
            operation,
            commit: txSuspend.resolve,
            rollback: () => txSuspend.reject(new RollbackError()),
          }),
        )
        await txSuspend.promise
      })
  })
})

const release = (tx: DBTX, _e: Exit.Exit<unknown, unknown>) =>
  Effect.gen(function* (pipe) {
    yield* Effect.log("Rolling back transaction")
    tx.rollback()
    yield* pipe(
      Effect.tryPromise({
        try: () => tx.operation,
        catch: e => (RollbackError.isRollback(e) ? e : new Error(`${e}`)),
      }),
      Effect.catchTag("RollbackError", Effect.ignore),
      Effect.catchAll(a => Effect.die(a)),
    )
  })

export class DatabaseTransactional extends Context.Tag("core/dbTransactional")<
  DatabaseTransactional,
  Transaction<KyselyDB>
>() {
  static readonly Live = Layer.scoped(
    this,
    pipe(
      Effect.acquireRelease(acquire, release),
      Effect.map(a => a.db),
    ),
  )
}

// const DatabaseTransactionalLive = Layer.scoped(
//   DB,
//   pipe(
//     Effect.acquireRelease(acquire, release),
//     Effect.map(a => a.db),
//   ),
// )

Effect.gen(function* () {
  const db = yield* DatabaseTransactional
})
