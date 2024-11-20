import { HttpApiBuilder } from "@effect/platform"
import { Api } from "../Api.js"
import { Effect, Layer, pipe } from "effect"
import { Entries } from "../Entries.js"
import { EntryNotFound } from "../Domain/Entry.js"
import { policyUse } from "../Domain/Actor.js"
import { EntriesPolicy } from "./Policy.js"
import { AuthenticationLive } from "../Users/Http.js"

export const HttpEntriesLive = HttpApiBuilder.group(Api, "entries", handlers =>
  Effect.gen(function* () {
    const entries = yield* Entries
    const policy = yield* EntriesPolicy

    const h = handlers.handle("getEntry", ({ path }) => {
      const a = pipe(
        entries.findEntryById(path.id),
        Effect.flatten,
        Effect.mapError(() => new EntryNotFound({ id: path.id })),
        policyUse(policy.canRead(path.id))
      )
      return a
    })
    return h

  }),
).pipe(
  Layer.provide([
    AuthenticationLive,
    Entries.Default,
    EntriesPolicy.Default,
  ]),
)
