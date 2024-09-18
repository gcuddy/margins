import { Schema } from "@effect/schema"
import { Context, Data, Effect, Layer, Option } from "effect"

export class DurableObjectStateLayer extends Context.Tag(
  "core/DurableObjectState",
)<DurableObjectStateLayer, DurableObjectState>() {
  static Live = (state: DurableObjectState) => Layer.succeed(this, state)
}

// TODO: wrap with Effect
export class DurableObjectStorageLayer extends Context.Tag(
  "core/DurableObjectStorage",
)<DurableObjectStorageLayer, DurableObjectStorage>() {
  static Live = (storage: DurableObjectStorage) => Layer.succeed(this, storage)
}

export class DurableObjectError extends Data.TaggedError("DurableObjectError")<{
  action: string
}> {}

interface IStorageLayer {
  readonly get: (
    key: string,
  ) => Effect.Effect<Option.Option<unknown>, DurableObjectError>
  readonly set: (
    key: string,
    value: unknown,
  ) => Effect.Effect<void, DurableObjectError>

  readonly forSchema: <A, I, R>(
    schema: Schema.Schema<A, I, R>,
  ) => SchemaStore<A, I, R>
}

export const makeStorageLayer = Effect.gen(function* () {
  const storage_ = yield* DurableObjectStorageLayer

  const get = <T = unknown>(key: string, options?: DurableObjectGetOptions) =>
    Effect.tryPromise({
      try: () => storage_.get<T>(key, options),
      catch: () =>
        new DurableObjectError({
          action: "get",
        }),
    }).pipe(
      Effect.map(Option.fromNullable),
      Effect.withLogSpan("DurableObjectStorage.get"),
    )

  const set = <T>(key: string, value: T, options?: DurableObjectPutOptions) =>
    Effect.tryPromise({
      try: () => storage_.put(key, value, options),
      catch: () =>
        new DurableObjectError({
          action: "set",
        }),
    }).pipe(Effect.withLogSpan("DurableObjectStorage.set"))

  // function forSchema<A, I, R>(schema: Schema.Schema<A, I, R>) {
  //   return makeSchemaStore(this, schema)
  // }

  return {
    get,
    set,
  } as const
})

export class StorageLayer extends Effect.Tag("core/Storage")<
  StorageLayer,
  Effect.Effect.Success<typeof makeStorageLayer>
>() {
  static Live = Layer.effect(this, makeStorageLayer)
}

type Storage = Effect.Effect.Success<typeof makeStorageLayer>

export const makeSchemaStore = <A, I, R>(
  store: Storage,
  schema: Schema.Schema<A, I, R>,
) => {
  const parse = Schema.decodeUnknown(schema)
  const encode = Schema.encode(schema)

  const get = (key: string) =>
    Effect.flatMap(
      store.get(key),
      Option.match({
        onNone: () => Effect.succeedNone,
        onSome: value => Effect.asSome(parse(value)),
      }),
    )

  const set = (key: string, value: A) =>
    Effect.flatMap(encode(value), encoded => store.set(key, encoded))

  return {
    get,
    set,
  } as const
}

type SchemaStore<A, I, R> = ReturnType<typeof makeSchemaStore<A, I, R>>
