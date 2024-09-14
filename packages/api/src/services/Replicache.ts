import { Array, Context, Effect, Layer, Option } from "effect"
import { DB, DBError } from "./db.js"
import { Schema } from "@effect/schema"
import { DatabaseTransactional } from "./db-transaction.js"

export class Mutation extends Schema.Class<Mutation>("Mutation")({
  id: Schema.Number,
  clientID: Schema.String,
  name: Schema.String,
  args: Schema.Any,
}) {}

export class PushRequest extends Schema.Class<PushRequest>("PushRequest")({
  clientGroupID: Schema.String,
  mutations: Schema.Array(Mutation),
}) {}

export class Cookie extends Schema.Class<Cookie>("Cookie")({
  order: Schema.Number,
  cvrID: Schema.String,
}) {}

export class PullRequest extends Schema.Class<PullRequest>("PullRequest")({
  clientGroupID: Schema.String,
  cookie: Schema.NullishOr(Cookie),
}) {}

export const patchOperation = Schema.Union(
  Schema.Struct({
    op: Schema.Literal("put"),
    key: Schema.String,
    // JSONValue
    value: Schema.Unknown,
  }),
  Schema.Struct({
    op: Schema.Literal("del"),
    key: Schema.String,
  }),
  Schema.Struct({
    op: Schema.Literal("clear"),
  }),
)

export class PullResponse extends Schema.Class<PullResponse>("PullResponse")({
  cookie: Cookie,
  lastMutationIDChanges: Schema.Record({
    key: Schema.String,
    value: Schema.Number,
  }),
  patch: Schema.Array(patchOperation),
}) {}

export class UserData extends Context.Tag("core/userData")<
  UserData,
  {
    userID: string
  }
>() {
  static readonly Live = Layer.succeed(this, { userID: "1" })
}

const make = Effect.gen(function* () {
  const db = yield* DB
  const { userID } = yield* UserData
  // const transaction = yield* DatabaseTransactional
  // TODO from here - use transaction

  const push = (pushRequest: PushRequest) => {
    // TODO: poke backend (layer)
    return Effect.forEach(
      pushRequest.mutations,
      mutation =>
        processMutation(userID, pushRequest.clientGroupID, mutation, false),
      // TODO: catch errors and return them
      // TODO: retry logic
    ).pipe(
      Effect.catchTag("SqlError", () => new DBError({ cause: "SqlError" })),
    )
  }

  return {
    push,
  } as const
})

const processMutation = (
  userID: string,
  clientGroupID: string,
  mutation: Mutation,
  // 1: `let errorMode = false`. In JS, we implement this step naturally
  // as a param. In case of failure, caller will call us again with `true`.
  errorMode: boolean,
) =>
  Effect.gen(function* () {
    const clientGroup = yield* getClientGroup(clientGroupID, userID)
    const baseClient = yield* getClient(mutation.clientID, clientGroupID)

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
    const nextClient = {
      id: mutation.clientID,
      clientGroupID,
      lastMutationID: nextMutationID,
    }

    yield* Effect.all([putClientGroup(clientGroup), putClient(nextClient)])

    // console.log time

    // return affected (keep track - some sort of repository layer that gets yielded isnide and noted? userIds, workspaceIds, sharedLists, etc.)
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
const getClientGroup = (clientGroupID: string, userID: string) =>
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
        // clientVersion: 0,
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

export class ReplicacheClientGroup extends Context.Tag(
  "core/replicacheClientGroup",
)<
  ReplicacheClientGroup,
  {
    userID: string
    clientGroupID: string
    cvrVersion: number
  }
>() {}
