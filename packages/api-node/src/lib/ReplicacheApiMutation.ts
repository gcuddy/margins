/* eslint-disable @typescript-eslint/no-namespace */

import type { Pipeable, Schema } from "effect";

export const TypeId: unique symbol = Symbol.for("@effect/replicache/ApiMutation")

export type TypeId = typeof TypeId

export interface ReplicacheApiMutation<
  out Name extends string,
  out S extends Schema.Schema.Any
> extends Pipeable.Pipeable {
  readonly [TypeId]: TypeId
  readonly name: Name
  readonly schema: S
}

export declare namespace ReplicacheApiMutation {
  export interface Any extends Pipeable.Pipeable {
    readonly [TypeId]: TypeId
    readonly name: string;
  }

  export interface AnyWithProps extends ReplicacheApiMutation<string, Schema.Schema.Any> { }
}
