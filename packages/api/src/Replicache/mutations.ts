import * as S from "@effect/schema/Schema"
import { Effect } from "effect"
import type * as EffectRequest from "effect/Request"
import type { Pipeable } from "effect"
import type { Serializable } from "@effect/schema"

export class EntryCreate extends S.TaggedRequest<EntryCreate>()("EntryCreate", {
  failure: S.String,
  success: S.Void,
  payload: {
    url: S.String,
  },
}) {}

const x = new EntryCreate({ url: "" })

const a = EntryCreate.make({ url: "" })

type A<Req extends S.TaggedRequest.All> = Req

type B = A<EntryCreate>

const e = <Req extends S.TaggedRequest.All, R>(
  schema: S.Schema<Req, any, unknown>,
) => ({ schema })

const c = e(EntryCreate)

type D = EntryCreate["_tag"]

export const makeReplicacheServer = <Req extends S.TaggedRequest.All, R>(
  schema: S.Schema<Req, any, unknown>,
) => ({ schema })

interface Proto<Req extends S.TaggedRequest.All> {
  readonly [TypeId]: TypeId
  readonly _tag: string
  readonly schema: S.Schema<Req, any, unknown>
}

interface RepMEffect<Req extends S.TaggedRequest.All, R> extends Proto<Req> {
  // readonly make: (req: Req) => Effect.Effect<R, never, never>;
  // readonly _tag: "Replicache"
  readonly handler: (
    request: Req,
  ) => Effect.Effect<
    EffectRequest.Request.Success<Req>,
    EffectRequest.Request.Error<Req>,
    R
  >
}

type Test = RepMEffect<EntryCreate, void>

export type Request<A extends RepMEffect<any, any>> = S.Schema.Type<A["schema"]>

const TypeId: unique symbol = Symbol.for("RepMEffect")
type TypeId = typeof TypeId

// const effect = RepMEffect.make(EntryCreate)
const effect = <Req extends S.TaggedRequest.All, R>(
  schema: S.Schema<Req, any, unknown>,
  handler: (
    request: Req,
  ) => Effect.Effect<
    EffectRequest.Request.Success<Req>,
    EffectRequest.Request.Error<Req>,
    R
  >,
): RepMEffect<Req, R> => ({
  [TypeId]: TypeId,
  _tag: "Replicache",
  schema,
  handler,
})

const ServerTypeId: unique symbol = Symbol.for("ReplicacheServer")
type ServerTypeId = typeof ServerTypeId

interface RServer<Reqs extends S.TaggedRequest.All, R> {
  readonly [ServerTypeId]: ServerTypeId
  readonly mutations: ReadonlySet<RepMEffect<Reqs, R>>
}

export type Context<A extends RepMEffect<any, any>> =
  A extends RepMEffect<infer Req, infer R>
    ? R | Serializable.SerializableWithResult.Context<Req>
    : never

const make = <EffectMutations extends ReadonlyArray<RepMEffect<any, any>>>(
  ...mutations: EffectMutations
): RServer<
  Request<Extract<EffectMutations[number], { readonly [TypeId]: TypeId }>>,
  Context<Extract<EffectMutations[number], { readonly [TypeId]: TypeId }>>
> => {
  type M = Request<
    Extract<EffectMutations[number], { readonly [TypeId]: TypeId }>
  >
  const set = new Set<RepMEffect<any, any>>(mutations)
  return {
    [ServerTypeId]: ServerTypeId,
    mutations: set,
  }
}

const server = make(effect(EntryCreate, req => Effect.succeed(req)))

type Server = typeof server

type ServerMutations = ReturnType<Server["mutations"]["values"]>

const makeClient = <Server extends RServer<any, any>>(server: Server) => {
  const mutations = server.mutations.forEach(mutation => {
    mutation.schema.Encoded
  })
}

// make(EntryCreate)
// desired api like RPC:
// R.make(EntryCreate, () => Effect)
// Extract type
// then on client Client.make<Type>(... tx write transaction, arg with arg shape). I think this probably shouldn't be Effect-ful, maybe so, but replicache obviously isn't. Maybe would need another wrapper around it.
