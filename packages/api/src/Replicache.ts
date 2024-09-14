import {
  Chunk,
  Effect,
  HashSet,
  Layer,
  Logger,
  LogLevel,
  Option,
  pipe,
  Record,
} from "effect"
import { Schema } from "@effect/schema"
import { SqlClient, SqlSchema } from "@effect/sql"
import { CurrentUser } from "./Domain/User.js"
import type { ReplicacheClientId, PatchOperation ,
  ClientViewRecordDiff} from "./Domain/Replicache.js"
import {
  Mutation,
  ReplicacheClient,
  ReplicacheClientGroup,
  type PushRequest,
  type PullRequest,
  type ReplicacheClientGroupId,
  ClientViewRecord,
  SearchResultsFromClientViewEntries,
  ClientViewEntries,
  Cookie,
  ClientViewRecordId,
} from "./Domain/Replicache.js"
import { ReplicacheClientGroupRepo } from "./Replicache/ClientGroupRepo.js"
import { ReplicacheClientRepo } from "./Replicache/ClientRepo.js"
import { SqlLive } from "./Sql.js"
import { server } from "./Replicache/mutations2.js"
import { CVRCache } from "./Replicache/ClientViewRecord.js"
import { EntriesRepo } from "./Entries/Repo.js"
import type { Entry } from "./Domain/Entry.js"
import { EntryId } from "./Domain/Entry.js"
import { Unauthorized } from "./Domain/Actor.js"
import { Nanoid } from "./Nanoid.js"

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient
  const clientGroupRepo = yield* ReplicacheClientGroupRepo
  const clientRepo = yield* ReplicacheClientRepo
  const cvrCache = yield* CVRCache
  const { id: userId } = yield* CurrentUser
  const entriesRepo = yield* EntriesRepo
  const nanoid = yield* Nanoid

  // TODO: should these be here? or in the repo?
  const getClientGroup = (clientGroupID: ReplicacheClientGroupId) =>
    pipe(
      clientGroupRepo.findById(clientGroupID),
      // TODO: use policy can read?
      Effect.flatMap(
        Option.match({
          // TODO:!!!
          onNone: () =>
            Effect.succeed(
              ReplicacheClientGroup.insert.make({
                cvrVersion: 0,
                userId,
                id: clientGroupID,
              }),
            ),
          onSome: clientGroup =>
            clientGroup.userId === userId
              ? Effect.succeed(clientGroup)
              : Effect.fail(
                  new Unauthorized({
                    actorId: userId,
                    entity: "ReplicacheClientGroup",
                    action: "read",
                  }),
                ),
        }),
      ),
      // Effect.orDie
      Effect.withSpan("Replicache.getClientGroup", {
        attributes: { userId, clientGroupID },
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
                  new Unauthorized({
                    actorId: userId,
                    entity: "ReplicacheClient",
                    action: "read",
                  }),
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
          sql`insert into replicache_client_group ${sql.insert(clientGroup)} on duplicate key update userId = ${clientGroup.userId}, cvrVersion = ${clientGroup.cvrVersion}, updatedAt = now()`,
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
          sql`insert into replicache_client ${sql.insert(client)} on duplicate key update lastMutationId = ${client.lastMutationID}, lastModified = now(), updatedAt = now()`,
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
        yield* new FutureMutationError({ mutation })
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
          onNone: () => Effect.succeed(Option.none<ClientViewRecord>()),
        }),
      )

      // TODO
      const baseCVR = Option.match(prevCvr, {
        onSome: cvr => cvr,
        onNone: () => ClientViewRecord.make({}),
      })

      // now do all this with a transaction

      // TODO: more effect-y!
      const data = yield* Effect.gen(function* () {
        console.log({ clientGroupID, userId })
        const baseClientGroup = yield* getClientGroup(clientGroupID)

        console.log({ baseClientGroup })

        // Get relevant data

        // 6. Read all id/version pairs from the database that should be in the client view.
        // TODO: more stuff here
        const [entryMeta, clientMeta] = yield* Effect.all(
          [
            entriesRepo.searchForUserId(userId),
            // 7: Read all clients in CG
            clientRepo.searchForClientGroup(clientGroupID),
          ],
          {
            concurrency: "unbounded",
          },
        ).pipe(Logger.withMinimumLogLevel(LogLevel.Debug))

        // 6: Read all domain data, just ids and versions
        // const entryIds = entryMeta.map(e => e.id)
        // const [todoMeta, shareMeta] = await Promise.all([
        //   searchTodos(executor, { listIDs }),
        //   searchShares(executor, { listIDs }),
        // ])
        // console.log({ todoMetsa, shareMeta })
        console.log({ entryMeta, clientMeta })

        const encode = Schema.encode(SearchResultsFromClientViewEntries)

        // 8: Build nextCVR
        // TODO: have Specific type for ClientViewRecord with keys?
        const nextCVR = ClientViewRecord.make({
          entries: yield* encode(entryMeta),
          client: yield* encode(clientMeta),
        })

        console.log({ nextCVR })

        // 9: calculate diffs
        // const diff = diffCVR(baseCVR, nextCVR)
        // should this fn be elsewhere? ah well
        const diff = yield* Effect.gen(function* () {
          // Diff baseCvr with nextCvr
          // TODO: make pipe-y

          // First we'll do it the non efffect y way
          const r: ClientViewRecordDiff = {}
          const chunk = Chunk.appendAll(
            Chunk.fromIterable(Record.keys(baseCVR)),
            Chunk.fromIterable(Record.keys(nextCVR)),
          )
          HashSet.fromIterable(chunk).pipe(
            HashSet.forEach(name => {
              const prevEntries = Record.get(baseCVR, name).pipe(
                Option.getOrElse(() => ClientViewEntries.make({})),
              )
              const nextEntries = Record.get(nextCVR, name).pipe(
                Option.getOrElse(() => ClientViewEntries.make({})),
              )

              console.log({ name, prevEntries, nextEntries })
              const puts = Record.keys(nextEntries).filter(id => {
                const test =
                  !Record.has(prevEntries, id) ||
                  Option.all([
                    Record.get(prevEntries, id),
                    Record.get(nextEntries, id),
                  ]).pipe(
                    Option.match({
                      onSome: ([prev, next]) => prev < next,
                      onNone: () => false,
                    }),
                  )
                console.log({ id, test })
                return test
              })

              console.log({ puts })
              const val = {
                puts,
                dels: Record.keys(prevEntries).filter(
                  id => !Record.has(nextEntries, id),
                ),
              }

              console.log(`setting ${name} to`, val)

              r[name] = val
              console.log({ r })
            }),
          )
          return r
        })

        console.log({ diff })

        // 10: If diff is empty, return no-op PR
        if (
          Option.isSome(prevCvr) &&
          Record.values(diff).every(
            e => e.puts.length === 0 && e.dels.length === 0,
          )
        ) {
          // TODO
          return null
        }

        // 11 get entities TODO here
        // const [entries] = yield* Effect.all([
        //   entriesRepo.getForIds((diff.entries?.puts ?? []) as EntryId[]),
        // ])
        // TODO: clean up this
        const entryIdsSchema = Schema.NonEmptyArray(EntryId)
        const decode = Schema.decodeUnknownOption(entryIdsSchema)
        const entries = yield* decode(diff.entries?.puts).pipe(
          Option.match({
            onSome: ids => entriesRepo.getForIds(ids),
            // hmmm
            onNone: () => Effect.succeed([] as readonly Entry[]),
          }),
          // Option.getOrElse(() => []),
        )

        // 12: changed clients - no need to re-read clients from database,
        // we already have their versions.
        const clients = ClientViewEntries.make({})
        for (const clientID of diff.client?.puts ?? []) {
          if (nextCVR.client) {
            Record.set(clients, clientID, Record.get(nextCVR.client, clientID))
          }
        }
        console.log({ clients })

        // 13: newCVRVersion
        const baseCVRVersion = pullRequest.cookie?.order ?? 0
        const nextCVRVersion =
          Math.max(baseCVRVersion, baseClientGroup.cvrVersion) + 1

        // 14: Write ClientGroupRecord
        const nextClientGroupRecord = {
          ...baseClientGroup,
          cvrVersion: nextCVRVersion,
        }
        console.log({ nextClientGroupRecord })
        yield* putClientGroup(
          ReplicacheClientGroup.insert.make(nextClientGroupRecord),
        )

        return {
          entities: {
            entries: {
              dels: diff.entries?.dels,
              puts: entries,
            },
          },
          clients,
          nextCVR,
          nextCVRVersion,
        } as const
        // console.log({ diff })
      }).pipe(sql.withTransaction)

      // 10: If diff is empty, return no-op PR
      if (data === null) {
        return {
          cookie: pullRequest.cookie,
          lastMutationIDChanges: {},
          patch: [],
        }
      }

      const { entities, clients, nextCVR, nextCVRVersion } = data

      // 16-17: store cvr
      const cvrID = yield* nanoid.generate
      cvrCache.set(cvrID, nextCVR)

      // TODO: effect-ify
      // 18(i): build patch
      const patch: PatchOperation[] = []
      if (Option.isNone(prevCvr)) {
        patch.push({ op: "clear" })
      }

      console.log({ entities })

      for (const [name, { puts, dels }] of Record.toEntries(entities)) {
        for (const id of dels ?? []) {
          patch.push({ op: "del", key: `${name}/${id}` })
        }
        for (const entity of puts ?? []) {
          patch.push({
            op: "put",
            key: `${name}/${entity.id}`,
            value: entity,
          })
        }
      }

      // 18(ii): construct cookie
      const cookie = Cookie.make({
        order: nextCVRVersion,
        cvrID: ClientViewRecordId.make(cvrID),
      })

      // 17(iii): lastMutationIDChanges
      const lastMutationIDChanges = clients

      return {
        cookie,
        lastMutationIDChanges,
        patch,
      }
    })

  return {
    push,
    pull,
  } as const
})

export class FutureMutationError extends Schema.TaggedError<FutureMutationError>()(
  "FutureMutationError",
  {
    mutation: Mutation,
  },
) {
  get message() {
    return `Mutation ${this.mutation.id} is from the future - aborting`
  }
}

export class Replicache extends Effect.Tag("Replicache")<
  Replicache,
  Effect.Effect.Success<typeof make>
>() {
  static readonly Live = Layer.scoped(this, make).pipe(
    Layer.provide(SqlLive),
    Layer.provide(CVRCache.Live),
    Layer.provide(ReplicacheClientGroupRepo.Live),
    Layer.provide(ReplicacheClientRepo.Live),
    Layer.provide(EntriesRepo.Live),
    Layer.provide(Nanoid.Live),
  )
}
