import { Model } from "@effect/sql"
import { Schema } from "@effect/schema"
import { UserId } from "./User.js"
import { pipe, Record } from "effect"
import { DateTimeString } from "./DateTime.js"

export const ReplicacheClientGroupId = Schema.String.pipe(
  Schema.brand("ReplicacheClientGroupId"),
)
export type ReplicacheClientGroupId = typeof ReplicacheClientGroupId.Type

export class ReplicacheClientGroup extends Model.Class<ReplicacheClientGroup>(
  "ReplicacheClientGroup",
)({
  id: Model.GeneratedByApp(ReplicacheClientGroupId),
  cvrVersion: Schema.Number,
  userId: UserId,
  createdAt: Model.Generated(DateTimeString),
  updatedAt: DateTimeString,
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

export class NumberFromDateString extends Schema.transform(
  Schema.String,
  Schema.Number,
  {
    strict: true,
    decode: d => new Date(d).getTime(),
    encode: n => new Date(n).toISOString(),
  },
) {}

export const ClientViewEntries = Schema.Record({
  key: Schema.String,
  value: Schema.Number,
})

export const ClientViewRecord = Schema.Record({
  key: Schema.String,
  value: ClientViewEntries,
})

export type ClientViewRecord = typeof ClientViewRecord.Type

export class SearchResult extends Schema.Class<SearchResult>("SearchResult")({
  id: Schema.String,
  rowversion: DateTimeString,
}) {}

export const SearchResultsFromClientViewEntries = Schema.transform(
  ClientViewEntries,
  Schema.Array(SearchResult),
  {
    strict: true,
    // Maybe there's a better way without double loop?
    decode: entries =>
      pipe(Record.toEntries(entries), a =>
        a.map(([id, rowversion]) => ({
          id,
          rowversion: new Date(rowversion).toISOString(),
        })),
      ),
    encode: result => {
      console.log({ result })
      return pipe(
        result.map(
          ({ id, rowversion }) => [id, new Date(rowversion).getTime()] as const,
        ),
        Record.fromEntries,
      )
    },
  },
)

export const ClientViewRecordDiff = Schema.Record({
  key: Schema.String,
  value: Schema.Struct({
    puts: Schema.Array(Schema.String.pipe(Schema.mutable)).pipe(Schema.mutable),
    dels: Schema.Array(Schema.String.pipe(Schema.mutable)).pipe(Schema.mutable),
  }),
}).pipe(Schema.mutable)

export type ClientViewRecordDiff = typeof ClientViewRecordDiff.Type

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
  cookie: Schema.OptionFromNullishOr(Cookie, null),
}) {}

export const PatchOperation = Schema.Union(
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
export type PatchOperation = typeof PatchOperation.Type

export class PullResponse extends Schema.Class<PullResponse>("PullResponse")({
  cookie: Schema.NullishOr(Cookie),
  lastMutationIDChanges: Schema.Record({
    key: Schema.String,
    value: Schema.Number,
  }),
  patch: Schema.Array(PatchOperation),
}) {}

export class FutureMutationError extends Schema.TaggedError<FutureMutationError>()(
  "FutureMutationError",
  {},
) {}
