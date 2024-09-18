import { Effect, Layer } from "effect"
import type {
  ReplicacheClientGroup,
  ReplicacheClientGroupId,
} from "../Domain/Replicache.js"
import { policy } from "../Domain/Actor.js"

const make = Effect.gen(function* () {
  const canRead = (toRead: ReplicacheClientGroup) =>
    policy("ClientGroup", "read", actor =>
      Effect.succeed(actor.id === toRead.userId),
    )

  return {
    canRead,
  } as const
})

export class ClientGroupPolicy extends Effect.Tag(
  "Replicache/ClientGroupPolicy",
)<ClientGroupPolicy, Effect.Effect.Success<typeof make>>() {
  static Live = Layer.effect(ClientGroupPolicy, make)
}
