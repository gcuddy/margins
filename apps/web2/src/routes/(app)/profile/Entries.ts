import { Effect, Layer } from 'effect';
import { makeReplicacheRepository } from './model.svelte';
// import { Entries as E } from "@margins/api2"
// TODO: actually use pnpm workspace / proper export lol
import { Rx } from '@effect-rx/rx';
import { Replicache } from './Replicache';
import * as R from 'replicache';
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
	const repo = yield * makeReplicacheRepository(Entry);

	// Desired output { watch, scan, get } etc and can build that here as effects. From Replicache. Helper to make it a store like Model.makeRepository.

	return {
		...repo
	} as const;
});

export class Entries extends Effect.Tag('Entries')<Entries, Effect.Effect.Success<typeof make>>() {
	static Live = Layer.effect(Entries, make).pipe(
		Layer.provide(
			Replicache.Live(
				new R.Replicache({
					name: 'n0za7qlnp1rca3s',
					licenseKey: 'ld43a69e6baa14a1a85eb6bb09661739e',
					pullURL: 'http://0.0.0.0:3000/sync/pull',
					pushURL: 'http://0.0.0.0:3000/sync/push',

					auth: 'Bearer mnywTdF8-3wdpuCz4lj-ZFiY6',
					logLevel: 'debug'
				})
			)
		)
	);
}

export const entriesRuntime = Rx.runtime(Entries.Live);

// entriesRuntime.rx()

export const effect = entriesRuntime.rx(Entries.scan());

// TODO:  EntryInd
export const get = (id: string) => entriesRuntime.rx(Entries.get(id));
export const subscriptionRef = entriesRuntime
	.subscriptionRef(Entries.streamSubscriptionRef())
	.pipe(Rx.keepAlive);
