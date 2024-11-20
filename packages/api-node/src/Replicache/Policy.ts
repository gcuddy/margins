import { Effect, Option } from "effect"
import type { EntryId } from "../Domain/Entry.js"
import { policy } from "../Domain/Actor.js"
import { Entries } from "../Entries.js"

export class ReplicachePolicy extends Effect.Service<ReplicachePolicy>()("Repliache/Policy", {
  effect: Effect.gen(function* () {
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

    const canPull = () => { }

    return { canRead } as const
  })
  ,
  dependencies: [Entries.Default]
}) { }
