import { Effect, Layer, Option } from "effect"
import { Entry } from "../Domain/Entry.js"
import { policy } from "../Domain/Actor.js"

const make = Effect.gen(function* () {
  const canRead = (toRead: Entry) =>
    policy("Entry", "read", actor =>
      Option.match(toRead.user_id, {
        onSome: userId => Effect.succeed(actor.id === userId),
        onNone: () => Effect.succeed(true),
      }),
    )

  return { canRead } as const
})

export class EntriesPolicy extends Effect.Tag("Entries/Policy")<
  EntriesPolicy,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(EntriesPolicy, make)
}
