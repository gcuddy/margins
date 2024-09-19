// CVR, CVREntires, CVRCache etc (cvr cache maybe uses key value store)

import type { Option } from "effect"
import { Context, Effect, Layer } from "effect"
import type { DurableObjectError } from "../DurableObject.js"
import { makeSchemaStore, StorageLayer } from "../DurableObject.js"
import type { ClientViewRecordId } from "../Domain/Replicache.js"
import { ClientViewRecord } from "../Domain/Replicache.js"
import type { ParseError } from "@effect/schema/ParseResult"
import { KeyValueStore } from "@effect/platform"

// TODO: expand these with schema, brands, classes, layers, etc.

export type CVREntries = Record<string, number>
export type CVR = Record<string, CVREntries>

// Could CVR Cache be stored on durable object? Or cloudflare kv? or what?
// For now just accept a KeyValueStore to use...

const make = Effect.gen(function* () {
  const storage = yield * KeyValueStore.KeyValueStore
  const store = storage.forSchema(ClientViewRecord)
  //   Needs to be called in correct DO

  const get = (cvrID: ClientViewRecordId) => store.get(cvrID)
  const set = (cvrID: string, cvr: CVR) => store.set(cvrID, cvr)

  // return {}
  return {
    get,
    set,
  } as const
})

export class CVRCache extends Effect.Tag("Replicache/CVRCache")<
  CVRCache,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(this, make).pipe(
    //  eventually maybe make this storage?
    Layer.provide(KeyValueStore.layerMemory),
  )
}
