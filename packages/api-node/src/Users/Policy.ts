import { Effect, Layer } from "effect"
import type { UserId } from "../Domain/User.js"
import { policy } from "../Domain/Actor.js"

const make = Effect.gen(function* () {
  const canUpdate = (toUpdate: UserId) =>
    policy("User", "update", actor => Effect.succeed(actor.id === toUpdate))

  const canRead = (toRead: UserId) =>
    policy("User", "read", actor => Effect.succeed(actor.id === toRead))

  const canReadSensitive = (toRead: UserId) =>
    policy("User", "readSensitive", actor =>
      Effect.succeed(actor.id === toRead),
    )

  return { canUpdate, canRead, canReadSensitive } as const
})

export class UsersPolicy extends Effect.Service<UsersPolicy>()("Users/Policy", {
  effect: make
}) { }

