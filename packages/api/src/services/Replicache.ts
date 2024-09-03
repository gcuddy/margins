import { Context, Effect } from "effect"
import { DB } from "./db"

const make = Effect.gen(function* () {
  const db = yield* DB

  const push = () => {}
})

export class Replicache extends Context.Tag("core/replicache")<
  Replicache,
  Effect.Effect.Success<typeof make>
>() {}
