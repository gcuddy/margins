import { Schema } from "@effect/schema"
import type { User } from "./User.js"
import { CurrentUser, UserId } from "./User.js"
import { HttpApiSchema } from "@effect/platform"
import { Effect } from "effect"

export class Unauthorized extends Schema.TaggedError<Unauthorized>()(
  "Unauthorized",
  {
    actorId: UserId,
    entity: Schema.String,
    action: Schema.String,
  },
  HttpApiSchema.annotations({ status: 401 }),
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

export const policyCompose =
  <Actor extends AuthorizedActor<any, any>, E, R>(
    that: Effect.Effect<Actor, E, R>,
  ) =>
  <Actor2 extends AuthorizedActor<any, any>, E2, R2>(
    self: Effect.Effect<Actor2, E2, R2>,
  ): Effect.Effect<Actor | Actor2, E | Unauthorized, R | CurrentUser> =>
    Effect.zipRight(self, that) as any

export const policyUse =
  <Actor extends AuthorizedActor<any, any>, E, R>(
    policy: Effect.Effect<Actor, E, R>,
  ) =>
  <A, E2, R2>(
    effect: Effect.Effect<A, E2, R2>,
  ): Effect.Effect<A, E | E2, Exclude<R2, Actor> | R> =>
    policy.pipe(Effect.zipRight(effect)) as any

export const policyRequire =
  <Entity extends string, Action extends string>(
    _entity: Entity,
    _action: Action,
  ) =>
  <A, E, R>(
    effect: Effect.Effect<A, E, R>,
  ): Effect.Effect<A, E, R | AuthorizedActor<Entity, Action>> =>
    effect

export const withSystemActor = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
): Effect.Effect<A, E, Exclude<R, AuthorizedActor<any, any>>> => effect as any