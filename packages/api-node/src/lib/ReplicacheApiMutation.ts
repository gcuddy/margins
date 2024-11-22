/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-namespace */

import type { Pipeable, Schema } from "effect"
import type { Effect } from "effect/Effect"
import { Success } from "effect/Exit"
import { pipeArguments } from "effect/Pipeable"
import type * as Types from "effect/Types"

export const TypeId: unique symbol = Symbol.for(
  "@effect/replicache/ApiMutation",
)

export type TypeId = typeof TypeId

export interface ReplicacheApiMutation<
  Name extends string,
  S extends Schema.Schema.Any,
> extends Pipeable.Pipeable {
  readonly [TypeId]: TypeId
  readonly name: Name
  readonly schema: S
}

export declare namespace ReplicacheApiMutation {
  export interface Any extends Pipeable.Pipeable {
    readonly [TypeId]: TypeId
    readonly name: string
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface AnyWithProps
    extends ReplicacheApiMutation<string, Schema.Schema.Any> { }

  /**
   * @since 1.0.0
   * @category models
   */
  export type Handler<Mutation extends Any, E, R> = (
    request: Mutation,
  ) => Effect<void, E, R>

  export type Name<Mutation> =
    Mutation extends ReplicacheApiMutation<infer Name, infer _S> ? Name : never

  /**
   * @since 1.0.0
   * @category models
   */
  export type WithName<Endpoints extends Any, Name extends string> = Extract<
    Endpoints,
    { readonly name: Name }
  >

  /**
   * @since 1.0.0
   * @category models
   */
  export type ExcludeName<Endpoints extends Any, Name extends string> = Exclude<
    Endpoints,
    { readonly name: Name }
  >

  /**
   * @since 1.0.0
   * @category models
   */
  export type HandlerWithName<
    Endpoints extends Any,
    Name extends string,
    E,
    R,
  > = Handler<WithName<Endpoints, Name>, E, R>
}

const Proto = {
  [TypeId]: TypeId,
  pipe() {
    return pipeArguments(this, arguments)
  },
}

const makeProto = <Name extends string, S extends Schema.Schema.Any>(options: {
  readonly name: Name
  readonly schema: S
}): ReplicacheApiMutation<Name, S> =>
  Object.assign(Object.create(Proto), options)

export const make = <
  const Name extends string,
  const S extends Schema.Schema.Any,
>(
  name: Name,
  schema: S,
): ReplicacheApiMutation<Name, S> => makeProto({ name, schema })
