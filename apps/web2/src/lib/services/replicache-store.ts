import { Array, Chunk, Console, Effect, Stream, String } from 'effect';
import * as R from 'replicache';
import type { Model } from '@effect/sql';
import { Schema } from '@effect/schema';
import { Store } from '$lib/store.svelte';
import { Replicache } from './Replicache';

export const createStream = (prefix: string) =>
	Replicache.pipe(
		Effect.andThen((replicache) =>
			Stream.async<R.ExperimentalNoIndexDiff>((emit) => {
				const unsubscribe = replicache.experimentalWatch(
					(diffs) => {
						emit(Effect.succeed(Chunk.make(diffs)));
					},
					{
						initialValuesInFirstDiff: true,
						prefix
					}
				);
				return Effect.sync(() => {
					unsubscribe();
				}).pipe(
					Effect.tap(Effect.log('Unsubscribing from replicache.experimentalWatch for', prefix))
				);
			})
		)
	);

export const makeRepo = <S extends Model.AnyNoContext & { readonly key: string }>(model: S) =>
	Effect.gen(function* () {
		const store = new Store<Schema.Schema.Type<S>, Schema.Schema.Encoded<S>>(model);

		const stream = () =>
			Effect.gen(function* () {
				const stream = yield* createStream(model.key);
				yield* stream
					.pipe(
						Stream.runForEach((diffs) =>
							Effect.gen(function* () {
								const { add = [], change = [], del = [] } = Array.groupBy(diffs, (diff) => diff.op);
								const valuesToPut = Chunk.unsafeFromArray(add).pipe(
									Chunk.appendAll(Chunk.unsafeFromArray(change)),
									Chunk.filter((c) => c.op === 'add' || c.op === 'change'),
									// TODO: filter map?
									Chunk.toArray,
									Array.map((diff) => diff.newValue)
								);
								const keysToRemove = del.map((diff) => diff.key);
								// TODO: maybe need to look at key vs id
								yield* Effect.zip(store.put(valuesToPut), store.remove(keysToRemove));
							})
						)
					)
					.pipe(Effect.forkScoped);

				return store;
			});

		const get = (id: string) =>
			Effect.gen(function* () {
				const key = `${model.key}/${id}`;
				const stream = yield* createStream(key);
				console.log({ key, stream });

				const a = stream.pipe(Stream.take(1), Stream.runCollect);

				// TODO: abstract out duped code
				yield* stream
					.pipe(
						Stream.runForEach((diffs) =>
							Effect.gen(function* () {
								yield* Effect.log(diffs);
								const { add = [], change = [], del = [] } = Array.groupBy(diffs, (diff) => diff.op);
								const valuesToPut = Chunk.unsafeFromArray(add).pipe(
									Chunk.appendAll(Chunk.unsafeFromArray(change)),
									Chunk.filter((c) => c.op === 'add' || c.op === 'change'),
									// TODO: filter map?
									Chunk.toArray,
									Array.map((diff) => diff.newValue)
								);
								const keysToRemove = del.map((diff) => diff.key);
								// TODO: maybe need to look at key vs id
								yield* Effect.zip(store.put(valuesToPut), store.remove(keysToRemove));
							})
						)
					)
					.pipe(Effect.forkScoped);

				const item = store.get(id);

				return store;
			}).pipe(Effect.tapErrorCause(Effect.logError));

		const getStream = (id: string) =>
			Effect.gen(function* () {
				const key = `${model.key}/${id}`;
				const stream = yield* createStream(key);
				console.log({ key, stream });

				const a = stream.pipe(Stream.take(1), Stream.runCollect);

				// TODO: abstract out duped code
				yield* stream
					.pipe(
						Stream.runForEach((diffs) =>
							Effect.gen(function* () {
								yield* Effect.log(diffs);
								const { add = [], change = [], del = [] } = Array.groupBy(diffs, (diff) => diff.op);
								const valuesToPut = Chunk.unsafeFromArray(add).pipe(
									Chunk.appendAll(Chunk.unsafeFromArray(change)),
									Chunk.filter((c) => c.op === 'add' || c.op === 'change'),
									// TODO: filter map?
									Chunk.toArray,
									Array.map((diff) => diff.newValue)
								);
								const keysToRemove = del.map((diff) => diff.key);
								// TODO: maybe need to look at key vs id
								yield* Effect.zip(store.put(valuesToPut), store.remove(keysToRemove));
							})
						)
					)
					.pipe(Effect.forkScoped);

				const item = store.get(id);

				return store;
			}).pipe(Effect.tapErrorCause(Effect.logError));

		return {
			stream,
			get
		} as const;

		// return { content, contentFn } as const;
	}).pipe(Effect.provide(Replicache.Live));
