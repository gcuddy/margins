// CVR, CVREntires, CVRCache etc (cvr cache maybe uses key value store)

import { Context, Effect } from "effect"
import {
  DurableObjectStorageLayer,
  makeSchemaStore,
  makeStorageLayer,
  StorageLayer,
} from "../DurableObject"
import type { ClientViewRecordId } from "../Domain/Replicache"
import { ClientViewRecord } from "../Domain/Replicache"

// TODO: expand these with schema, brands, classes, layers, etc.

export type CVREntries = Record<string, number>
export type CVR = Record<string, CVREntries>

// Could CVR Cache be stored on durable object? Or cloudflare kv? or what?
// For now just accept a KeyValueStore to use...

const make = Effect.gen(function* () {
  const storage = yield* StorageLayer
  const store = makeSchemaStore(storage, ClientViewRecord)
  //   Needs to be called in correct DO

  const get = (cvrID: ClientViewRecordId) => store.get(cvrID)
  const set = (cvrID: string, cvr: CVR) => store.set(cvrID, cvr)

  return { get, set } as const
})

export class CVRCache extends Context.Tag("Replicache/CVRCache")<
  CVRCache,
  Effect.Effect.Success<typeof make>
>() {}
