import { HttpApiBuilder } from "@effect/platform"
import { Api } from "../Api.js"
import { Effect, Layer, pipe } from "effect"
import { Entries } from "../Entries.js"
import { EntryNotFound } from "../Domain/Entry.js"
import { policyUse, withSystemActor } from "../Domain/Actor.js"
import { EntriesPolicy } from "./Policy.js"
import { Users } from "../Users.js"

export const HttpEntriesLive = HttpApiBuilder.group(Api, "entries", handlers =>
  Effect.gen(function* () {
    const entries = yield* Entries
    const policy = yield* EntriesPolicy
    const users = yield* Users

    return handlers.pipe(
      HttpApiBuilder.handle("getEntry", ({ path }) => {
        const x = entries.with(path.id, entry =>
          pipe(Effect.succeed(entry), policyUse(policy.canRead(entry))),
        )
        return x

        // return pipe(
        //   entries.findEntryById(path.id),
        //   Effect.flatten,
        //   Effect.mapError(() => new EntryNotFound({ id: path.id })),
        //   Effect.tap(entry => {
        //     const a = policyUse(policy.canRead(entry))
        //     return a
        //   }),
        //   policyUse(policy.canRead(path as any)),
        //   // withSystemActor,
        //   //   Effect.map(Option.getOrElse(HttpApiError.notFound)),
        // )
      }),
      users.httpSecurity,
    )
  }),
).pipe(
  Layer.provide(Entries.Live),
  Layer.provide(EntriesPolicy.Live),
  Layer.provide(Users.Live),
)
