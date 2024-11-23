/* eslint-disable @typescript-eslint/no-namespace */
import type * as ReplicacheApiGroup from "./ReplicacheApiGroup.js"
import type * as ReplicacheApiMutation from "./ReplicacheApiMutation.js"
import * as ReplicacheApi from "./ReplicacheApi.js"
import type { Pipeable } from "effect/Pipeable"
import type { Covariant } from "effect/Types"
import type { Chunk } from "effect"
import { Effect, Layer } from "effect"

// TODO: replicache mutation router
//

export const api = <
  Groups extends ReplicacheApiGroup.ReplicacheApiGroup.Any,
  E,
  R,
>(
  api: ReplicacheApi.ReplicacheApi<Groups, E, R>,
): Layer.Layer<
  ReplicacheApi.Api,
  never,
  | ReplicacheApiGroup.ReplicacheApiGroup.ToService<Groups>
  | R
  | ReplicacheApiGroup.ReplicacheApiGroup.ErrorContext<Groups>
> =>
  Layer.effect(
    ReplicacheApi.Api,
    Effect.map(Effect.context(), context => ({ api: api as any, context })),
  )

export const HandlersTypeId: unique symbol = Symbol.for(
  "@margins/ReplicacheApiBuilder/Handlers",
)

/**
 * @since 1.0.0
 * @category handlers
 */
export type HandlersTypeId = typeof HandlersTypeId

export interface Handlers<
  E,
  R,
  Mutations extends ReplicacheApiMutation.ReplicacheApiMutation.Any = never,
> extends Pipeable {
  readonly [HandlersTypeId]: {
    _Mutations: Covariant<Mutations>
  }

  readonly group: ReplicacheApiGroup.ReplicacheApiGroup.AnyWithProps
  readonly handlers: Chunk.Chunk<Handlers.Item<E, R>>

  /**
   * Add the implementation for an `ReplicacheApiMutation` to a `Handlers` group.
   */

  handle<
    Name extends ReplicacheApiMutation.ReplicacheApiMutation.Name<Mutations>,
    R1,
  >(
    name: Name,
    handler: ReplicacheApiMutation.ReplicacheApiMutation.HandlerWithName<
      Mutations,
      Name,
      E,
      R1
    >,
  ): Handlers<
    E,
    R | R1,
    ReplicacheApiMutation.ReplicacheApiMutation.ExcludeName<Mutations, Name>
  >
}

export declare namespace Handlers {
  export interface Any {
    readonly [HandlersTypeId]: any
  }

  export type Item<E, R> = {
    readonly endpoint: ReplicacheApiMutation.ReplicacheApiMutation.Any
    readonly handler: ReplicacheApiMutation.ReplicacheApiMutation.Handler<
      any,
      E,
      R
    >
    readonly withFullResponse: boolean
  }

  export type FromGroup<
    ApiError,
    ApiR,
    Group extends ReplicacheApiGroup.ReplicacheApiGroup.Any,
  > = Handlers<
    ApiError,
    ApiR,
    ReplicacheApiGroup.ReplicacheApiGroup.Mutations<Group>
  >

  export type ValidateReturn<A> = A extends
    | Handlers<infer _E, infer _R, infer _Mutations>
    | Effect.Effect<
        Handlers<infer _E, infer _R, infer _Mutations>,
        infer _EX,
        infer _RX
      >
    ? [_Mutations] extends [never]
      ? A
      : `Endpoint not handled: ${ReplicacheApiMutation.ReplicacheApiMutation.Name<_Mutations>}`
    : `Must return the implemented handlers`

  export type Error<A> =
    A extends Effect.Effect<
      Handlers<infer _E, infer _R, infer _Mutations>,
      infer _EX,
      infer _RX
    >
      ? _EX
      : never

  export type Context<A> =
    A extends Handlers<infer _E, infer _R, infer _Mutations>
      ? _R
      : A extends Effect.Effect<
            Handlers<infer _E, infer _R, infer _Mutations>,
            infer _EX,
            infer _RX
          >
        ? _R | _RX
        : never
}

// prettier-ignore
export const group = <
  Group extends ReplicacheApiGroup.ReplicacheApiGroup.Any,
  ApiError,
  ApiR,
  const Name extends ReplicacheApiGroup.ReplicacheApiGroup.Name<Group>,
  Return,
>(
  api: ReplicacheApi.ReplicacheApi<Group, ApiError, ApiR>,
  groupName: Name,
  // mutations: Mutation,
  build: (
    handlers: Handlers.FromGroup<
      ApiError,
      ApiR,
      ReplicacheApiGroup.ReplicacheApiGroup.WithName<Group, Name>
    >,
  ) => Handlers.ValidateReturn<Return>,
): Layer.Layer<
  ReplicacheApiGroup.ApiGroup<Name>,
  Handlers.Error<Return>,
  Handlers.Context<Return>
  | ReplicacheApiGroup.ReplicacheApiGroup.ContextWithName<Group, Name>
> => {
  const group = api.groups[groupName]!

  console.log({ group })
  return group as any
}
