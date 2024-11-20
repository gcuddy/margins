/* eslint-disable @typescript-eslint/no-empty-object-type */

import { Effect, Schema } from "effect";
import { Record } from "effect";

export const TypeId: unique symbol = Symbol.for("@margins/replicache/Api")
export type TypeId = typeof TypeId

// type Mutation = {
//   name: string;
// }
//
// interface Group<Id extends string, Mutations extends Mutation = never> {
//   readonly identifier: Id
//   add<A extends Mutation>(mutation: A): Group<Id, A | Mutations>
// }


const Proto = {
  [TypeId]: TypeId,
  add(this: ReplicacheApi<any>, group: ReplicacheApiGroup<string>) {
    return makeProto({
      groups: Record.set(this.groups, group.identifier, group)
    })
  }
}

const GroupTypeId: unique symbol = Symbol.for("@margins/replicache/Group")
type GroupTypeId = typeof GroupTypeId


type ReplicacheGroupAny = {
  [GroupTypeId]: GroupTypeId,
  identifier: string;
}

interface ReplicacheApi<Groups extends ReplicacheGroupAny = never> {
  new(_: never): {}
  readonly groups: Record.ReadonlyRecord<string, Groups>
  add<A extends ReplicacheGroupAny>(group: A): ReplicacheApi<Groups | A>
}

const makeProto = <Groups extends ReplicacheGroupAny>(options: {
  readonly groups: Record.ReadonlyRecord<string, Groups>
}): ReplicacheApi<Groups> => {
  function ReplicacheApi() { }
  Object.setPrototypeOf(ReplicacheApi(), Proto)
  ReplicacheApi.groups = options.groups
  return ReplicacheApi as any
}
interface ReplicacheApiGroup<Id extends string, Mutations extends ReplicacheApiMutation<string> = never> {
  new(_: never): {}
  readonly [GroupTypeId]: GroupTypeId
  readonly identifier: Id
  readonly mutations: Record.ReadonlyRecord<string, Mutations>

  add<A extends ReplicacheApiMutation<string>>(
    mutation: A
  ): ReplicacheApiGroup<Id, Mutations | A>
}

const replicacheApiMakeEmpty = makeProto({
  groups: new Map() as any
})

interface ReplicacheApiMutation<Name extends string, S extends Schema.Schema.AnyNoContext = any> {
  readonly name: Name;
  readonly schema: S
}

const ReplicacheApiGroupProto = {
  add<A extends ReplicacheApiMutation<string>>(
    this: ReplicacheApiGroup<string>,
    mutation: A
  ) {
    return makeReplicacheGroupProto({
      identifier: this.identifier,
      mutations: Record.set(
        this.mutations,
        mutation.name,
        mutation
      )
    })
  }
}

const makeReplicacheGroupProto = <Id extends string, Mutations extends ReplicacheApiMutation<string>>(options: { readonly identifier: Id, readonly mutations: Record.ReadonlyRecord<string, Mutations> }) => {
  function ReplicacheApiGroup() { }
  Object.setPrototypeOf(ReplicacheApiGroup(), ReplicacheApiGroupProto)
  return Object.assign(ReplicacheApiGroup, options) as any
}

const makeReplicacheGroup = <Id extends string>(identifier: Id): ReplicacheApiGroup<Id> => makeReplicacheGroupProto({
  identifier,
  mutations: Record.empty()
})

const Entries = makeReplicacheGroup("entries")

const x = Entries
  .add({
    name: "saveBook",
    schema: Schema.String
  })
  .add({
    name: "removeBook",
    schema: Schema.String
  })

const makeMutation: <const Name extends string, S extends Schema.Schema.AnyNoContext>(
  name: Name,
  schema: S
) => ReplicacheApiMutation<Name, S> = (name, schema) => ({ name, schema })

const e = makeReplicacheGroup("entries")
  .add(
    makeMutation("saveBook", Schema.Number)
  )

class E extends e { }


type ExtractNameFromGroup<Group> = Group extends ReplicacheApiGroup<infer _Groups> ? _Groups : never;

const ReplicacheMutationServerBuilder = <Groups extends ReplicacheApiGroup<string>, const Name extends ExtractNameFromGroup<Groups>>(api: ReplicacheApi<Groups>, groupName: Name) => Effect.gen(function* () {
  const group = api.groups[groupName]!;

})


class MarginsReplicacheApi extends replicacheApiMakeEmpty.add(E) { }

ReplicacheMutationServerBuilder(MarginsReplicacheApi, "tesg")
// ^ should error
