/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import { Effect, Schema, Record, Context } from "effect"

import type * as ReplicacheApiGroup from "./ReplicacheApiGroup.js"
import { pipeArguments, type Pipeable } from "effect/Pipeable"

export const TypeId: unique symbol = Symbol.for("@margins/replicache/Api")

export type TypeId = typeof TypeId

export interface ReplicacheApi<
  out Groups extends ReplicacheApiGroup.ReplicacheApiGroup.Any = never,
  // Errors
  in out E = never,
  // Requirements
  out R = never,
> extends Pipeable {
  new (_: never): {}
  readonly [TypeId]: TypeId
  readonly groups: Record.ReadonlyRecord<string, Groups>

  /**
   * Add a `ReplicacheApiGroup` to the `ReplicacheApi`.
   */
  add<A extends ReplicacheApiGroup.ReplicacheApiGroup.Any>(
    group: A,
  ): ReplicacheApi<Groups | A, E, R>
}

export class Api extends Context.Tag("@margins/replicache/Api")<
  Api,
  {
    readonly api: ReplicacheApi<ReplicacheApiGroup.ReplicacheApiGroup.AnyWithProps>
    readonly context: Context.Context<never>
  }
>() {}

export declare namespace ReplicacheApi {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Any {
    readonly [TypeId]: TypeId
  }

  /**
   * @since 1.0.0
   * @category models
   */
  export type AnyWithProps =
    ReplicacheApi<ReplicacheApiGroup.ReplicacheApiGroup.AnyWithProps>
}

const Proto = {
  [TypeId]: TypeId,
  pipe() {
    return pipeArguments(this, arguments)
  },
  add(
    this: ReplicacheApi.AnyWithProps,
    group: ReplicacheApiGroup.ReplicacheApiGroup.AnyWithProps,
  ) {
    console.log({ group: group.identifier })
    const result = makeProto({
      groups: Record.set(this.groups, group.identifier, group),
    })
    console.log({ result })
    return result
  },
}

const makeProto = <
  Groups extends ReplicacheApiGroup.ReplicacheApiGroup.Any,
>(options: {
  groups: Record.ReadonlyRecord<string, Groups>
}): ReplicacheApi<Groups> => {
  function ReplicacheApi() {}

  Object.setPrototypeOf(ReplicacheApi, Proto)
  ReplicacheApi.groups = options.groups
  return ReplicacheApi as any
}

export const empty: ReplicacheApi<never> = makeProto({
  groups: Record.empty(),
})
