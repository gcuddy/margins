import { makeRepo } from '$lib/services/replicache-store';
import { Effect, Layer, Stream } from 'effect';

import { Annotation } from '@margins/api2/src/Domain/Annotation';
import { Rx } from '@effect-rx/rx';
// import { makeReplicacheRepository } from '../../routes/(app)/profile/model.svelte';
import { Entry, EntryId } from '@margins/api2/src/Domain/Entry';
import { Store } from '$lib/store.svelte';
import { Replicache } from './Replicache';

const make = Effect.gen(function* () {
	const repo = yield* makeRepo(Entry);

	return {
		...repo
	} as const;
});

export class Entries extends Effect.Tag('Entries')<Entries, Effect.Effect.Success<typeof make>>() {
	static Live = Layer.scoped(Entries, make).pipe(Layer.provide(Replicache.Live));
}

export const entriesRuntime = Rx.runtime(Entries.Live);

const e = Entries.stream().pipe(Effect.provide(Entries.Live), Effect.provide(Replicache.Live));

export const stream = entriesRuntime.rx(e);
export const get = (id: EntryId) =>
	entriesRuntime.rx(
		Entries.get(id).pipe(Effect.provide(Entries.Live), Effect.provide(Replicache.Live))
	);
