import { Context, Effect, Layer } from "effect"
import * as Api from "nanoid"

const make = Effect.gen(function* () {
  const generate = Effect.sync(() => Api.nanoid())
  const generateWithSize = (size: number) => Effect.sync(() => Api.nanoid(size))
  return { generate, generateWithSize } as const
})

export class Nanoid extends Context.Tag("Nanoid")<
  Nanoid,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(Nanoid, make)
  static Test = Layer.succeed(Nanoid, {
    generate: Effect.succeed("test-uuid"),
    generateWithSize: () => Effect.succeed("test-uuid"),
  })
}
