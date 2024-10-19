import { makeRepo } from '$lib/services/replicache-store.svelte';
import { Effect, Layer } from 'effect';

import { Rx } from '@effect-rx/rx';
// import { makeReplicacheRepository } from '../../routes/(app)/profile/model.svelte';
import { Entry, EntryId } from '@margins/api2/src/Domain/Entry';
import { Replicache } from './Replicache';

export class Entries extends Effect.Service<Entries>()('Entries', {
	effect: Effect.gen(function* () {
		const repo = yield* makeRepo(Entry);

		return {
			...repo
		} as const;
	}),
	dependencies: [Replicache.Default]
}) {}

// export class Entries extends Effect.Tag('Entries')<Entries, Effect.Effect.Success<typeof make>>() {
// 	static Live = Layer.scoped(Entries, make).pipe(Layer.provide(Replicache.Default));
// }

export const entriesRuntime = Rx.runtime(Entries.Default);

const e = Entries.pipe(
	Effect.andThen(({ stream }) =>
		stream().pipe(Effect.provide(Entries.Default), Effect.provide(Replicache.Default))
	)
);

export const stream = entriesRuntime.rx(e);
export const get = (id: EntryId) =>
	entriesRuntime.rx(
		Entries.pipe(
			Effect.andThen(({ get }) =>
				get(id).pipe(Effect.provide(Entries.Default), Effect.provide(Replicache.Default))
			)
		)
	);
