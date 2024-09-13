import { Schema } from "@effect/schema"
import type { User } from "./User"
import { CurrentUser, UserId } from "./User"
import { HttpApiSchema } from "@effect/platform"
import { Effect } from "effect"

export class Unauthorized extends Schema.TaggedError<Unauthorized>()(
  "Unauthorized",
  {
    actorId: UserId,
    entity: Schema.String,
    action: Schema.String,
  },
  HttpApiSchema.annotations({ status: 403 }),
) {
  get message() {
    return `Actor (${this.actorId}) is not authorized to perform action "${this.action}" on entity "${this.entity}"`
  }
}

// TODO: add worskspace id etc for actors, system actor, etc
// see https://github.dev/sst/console/blob/dev/packages/functions/src/replicache/framework.ts
// and https://github.dev/tim-smart/effect-http-play

export const TypeId: unique symbol = Symbol.for("Domain/Policy/AuthorizedActor")
export type TypeId = typeof TypeId

export interface AuthorizedActor<Entity extends string, Action extends string>
  extends User {
  readonly [TypeId]: {
    readonly _Entity: Entity
    readonly _Action: Action
  }
}

export const authorizedActor = (user: User): AuthorizedActor<any, any> =>
  user as any

export const policy = <Entity extends string, Action extends string, E, R>(
  entity: Entity,
  action: Action,
  f: (actor: User) => Effect.Effect<boolean, E, R>,
): Effect.Effect<
  AuthorizedActor<Entity, Action>,
  E | Unauthorized,
  R | CurrentUser
> =>
  Effect.flatMap(CurrentUser, actor =>
    Effect.flatMap(f(actor), can =>
      can
        ? Effect.succeed(authorizedActor(actor))
        : Effect.fail(
            new Unauthorized({
              actorId: actor.id,
              entity,
              action,
            }),
          ),
    ),
  )
