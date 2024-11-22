import { describe, it, expect, assert, expectTypeOf } from "@effect/vitest"
import * as ReplicacheApiGroup from "./ReplicacheApiGroup.js"
import * as ReplicacheApi from "./ReplicacheApi.js"
import * as ReplicacheApiMutation from "./ReplicacheApiMutation.js"
import * as ReplicacheApiBuilder from "./ReplicacheApiBuilder.js"
import { ExceededCapacityException } from "effect/Cause"
import { Effect, Record, Schema } from "effect"

class TestGroup extends ReplicacheApiGroup.make("testGroup").add(
  ReplicacheApiMutation.make("testMutation", Schema.Number),
) { }

const m = ReplicacheApiMutation.make("one", Schema.String)

type M = typeof m;

type N = ReplicacheApiMutation.ReplicacheApiMutation.Name<M>


describe("ReplicacheApi", () => {
  it("should be empty", () => {
    class Api extends ReplicacheApi.empty { }
    expect(Api).toBeDefined()
  })
  it("should add a group", () => {
    class Api extends ReplicacheApi.empty.add(TestGroup) { }

    expect(Record.size(Api.groups)).toBe(1)
    expect(Record.get(Api.groups, "testGroup")).toBeDefined()
  })
  it.effect("should add a mutation", () =>
    Effect.gen(function* () {
      class Api extends ReplicacheApi.empty.add(TestGroup) { }

      const group = yield* Record.get(Api.groups, "testGroup")
      expect(Record.size(group.mutations)).toBe(1)
      expect(Record.get(group.mutations, "testMutation")).toBeDefined()
    }),
  )
})

describe("ReplicacheApiBuilder", () => {
  it.effect("should build handlers", () =>
    Effect.gen(function* () {
      class Api extends ReplicacheApi.empty.add(TestGroup) { }

      const group = ReplicacheApiBuilder.group(Api, "testGroup", "testMutation")
    }),
  )
})
