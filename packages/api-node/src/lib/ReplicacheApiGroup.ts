/* eslint-disable @typescript-eslint/no-namespace */
import type { Pipeable, Record } from "effect"
import type * as ReplicacheApiMutation from "./ReplicacheApiMutation.js"

export const TypeId: unique symbol = Symbol.for("@margins/replicache/ApiGroup")

/**
 * @since 1.0.0
 * @category type ids
 */
export type TypeId = typeof TypeId


export interface ReplicacheApiGroup<
  out Id extends string,
  Mutations extends ReplicacheApiMutation.ReplicacheApiMutation.Any = never
> extends Pipeable.Pipeable {
  new(_: never): object
  readonly [TypeId]: TypeId
  readonly identifier: Id
  readonly mutations: Record.ReadonlyRecord<string, Mutations>


  /**
   * Adds a mutation
   * */
  add<A extends ReplicacheApiMutation.ReplicacheApiMutation.Any>(
    mutation: A
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

  export type AnyWithProps = ReplicacheApiGroup<string, ReplicacheApiMutation.ReplicacheApiMutation.AnyWithProps>

}
