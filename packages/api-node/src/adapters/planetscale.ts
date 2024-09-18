import {
  Config,
  Context,
  type Duration,
  Effect,
  Layer,
  Redacted,
  Scope,
} from "effect"
import { identity } from "effect/Function"
import type { Connection } from "@effect/sql/SqlConnection"
import * as Client from "@effect/sql/SqlClient"
import { Client as PClient } from "@planetscale/database"
import * as Statement from "@effect/sql/Statement"
import { SqlError } from "@effect/sql/SqlError"
import * as Otel from "@opentelemetry/semantic-conventions"
import type { ConfigError } from "effect/ConfigError"

export const TypeId: unique symbol = Symbol.for(
  "@effect/sql-planetscale/PlanetscaleClient",
)

/**
 * @category type ids
 * @since 1.0.0
 */
export type TypeId = typeof TypeId

/**
 * @category models
 * @since 1.0.0
 */
export interface PlanetscaleClient extends Client.SqlClient {
  readonly [TypeId]: TypeId
  readonly config: PlanetscaleClientConfig
}

export interface PlanetscaleClientConfig {
  readonly host: string
  readonly username: string
  readonly password: Redacted.Redacted

  readonly prepareCacheSize?: number | undefined
  readonly prepareCacheTTL?: Duration.DurationInput | undefined

  readonly spanAttributes?: Record<string, unknown> | undefined

  readonly transformResultNames?: ((str: string) => string) | undefined
  readonly transformQueryNames?: ((str: string) => string) | undefined
}

/**
 * @category tags
 * @since 1.0.0
 */
export const PlanetscaleClient = Context.GenericTag<PlanetscaleClient>(
  "@effect/sql-planetscale/PlanetscaleClient",
)

const escape = Statement.defaultEscape("`")
export const make = (options: PlanetscaleClientConfig) =>
  // eslint-disable-next-line require-yield
  Effect.gen(function* () {
    const x = 1
    const compiler = Statement.makeCompiler({
      dialect: "mysql",
      placeholder(_) {
        return `?`
      },
      onIdentifier: escape,
      onCustom() {
        return ["", []]
      },
      onRecordUpdate() {
        return ["", []]
      },
    })

    const transformRows = Statement.defaultTransforms(
      options.transformResultNames!,
    ).array

    // put in class?

    // eslint-disable-next-line require-yield
    const makeConnection = Effect.gen(function* () {
      const client = new PClient({
        fetch: (url, init) => {
          if (init) delete init["cache"]
          return fetch(url, init)
        },
        host: options.host,
        username: options.username,
        password: Redacted.value(options.password),
      })
      client.connection()
      //   const prepareCache = yield* Cache.make({
      //     capacity: options.prepareCacheSize ?? 200,
      //     timeToLive: options.prepareCacheTTL ?? Duration.minutes(10),
      //     lookup: (sql: string) =>
      //       Effect.try({
      //         try: () => db.prepare(sql),
      //         catch: cause =>
      //           new SqlError({ cause, message: `Failed to prepare statement` }),
      //       }),
      //   })

      //   TODO: Clean up types here
      const run = (
        sql: string,
        params?: ReadonlyArray<Statement.Primitive>,
        as: "array" | "object" = "object",
      ) =>
        Effect.gen(function* () {
          yield* Effect.logDebug(sql, params)
          const result = yield* Effect.tryPromise({
            try: () => {
              return client.execute(sql, params as any, { as: as as any })
            },
            catch: cause =>
              new SqlError({ cause, message: `Failed to execute statement` }),
          })

          //   TODO: use other data for otel
          return result.rows as any[]
        })

      const runTransform = options.transformResultNames
        ? (sql: string, params?: ReadonlyArray<Statement.Primitive>) =>
            Effect.map(run(sql, params), transformRows)
        : run

      return identity<Connection>({
        execute(sql, params) {
          return runTransform(sql, params)
        },
        executeRaw(sql, params) {
          return run(sql, params)
        },
        executeValues(sql, params) {
          return run(sql, params, "array")
        },
        executeStream(_sql, _params) {
          return Effect.dieMessage("executeStream not implemented")
        },
        executeWithoutTransform(sql, params) {
          return run(sql, params)
        },
        executeUnprepared(sql, params) {
          return runTransform(sql, params)
        },
      })
    })

    const semaphore = yield* Effect.makeSemaphore(1)

    const connection = yield* makeConnection
    const acquirer = semaphore.withPermits(1)(Effect.succeed(connection))

    const transactionAcquirer = Effect.uninterruptibleMask(restore =>
      Effect.as(
        Effect.zipRight(
          restore(semaphore.take(1)),
          Effect.tap(Effect.scope, scope =>
            Scope.addFinalizer(scope, semaphore.release(1)),
          ),
        ),
        connection,
      ),
    )

    Effect.uninterruptibleMask

    return Object.assign(
      Client.make({
        acquirer,
        transactionAcquirer,
        compiler,
        spanAttributes: [
          ...(options.spanAttributes
            ? Object.entries(options.spanAttributes)
            : []),
          [Otel.SEMATTRS_DB_SYSTEM, Otel.DBSYSTEMVALUES_SQLITE],
        ],
      }) as PlanetscaleClient,
      {
        [TypeId]: TypeId,
        config: options,
      },
    )
  })

export const layer = (
  config: Config.Config.Wrap<PlanetscaleClientConfig>,
): Layer.Layer<PlanetscaleClient | Client.SqlClient, ConfigError> =>
  Layer.scopedContext(
    Config.unwrap(config).pipe(
      Effect.flatMap(make),
      Effect.map(client =>
        Context.make(PlanetscaleClient, client).pipe(
          Context.add(Client.SqlClient, client),
        ),
      ),
    ),
  )
