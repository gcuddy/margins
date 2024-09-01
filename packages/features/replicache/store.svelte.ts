/* eslint @typescript-eslint/no-explicit-any: 0 */
import type { ReadTransaction, Replicache, WriteTransaction } from "replicache"
import { reconcile, unwrap } from "solid-js/store"
import { onDestroy } from "svelte"

type PathResolver = (...args: any) => Array<string>
// inspired heavily from https://github.com/sst/console/blob/eabe19c08188d20ab0dadf4c8059250423034ac8/packages/web/workspace/src/data/store.ts

export class Store<
  Get extends PathResolver = never,
  Scanners extends Record<string, PathResolver> = Record<string, any>,
  Item = never,
> {
  #get?: PathResolver = undefined
  #scanners: Record<string, PathResolver> = {}

  public $type<Type>() {
    return this as any as Store<Get, Scanners, Type>
  }

  public scan<Name extends string, Resolver extends PathResolver>(
    name: Name,
    resolver: Resolver,
  ) {
    this.#scanners[name] = resolver
    return this as Store<Get, Scanners & { [name in Name]: Resolver }, Item>
  }

  public get<Resolver extends PathResolver>(resolver: Resolver) {
    this.#get = resolver
    return this as any as Store<Resolver, Scanners, Item>
  }

  public build() {
    const result: Record<string, any> = {}

    for (const [name, resolver] of Object.entries(this.#scanners)) {
      result[name] = (tx: ReadTransaction, ...args: any[]) => {
        return tx
          .scan({
            prefix: "/" + resolver(...args).join("/"),
          })
          .values()
          .toArray()
      }

      result[name].watch = (
        rep: () => Replicache,
        args: () => any[],
        refiner?: (items: Item[]) => any,
      ) => {
        return createScan(
          () => "/" + resolver(...args()).join("/"),
          rep,
          refiner,
        )
      }
    }

    result.get = (tx: ReadTransaction, ...args: any[]) => {
      return tx.get("/" + this.#get!(...args).join("/"))
    }

    result.get.watch = (rep: () => Replicache, args: () => any[]) => {
      // console.log('watch', { rep }, { args });
      return createGet(() => "/" + this.#get!(...args()).join("/"), rep)
    }

    result.update = async (
      tx: WriteTransaction,
      id: string,
      updater: (input: any) => any,
    ) => {
      const [item] = await tx
        .scan({
          indexName: "id",
          start: {
            key: [id],
          },
        })
        .entries()
        .toArray()
      if (!item) throw new Error("Item not found")
      const [[, pk], rawValue] = item
      const value = structuredClone(rawValue)
      // console.log('update', tx, id, updater, value);

      if (!value) throw new Error("Item not found")
      const newValue = updater(value as any)

      // console.log('set', pk, newValue);
      await tx.set(pk, newValue)
    }

    result.remove = async (tx: WriteTransaction, id: string) => {
      const [item] = await tx
        .scan({
          indexName: "id",
          start: {
            key: [id],
          },
        })
        .entries()
        .toArray()

      if (!item) throw new Error("Item not found")
      const [[, pk]] = item
      // const value = structuredClone(rawValue)
      if (!pk) throw new Error("Item not found")
      await tx.del(pk)
    }

    result.put = async (tx: WriteTransaction, args: any[], item: Item) => {
      // console.log('put', tx, args, item);
      await tx.set("/" + this.#get!(...args).join("/"), item as any)
    }

    return result as {
      [name in keyof Scanners]: ((
        tx: ReadTransaction,
        ...args: Parameters<Scanners[name]>
      ) => Promise<Item[]>) & {
        watch: {
          (
            rep: () => Replicache,
            args: () => Parameters<Scanners[name]>,
          ): ReturnType<typeof createScan<Item>>
          <Refiner extends (items: Item[]) => any | undefined>(
            rep: () => Replicache,
            args: () => Parameters<Scanners[name]>,
            refine?: Refiner,
          ): {
            data: ReturnType<Refiner>
            ready: boolean
          }
        }
      }
    } & {
      get: ((
        tx: ReadTransaction,
        ...args: Parameters<Get>
      ) => Promise<Item>) & {
        watch: (
          rep: () => Replicache,
          args: () => Parameters<Get>,
        ) => ReturnType<typeof createGet<Item>>
      }
      put: (
        tx: WriteTransaction,
        args: Parameters<Get>,
        item: Partial<Item>,
      ) => Promise<void>
      remove: (tx: WriteTransaction, id: string) => Promise<void>
      update: (
        tx: WriteTransaction,
        id: string,
        updator: (item: Item) => Item,
      ) => Promise<void>
    }
  }
}

export function createGet<T>(p: () => string, replicache: () => Replicache) {
  let unsubscribe: () => void

  //   const store = writable<T | undefined>(undefined)
  const data = $state({
    value: undefined as T | undefined,
  })
  let ready = $state(false)

  $effect(() => {
    if (unsubscribe) unsubscribe()
    const path = p()

    data.value = undefined
    ready = false

    const rep = replicache()

    unsubscribe = rep.experimentalWatch(
      diffs => {
        for (const diff of diffs) {
          if (diff.op === "add") {
            data.value = structuredClone(diff.newValue) as T
          }
          if (diff.op === "change") {
            // TODO: don't use solidjs here...
            data.value = reconcile(structuredClone(diff.newValue) as T)(
              data.value,
            )
          }
          if (diff.op === "del") data.value = undefined
        }
        ready = true
      },
      {
        initialValuesInFirstDiff: true,
        prefix: path,
      },
    )
  })

  onDestroy(() => {
    if (unsubscribe) unsubscribe()
  })

  return {
    get data() {
      return data.value
    },
    get ready() {
      return ready
    },
  } as
    | {
        data: undefined
        ready: false
      }
    | {
        data: T
        ready: true
      }
}

export function createScan<T>(
  p: () => string,
  replicache: () => Replicache,
  refine?: (values: T[]) => T[],
) {
  let unsubscribe: () => void

  let data = $state<T[]>([])
  let ready = $state(false)

  const keyToIndex = new Map<string, number>()
  const indexToKey = new Map<number, string>()

  $effect(() => {
    if (unsubscribe) unsubscribe()
    const path = p()
    const rep = replicache()

    // ready = false
    // data = []

    unsubscribe = rep.experimentalWatch(
      diffs => {
        console.log("diffs", diffs)
        // fast set if we haven't seen diffs
        if (!ready) {
          console.log("if - not ready yet")
          const values: T[] = []
          for (const diff of diffs) {
            if (diff.op === "add") {
              const value = structuredClone(diff.newValue) as T
              const index = values.push(value)
              keyToIndex.set(diff.key, index - 1)
              indexToKey.set(index - 1, diff.key)
            }
          }
          ready = true
          data = values
        } else {
          console.log("else - updating")
          for (const diff of diffs) {
            if (diff.op === "add") {
              const index = data.push(structuredClone(diff.newValue) as T)
              keyToIndex.set(diff.key, index - 1)
              indexToKey.set(index - 1, diff.key)
            } else if (diff.op === "change") {
              const index = keyToIndex.get(diff.key)
              // TODO: fine grained reconcile for faster performance
              data[keyToIndex.get(diff.key)!] = reconcile(
                structuredClone(diff.newValue) as T,
              )(unwrap(data[keyToIndex.get(diff.key)!]) as T)
            } else if (diff.op === "del") {
              const toRemove = keyToIndex.get(diff.key)!
              const last = data.at(-1)
              const lastKey = indexToKey.get(data.length - 1)!

              data[toRemove] = last as T
              keyToIndex.delete(diff.key)
              indexToKey.delete(toRemove)

              keyToIndex.set(lastKey, toRemove)
              indexToKey.set(toRemove, lastKey)
              indexToKey.delete(data.length - 1)

              data.pop()
            }
          }
        }
      },
      {
        initialValuesInFirstDiff: true,
        prefix: path,
      },
    )
  })

  onDestroy(() => {
    if (unsubscribe) unsubscribe()
  })

  return {
    get data() {
      return refine ? refine(data) : data
    },
    get ready() {
      return ready
    },
  } as
    | {
        data: undefined
        ready: false
      }
    | {
        data: T[]
        ready: true
      }
}
