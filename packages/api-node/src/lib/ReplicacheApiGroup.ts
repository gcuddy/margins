/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-namespace */
import type { Schema } from "effect"
import { type Pipeable, Record } from "effect"
import type * as ReplicacheApiMutation from "./ReplicacheApiMutation.js"
import { pipeArguments } from "effect/Pipeable"
import type { ReplicacheApiError } from "./ReplicacheApiError.js"

export const TypeId: unique symbol = Symbol.for("@margins/replicache/ApiGroup")

/**
 * @since 1.0.0
 * @category type ids
 */
export type TypeId = typeof TypeId

export interface ReplicacheApiGroup<
  out Id extends string,
  Mutations extends ReplicacheApiMutation.ReplicacheApiMutation.Any = never,
  in out Error = ReplicacheApiError,
  out R = never,
> extends Pipeable.Pipeable {
  new (_: never): object
  readonly [TypeId]: TypeId
  readonly identifier: Id
  readonly mutations: Record.ReadonlyRecord<string, Mutations>
  readonly errorSchema: Schema.Schema<Error, unknown, R>

  /**
   * Adds a mutation
   * */
  add<A extends ReplicacheApiMutation.ReplicacheApiMutation.Any>(
    mutation: A,
  ): ReplicacheApiGroup<Id, Mutations | A, Error, R>
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

  export type WithName<Group, Name extends string> = Extract<
    Group,
    { readonly identifier: Name }
  >

  export type Name<Group> =
    Group extends ReplicacheApiGroup<infer _Id, infer _Mutations, infer _Error, infer _R> ? _Id : never

  export type Context<Group> =
    Group extends ReplicacheApiGroup<infer _Id, infer _Mutations, infer _Error, infer _R>
      ? _R
      : never

  export type Mutations<Group> =
    Group extends ReplicacheApiGroup<infer _Id, infer _Mutations, infer _Error, infer _R>
      ? _Mutations
      : never

  export type ToService<A> =
    A extends ReplicacheApiGroup<
      infer Name,
      infer _Mutations,
      infer _Error,
      infer _R
    >
      ? ApiGroup<Name>
      : never

  export type ErrorContext<Group> =
    Group extends ReplicacheApiGroup<
      infer _Name,
      infer _Mutations,
      infer _Error,
      infer _R
    >
      ? ReplicacheApiMutation.ReplicacheApiMutation.ErrorContext<_Mutations>
      : never

  export type ContextWithName<Group, Name extends string> = Context<
    WithName<Group, Name>
  >

  // export type Context<Group> = Group extends
  // ReplicacheApiGroup<infer _Name, infer _Mutations>

  // export type ContextWithName<Group extends Any, Name extends string> = Context<
  //   WithName<Group, Name>
  // >
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
