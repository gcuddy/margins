// taken largely from https://github.dev/sst/console/blob/dev/packages/functions/src/replicache/pull1.ts

import type { WriteTransaction } from "replicache"
import { Schema } from "@effect/schema"
import { Effect } from "effect"
import { ParseError } from "@effect/schema/ParseResult"

interface Mutation<Name extends string = string, Input = any, Output = any> {
  input: Input
  name: Name
  output: Output
}

export class MutationError extends Schema.TaggedError<MutationError>()(
  "MutationError",
  {
    mutation: Schema.String,
    args: Schema.Any,
  },
) {}

export class MutationNotFoundError extends Schema.TaggedError<MutationNotFoundError>()(
  "MutationNotFoundError",
  {
    mutation: Schema.String,
  },
) {}

export class Server<Mutations extends Record<string, Mutation>> {
  private mutations = new Map<
    string,
    {
      fn: (input: any) => Effect.Effect<any, MutationError | ParseError, never>
      input: Schema.Schema.Any
    }
  >()

  // public mutation<
  //   Name extends string,
  //   Shape extends Schema.Schema.Any,
  //   Args = Schema.Schema.Type<Shape>,
  //   Output = void,
  // >(
  //   name: Name,
  //   shape: Shape,
  //   fn: (input: Args) => Promise<Output>,
  // ): Server<Mutations & { [key in Name]: Mutation<Name, Args, Output> }> {
  //   this.mutations.set(name as string, {
  //     fn: args =>
  //       Effect.gen(function* () {
  //         const parsed = yield* Schema.decodeUnknown(shape)(args)
  //         return yield* Effect.tryPromise({
  //           try: () => fn(parsed),
  //           catch: () => new MutationError({ mutation: name, args }),
  //         })
  //       }),
  //     input: shape,
  //   })
  //   return this
  // }

  //   TODO: Collect A, E, R for make
  public expose<
    Name extends string,
    Shape extends Schema.Schema.Any,
    Args = Schema.Schema.Type<Shape>,
    Output = any,
    Error = MutationError,
    Requirements = never,
  >(
    name: Name,
    mutation: MutationEffect<
      Schema.Schema.AnyNoContext,
      Output,
      Error,
      Requirements
    >,
  ): Server<
    Mutations & {
      [key in Name]: Effect.Effect<
        Output,
        Error extends never ? ParseError : Error | ParseError,
        Requirements
      >
    }
  > {
    this.mutations.set(name as string, {
      fn: args =>
        Effect.gen(function* () {
          const parsed = Schema.decodeUnknownOption(mutation.schema)(args)
          return yield* mutation
            .handler(parsed)
            .pipe(
              Effect.mapError(e =>
                e instanceof ParseError
                  ? e
                  : new MutationError({ mutation: name, args }),
              ),
            )
        }),
      input: mutation.schema,
    })
    return this
  }

  public execute(name: string, args: any) {
    const mut = this.mutations.get(name as string)
    return Effect.gen(function* () {
      yield* Effect.log("execute", name, args)
      if (!mut) return yield* new MutationNotFoundError({ mutation: name })
      return yield* mut.fn(args)
    })
  }

  //   TODO: not really how you do it in effect, but it's ok
  //   Extract Errors and Requirements
  // public makeEffect() {
  //   // return Effect.gen(function* () {
  //   //   return yield* Record.fromEntries(this.mutations.entries())
  //   // })
  //   const map = this.mutations
  //   return Effect.gen(function* () {
  //     const call = (name: string, args: unknown) =>
  //       Effect.gen(function* () {
  //         const mut = map.get(name as string)
  //         if (!mut) return yield* new MutationNotFoundError({ mutation: name })
  //         const parsed = yield* Schema.decodeUnknown(mut.input)(args)
  //         type X = Mutations["name"]["output"]
  //         return yield* mut?.fn(args)
  //       })
  //     return {
  //       call,
  //     } as const
  //   })
  //   // return Object.fromEntries(this.mutations.entries()) as any
  //   // return Record.fromEntries(this.mutations.entries())
  //   // return Effect.gen(function* () {
  //   //   return yield* this.mutations.map(({ fn }) => fn)
  //   // })
  // }

  public has(name: string) {
    return this.mutations.has(name)
  }
}

export type ExtractMutations<S extends Server<any>> =
  S extends Server<infer M> ? M : never

export class Client<
  S extends Server<any>,
  Mutations extends Record<string, Mutation> = ExtractMutations<S>,
> {
  private mutations = new Map<string, (...input: any) => Promise<void>>()

  public mutation<Name extends keyof Mutations>(
    name: Name,
    fn: (
      tx: WriteTransaction,
      input: Mutations[Name]["input"],
    ) => Promise<void>,
  ) {
    this.mutations.set(name as string, fn)
    return this
  }

  public build(): {
    [key in keyof Mutations]: (
      ctx: WriteTransaction,
      args: Mutations[key]["input"],
    ) => Promise<void>
  } {
    return Object.fromEntries(this.mutations.entries()) as any
  }
}

const MutationTypeId: unique symbol = Symbol.for("Replicache/Mutation")
type MutationTypeId = typeof MutationTypeId

interface Proto<S extends Schema.Schema.AnyNoContext> {
  readonly [MutationTypeId]: MutationTypeId
  readonly _tag: string
  readonly schema: S
}

interface MutationEffect<
  S extends Schema.Schema.AnyNoContext,
  A,
  E = never,
  R = never,
> extends Proto<S> {
  readonly _tag: "Replicache"
  readonly handler: (
    request: Schema.Schema.Type<S>,
  ) => Effect.Effect<A, E | ParseError, never>
}

// not in love with this — check other mutaitons.ts for a more interesting effecty way
// backend schema thingy
function schema<
  Schema extends Schema.Schema.AnyNoContext,
  A,
  E = never,
  R = never,
>(
  schema: Schema,
  //   TODO: extract requirements here and up in class / make it a `make` effect layer`
  handler: (
    input: Schema.Schema.Type<Schema>,
  ) => Effect.Effect<A, E | ParseError, never>,
): MutationEffect<Schema.Schema.AnyNoContext, A, E, R> {
  return {
    handler,
    schema,
    _tag: "Replicache",
    [MutationTypeId]: MutationTypeId,
  }
}

const Go = schema(Schema.String, input =>
  Effect.gen(function* () {
    // yield* Effect.fail('uh oh')
  }),
)

// I just wonder if there's a way to make this more effecty
export const server = new Server()
  .expose(
    "Go",
    Go,
    //   schema(Schema.String, input => Effect.succeed(input)),
  )
  .expose(
    "Hello",
    schema(Schema.Number, input => Effect.succeed(input)),
  )

// const d = server.makeEffect()

// d.Go

// server.make``

// what I really want this to be is yield* ReplicacheServer and then can use it with requirements

type ServerType = typeof server

// type Req = Effect.Effect.Context<>

// type Server = typeof server

// TODO: is there a way to just use RPC Router? Or use Tagged Requests? i.e. pass them in and go from there?
