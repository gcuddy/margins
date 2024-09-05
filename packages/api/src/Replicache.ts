import { Array, Context, Effect, Layer, Option, pipe } from "effect"
import { DB, DBError } from "./db"
import { Schema } from "@effect/schema"
import { DatabaseTransactional } from "./db-transaction"
import { SqlClient, SqlSchema } from "@effect/sql"
import type { UserId } from "./Domain/User.js"
import {
  ReplicacheClient,
  ReplicacheClientGroup,
  ReplicacheClientId,
  type Mutation,
  type PushRequest,
  type ReplicacheClientGroupId,
} from "./Domain/Replicache.js"
import { ReplicacheClientGroupRepo } from "./Replicache/ClientGroupRepo"
import { ReplicacheClientRepo } from "./Replicache/ClientRepo"

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient
  const clientGroupRepo = yield* ReplicacheClientGroupRepo
  const clientRepo = yield* ReplicacheClientRepo

  // TODO: should these be here? or in the repo?
  const getClientGroup = (
    clientGroupID: ReplicacheClientGroupId,
    userID: UserId,
  ) =>
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
    userID: UserId,
    clientGroupID: ReplicacheClientGroupId,
    mutation: Mutation,
    // 1: `let errorMode = false`. In JS, we implement this step naturally
    // as a param. In case of failure, caller will call us again with `true`.
    // TODO: there's probably a more Effect-y way to do this
    errorMode: boolean,
  ) =>
    Effect.gen(function* () {
      const clientGroup = yield* getClientGroup(clientGroupID, userID)
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
    }).pipe(sql.withTransaction)

  const push = (userId: UserId, pushRequest: PushRequest) => {
    // TODO: poke backend (layer)
    return Effect.forEach(
      pushRequest.mutations,
      mutation =>
        processMutation(
          userId,
          pushRequest.clientGroupID,
          mutation,
          false,
        ).pipe(
          // Probably not the best way to do this
          Effect.tapError(_ =>
            processMutation(userId, pushRequest.clientGroupID, mutation, true),
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

  return {
    push,
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

// TODO: branded types via Schema
// TODO: move these to domain repository (ReplicacheClientGroup, ReplicacheClient)
const getClientGroup = (clientGroupID: string, userID: UserId) =>
  Effect.gen(function* () {
    const transaction = yield* DatabaseTransactional
    const clientGroupRows = yield* transaction
      .selectFrom("replicache_client_group")
      .select(["userId", "cvrVersion"])
      .where("id", "=", clientGroupID)

    const head = Array.head(clientGroupRows)

    if (Option.isSome(head) && head.value.userId !== userID) {
      yield* new AuthorizationError("User ID mismatch")
    }

    return {
      id: clientGroupID,
      userID,
      cvrVersion: Option.isSome(head) ? head.value.cvrVersion : 0,
    }
  })

const putClientGroup = (clientGroup: ClientGroupRecord) =>
  Effect.gen(function* () {
    const transaction = yield* DatabaseTransactional
    yield* transaction
      .insertInto("replicache_client_group")
      .values({
        id: clientGroup.id,
        userId: clientGroup.userID,
        cvrVersion: clientGroup.cvrVersion,
        // TODO: lastModified?
        updatedAt: new Date(),
        // TODO: DEPRECATED
        clientVersion: 0,
      })
      .onDuplicateKeyUpdate({
        userId: clientGroup.userID,
        cvrVersion: clientGroup.cvrVersion,
        updatedAt: new Date(),
      })
  })

const getClient = (clientID: string, clientGroupID: string) =>
  Effect.gen(function* () {
    const transaction = yield* DatabaseTransactional
    const clientRows = yield* transaction
      .selectFrom("replicache_client")
      .select(["clientGroupId", "lastMutationId"])
      .where("id", "=", clientID)

    const head = Array.head(clientRows)

    if (Option.isSome(head) && head.value.clientGroupId !== clientGroupID) {
      yield* new AuthorizationError("Client does not belong to client group")
    }

    return {
      id: clientID,
      clientGroupID,
      lastMutationID: Option.isSome(head) ? head.value.lastMutationId : 0,
    }
  })

// TODO: decide between lastModified and updatedAt
const putClient = (client: ClientRecord) =>
  Effect.gen(function* () {
    const transaction = yield* DatabaseTransactional
    yield* transaction
      .insertInto("replicache_client")
      .values({
        id: client.id,
        clientGroupId: client.clientGroupID,
        lastMutationId: client.lastMutationID,
        lastModified: new Date(),
        updatedAt: new Date(),

        // TODO: DEPRECATED
        clientVersion: 0,
      })
      .onDuplicateKeyUpdate({
        lastMutationId: client.lastMutationID,
        lastModified: new Date(),
        updatedAt: new Date(),
      })
  })

export class Replicache extends Context.Tag("core/replicache")<
  Replicache,
  Effect.Effect.Success<typeof make>
>() {
  static readonly Live = Layer.scoped(this, make)
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
