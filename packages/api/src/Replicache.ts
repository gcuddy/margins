import { Array, Context, Effect, Layer, Option, pipe } from "effect"
import { Schema } from "@effect/schema"
import { SqlClient, SqlSchema } from "@effect/sql"
import { CurrentUser, type UserId } from "./Domain/User.js"
import type { ReplicacheClientId } from "./Domain/Replicache.js"
import {
  ReplicacheClient,
  ReplicacheClientGroup,
  type Mutation,
  type PushRequest,
  type PullRequest,
  type ReplicacheClientGroupId,
} from "./Domain/Replicache.js"
import { ReplicacheClientGroupRepo } from "./Replicache/ClientGroupRepo.js"
import { ReplicacheClientRepo } from "./Replicache/ClientRepo.js"
import { SqlLive } from "./Sql.js"
import { server } from "./Replicache/mutations2.js"
import { CVRCache } from "./Replicache/ClientViewRecord.js"

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient
  const clientGroupRepo = yield* ReplicacheClientGroupRepo
  const clientRepo = yield* ReplicacheClientRepo
  const cvrCache = yield* CVRCache
  const { id: userID } = yield* CurrentUser

  // TODO: should these be here? or in the repo?
  const getClientGroup = (clientGroupID: ReplicacheClientGroupId) =>
    pipe(
      clientGroupRepo.findById(clientGroupID),
      Effect.flatMap(
        Option.match({
          onNone: () =>
            Effect.succeed({
              id: clientGroupID,
              userID,
              cvrVersion: 0,
            }),
          onSome: clientGroup =>
            clientGroup.userID === userID
              ? Effect.succeed(clientGroup)
              : Effect.fail(new AuthorizationError("User ID mismatch")),
        }),
      ),
      // Effect.orDie
      Effect.withSpan("Replicache.getClientGroup", {
        attributes: { userID, clientGroupID },
      }),
    )

  const getClient = (
    clientID: ReplicacheClientId,
    clientGroupID: ReplicacheClientGroupId,
  ) =>
    pipe(
      clientRepo.findById(clientID),
      Effect.flatMap(
        Option.match({
          onNone: () =>
            Effect.succeed({
              id: clientID,
              clientGroupID,
              lastMutationID: 0,
            }),
          onSome: client =>
            client.clientGroupID === clientGroupID
              ? Effect.succeed(client)
              : Effect.fail(
                  new AuthorizationError(
                    "Client does not belong to client group",
                  ),
                ),
        }),
      ),
      Effect.withSpan("Replicache.getClient", {
        attributes: { clientID, clientGroupID },
      }),
    )
  const putClientGroup = (
    clientGroup: typeof ReplicacheClientGroup.insert.Type,
  ) =>
    Effect.gen(function* () {
      // TODO: Better way to do this
      const insert = SqlSchema.void({
        Request: ReplicacheClientGroup.insert,
        execute: clientGroup =>
          // NOTE: MySql doesn't support RETURNING
          sql`insert into replicache_client_group ${sql.insert(clientGroup).returning("*")} on duplicate key update userId = ${clientGroup.userID}, cvrVersion = ${clientGroup.cvrVersion}, updatedAt = now()`,
      })
      return yield* insert(clientGroup)
    }).pipe(
      Effect.withSpan("Replicache.putClientGroup", {
        attributes: { clientGroup },
      }),
    )

  const putClient = (client: typeof ReplicacheClient.update.Type) =>
    Effect.gen(function* () {
      const upsert = SqlSchema.void({
        Request: ReplicacheClient.update,
        execute: client =>
          sql`insert into replicache_client ${sql.insert(client).returning("*")} on duplicate key update lastMutationId = ${client.lastMutationID}, lastModified = now(), updatedAt = now()`,
      })
      return yield* upsert(client)
    }).pipe(
      Effect.withSpan("Replicache.putClient", {
        attributes: { client },
      }),
    )

  const processMutation = (
    clientGroupID: ReplicacheClientGroupId,
    mutation: Mutation,
    // 1: `let errorMode = false`. In JS, we implement this step naturally
    // as a param. In case of failure, caller will call us again with `true`.
    // TODO: there's probably a more Effect-y way to do this
    errorMode: boolean,
  ) =>
    Effect.gen(function* () {
      const clientGroup = yield* getClientGroup(clientGroupID)
      const baseClient = yield* getClient(mutation.clientID, clientGroupID)

      // TODO: pick up here 2024-09-05

      const nextMutationID = baseClient.lastMutationID + 1

      // 8: rollback and skip if already processed.
      if (mutation.id < nextMutationID) {
        yield* Effect.log(
          `Mutation ${mutation.id} has already been processed - skipping`,
        )
        // return affected
      }

      // 9: Rollback and error if from future.
      if (mutation.id > nextMutationID) {
        yield* new FutureMutationError(
          `Mutation ${mutation.id} is from the future - aborting`,
        )
      }
      // TODO: spans and timing

      if (!errorMode) {
        // try mutate
        yield* server.execute(mutation.name, mutation.args)
      }
      // TODO: built in retry logic for Effect?

      // 11-12: put client and client group
      const nextClient = ReplicacheClient.update.make({
        id: mutation.clientID,
        clientGroupID,
        lastMutationID: nextMutationID,
      })

      yield* Effect.all([
        putClientGroup(ReplicacheClientGroup.insert.make(clientGroup)),
        putClient(nextClient),
      ])

      // console.log time

      // return affected (keep track - some sort of repository layer that gets yielded isnide and noted? userIds, workspaceIds, sharedLists, etc.)
    }).pipe(Effect.tapErrorCause(Effect.logError), sql.withTransaction)

  const push = (pushRequest: PushRequest) => {
    // TODO: poke backend (layer)
    return Effect.forEach(
      pushRequest.mutations,
      mutation =>
        processMutation(pushRequest.clientGroupID, mutation, false).pipe(
          // Probably not the best way to do this
          Effect.tapError(_ =>
            processMutation(pushRequest.clientGroupID, mutation, true),
          ),
          Effect.withSpan("Replicache.processMutation", {
            attributes: { mutation },
          }),
        ),
      // TODO: catch errors and return them
      // TODO: retry logic
    ).pipe(
      Effect.withSpan("Replicache.push", {
        attributes: { pushRequest },
      }),
    )
  }

  const pull = (pullRequest: PullRequest) =>
    Effect.gen(function* () {
      // TODO: implement pull
      const { clientGroupID } = pullRequest

      const prevCvr = yield* pipe(
        Option.fromNullable(pullRequest.cookie),
        Option.match({
          onSome: cookie => cvrCache.get(cookie.cvrID),
          onNone: () => Effect.succeedNone,
        }),
      )

      // TODO
      const baseCVR = Option.match(prevCvr, {
        onSome: cvr => cvr,
        onNone: () => CVR.empty,
      })
    })

  return {
    push,
    pull,
  } as const
})

export class AuthorizationError extends Schema.TaggedError<AuthorizationError>()(
  "AuthorizationError",
  {},
) {}

export class FutureMutationError extends Schema.TaggedError<FutureMutationError>()(
  "FutureMutationError",
  {},
) {}

export class Replicache extends Context.Tag("core/replicache")<
  Replicache,
  Effect.Effect.Success<typeof make>
>() {
  static readonly Live = Layer.scoped(this, make).pipe(
    Layer.provide(SqlLive),
    Layer.provide(ReplicacheClientGroupRepo.Live),
    Layer.provide(ReplicacheClientRepo.Live),
  )
}

class ClientGroupRecord extends Schema.Class<ClientGroupRecord>(
  "ClientGroupRecord",
)({
  id: Schema.String,
  cvrVersion: Schema.Number,
  userID: Schema.String,
}) {}

class ClientRecord extends Schema.Class<ClientRecord>("ClientRecord")({
  id: Schema.String,
  clientGroupID: Schema.String,
  lastMutationID: Schema.Number,
}) {}

// export class ReplicacheClientGroup extends Context.Tag(
//   "core/replicacheClientGroup",
// )<
//   ReplicacheClientGroup,
//   {
//     userID: string
//     clientGroupID: string
//     cvrVersion: number
//   }
// >() {}
