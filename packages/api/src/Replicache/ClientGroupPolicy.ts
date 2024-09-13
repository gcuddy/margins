import { Effect, Layer } from "effect"
import type {
  ReplicacheClientGroup,
  ReplicacheClientGroupId,
} from "../Domain/Replicache"
import { policy } from "../Domain/Actor"

const make = Effect.gen(function* () {
  const canRead = (toRead: ReplicacheClientGroup) =>
    policy("ClientGroup", "read", actor =>
      Effect.succeed(actor.id === toRead.userID),
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
