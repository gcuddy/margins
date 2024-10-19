import { Effect, Layer } from 'effect';
import { makeReplicacheRepository } from './model.svelte';
// import { Entries as E } from "@margins/api2"
// TODO: actually use pnpm workspace / proper export lol
import { Rx } from '@effect-rx/rx';
import { Replicache } from '$lib/services/Replicache';
import { Schema } from '@effect/schema';

import { Entry } from '@margins/api2/src/Domain/Entry';

export class E extends Schema.Class<E>('E')({
	id: Schema.Number,
	title: Schema.String,
	completed: Schema.Boolean
}) {
	static readonly array = Schema.Array(E);
	static readonly chunk = Schema.Chunk(E);
}

const make = Effect.gen(function* () {
	const repo = yield* makeReplicacheRepository(Entry);

	// Desired output { watch, scan, get } etc and can build that here as effects. From Replicache. Helper to make it a store like Model.makeRepository.

	return {
		...repo
	} as const;
});

export class Entries extends Effect.Tag('Entries')<Entries, Effect.Effect.Success<typeof make>>() {
	static Live = Layer.effect(Entries, make).pipe(Layer.provide(Replicache.Default));
}

export const entriesRuntime = Rx.runtime(Entries.Live);

// entriesRuntime.rx()

export const effect = entriesRuntime.rx(Entries.scan());

// TODO:  EntryInd
export const get = (id: string) => entriesRuntime.rx(Entries.get(id));
export const subscriptionRef = entriesRuntime
	.subscriptionRef(Entries.streamSubscriptionRef())
	.pipe(Rx.keepAlive);
