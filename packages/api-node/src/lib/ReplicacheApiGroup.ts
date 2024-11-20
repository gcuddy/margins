/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-namespace */
import { pipeArguments, type Pipeable, Record } from "effect"
import type * as ReplicacheApiMutation from "./ReplicacheApiMutation.js"

export const TypeId: unique symbol = Symbol.for("@margins/replicache/ApiGroup")

/**
 * @since 1.0.0
 * @category type ids
 */
export type TypeId = typeof TypeId

export interface ReplicacheApiGroup<
  out Id extends string,
  Mutations extends ReplicacheApiMutation.ReplicacheApiMutation.Any = never,
> extends Pipeable.Pipeable {
  new (_: never): object
  readonly [TypeId]: TypeId
  readonly identifier: Id
  readonly mutations: Record.ReadonlyRecord<string, Mutations>

  /**
   * Adds a mutation
   * */
  add<A extends ReplicacheApiMutation.ReplicacheApiMutation.Any>(
    mutation: A,
  ): ReplicacheApiGroup<Id, Mutations | A>
}

export interface ApiGroup<Name extends string> {
  readonly _: unique symbol
  readonly name: Name
}

export declare namespace ReplicacheApiGroup {
  export interface Any {
    readonly [TypeId]: TypeId
    readonly identifier: string
  }

  export type AnyWithProps = ReplicacheApiGroup<
    string,
    ReplicacheApiMutation.ReplicacheApiMutation.AnyWithProps
  >
}

const Proto = {
  [TypeId]: TypeId,
  pipe() {
    return pipeArguments(this, arguments)
  },
  add<A extends ReplicacheApiMutation.ReplicacheApiMutation.AnyWithProps>(
    this: ReplicacheApiGroup.AnyWithProps,
    mutation: A,
  ) {
    return makeProto({
      identifier: this.identifier,
      mutations: Record.set(this.mutations, mutation.name, mutation),
    })
  },
}

const makeProto = <
  Id extends string,
  Mutations extends ReplicacheApiMutation.ReplicacheApiMutation.Any,
>(options: {
  readonly identifier: Id
  readonly mutations: Record.ReadonlyRecord<string, Mutations>
}): ReplicacheApiGroup<Id, Mutations> => {
  function ReplicacheApiGroup() {}
  Object.setPrototypeOf(ReplicacheApiGroup, Proto)
  return Object.assign(ReplicacheApiGroup, options) as any
}

/**
 * A `ReplicacheApiGroup` is a collection of `ReplicacheApiMutation`s. You can use an `ReplicacheApiGroup` to
 * represent a portion of Replicache mutations.
 *
 * The mutations can be implemented later using the `ReplicacheApiBuilder.group` api.
 *
 * @since 1.0.0
 * @category constructors
 */
export const make = <const Id extends string>(
  identifier: Id,
): ReplicacheApiGroup<Id> =>
  makeProto({
    identifier,
    mutations: Record.empty(),
  })
