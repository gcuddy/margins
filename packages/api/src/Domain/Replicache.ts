import { Model } from "@effect/sql"
import { Schema } from "@effect/schema"
import { UserId } from "./User.js"
import { pipe, Record } from "effect"

export const ReplicacheClientGroupId = Schema.String.pipe(
  Schema.brand("ReplicacheClientGroupId"),
)
export type ReplicacheClientGroupId = typeof ReplicacheClientGroupId.Type

export class ReplicacheClientGroup extends Model.Class<ReplicacheClientGroup>(
  "ReplicacheClientGroup",
)({
  id: Model.Generated(ReplicacheClientGroupId),
  cvrVersion: Schema.Number,
  userID: UserId,
  createdAt: Model.DateTimeInsert,
  updatedAt: Model.DateTimeUpdate,
}) {}

export const ReplicacheClientId = Schema.String.pipe(
  Schema.brand("ReplicacheClientId"),
)
export type ReplicacheClientId = typeof ReplicacheClientId.Type

export class ReplicacheClient extends Model.Class<ReplicacheClient>(
  "ReplicacheClient",
)({
  id: Model.Generated(ReplicacheClientId),
  clientGroupID: ReplicacheClientGroupId,
  lastMutationID: Schema.Number,
  createdAt: Model.DateTimeInsert,
  updatedAt: Model.DateTimeUpdate,
}) {}

// CVR
export const ClientViewRecordId = Schema.String.pipe(
  Schema.brand("ClientViewRecordId"),
)
export type ClientViewRecordId = typeof ClientViewRecordId.Type

export const ClientViewEntries = Schema.Record({
  key: Schema.String,
  value: Schema.Number,
})

export const ClientViewRecord = Schema.Record({
  key: Schema.String,
  value: ClientViewEntries,
})

export class SearchResult extends Schema.Class<SearchResult>("SearchResult")({
  id: Schema.String,
  rowversion: Schema.Number,
}) {}

export const SearchResultsFromClientViewEntries = Schema.transform(
  ClientViewEntries,
  Schema.Array(SearchResult),
  {
    strict: true,
    // Maybe there's a better way without double loop?
    decode: entries =>
      pipe(Record.toEntries(entries), a =>
        a.map(([id, rowversion]) => ({ id, rowversion })),
      ),
    encode: result =>
      pipe(
        result.map(({ id, rowversion }) => [id, rowversion] as const),
        Record.fromEntries,
      ),
  },
)

export const ClientViewRecordDiff = Schema.Record({
  key: Schema.String,
  value: Schema.Struct({
    puts: Schema.Array(Schema.String),
    dels: Schema.Array(Schema.String),
  }),
})

// export class ClientViewRecord extends Schema.Class<ClientViewRecord>(
//   "ClientViewRecord",
// )({
//   id: Model.Generated(ClientViewRecordId),
//   cvrID: Schema.String,
//   createdAt: Model.DateTimeInsert,
//   updatedAt: Model.DateTimeUpdate,
// }) {}

export class Mutation extends Schema.Class<Mutation>("Mutation")({
  id: Schema.Number,
  clientID: ReplicacheClientId,
  name: Schema.String,
  args: Schema.Any,
}) {}

export class PushRequest extends Schema.Class<PushRequest>("PushRequest")({
  clientGroupID: ReplicacheClientGroupId,
  mutations: Schema.Array(Mutation),
}) {}

export class Cookie extends Schema.Class<Cookie>("Cookie")({
  order: Schema.Number,
  cvrID: ClientViewRecordId,
}) {}

export class PullRequest extends Schema.Class<PullRequest>("PullRequest")({
  clientGroupID: ReplicacheClientGroupId,
  cookie: Schema.NullishOr(Cookie),
}) {}

export const patchOperation = Schema.Union(
  Schema.Struct({
    op: Schema.Literal("put"),
    key: Schema.String,
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

export class FutureMutationError extends Schema.TaggedError<FutureMutationError>()(
  "FutureMutationError",
  {},
) {}
