import { Effect, Option } from "effect"
import type { EntryId } from "../Domain/Entry.js"
import { policy } from "../Domain/Actor.js"
import { Entries } from "../Entries.js"

const make = Effect.gen(function* () {
  const entries = yield* Entries;

  // In future, allow groups/workspaces
  const canRead = (toRead: EntryId) =>
    entries.with(toRead, entry =>
      policy("Entry", "read", actor =>
        Option.match(entry.user_id, {
          onSome: userId => Effect.succeed(actor.id === userId),
          onNone: () => Effect.succeed(true),
        }),
      )
    )

  return { canRead } as const
})

export class EntriesPolicy extends Effect.Service<EntriesPolicy>()("Entries/Policy", {
  effect: make,
  dependencies: [Entries.Default]
}) { }
