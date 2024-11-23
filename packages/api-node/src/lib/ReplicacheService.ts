import { Effect } from "effect"

// export class ReplicacheApi extends

class ReplicacheBackend extends Effect.Service<ReplicacheBackend>()(
  "ReplicacheBackend",
  {
    effect: Effect.gen(function* () {
      return {}
    }),
  },
) {}
