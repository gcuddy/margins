/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-namespace */

import type { Pipeable, Schema } from "effect"
import { pipeArguments } from "effect/Pipeable"

export const TypeId: unique symbol = Symbol.for(
  "@effect/replicache/ApiMutation",
)

export type TypeId = typeof TypeId

export interface ReplicacheApiMutation<
  out Name extends string,
  out S extends Schema.Schema.Any,
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
    extends ReplicacheApiMutation<string, Schema.Schema.Any> {}
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
): ReplicacheApiMutation.AnyWithProps => makeProto({ name, schema })
