/* eslint-disable require-yield */
import {
	Array,
	Chunk,
	Console,
	Effect,
	HashMap,
	Layer,
	MutableHashMap,
	Option,
	Stream,
	SubscriptionRef
} from 'effect';
import { Replicache } from '../../routes/(app)/profile/Replicache';
import * as R from 'replicache';
import { Rx } from '@effect-rx/rx';
import type { Model } from '@effect/sql';
import { Schema } from '@effect/schema';
import { Store } from '$lib/store.svelte';

export const makeRepo = <S extends Model.AnyNoContext & { key: string }>(model: S) =>
	Effect.gen(function* () {
		const replicache = yield* Replicache;
		const rep = yield* ReplicacheStream;

		const decode = Schema.decodeUnknownOption(model);

		// Maybe make this mutable?
		const keyToIndex = HashMap.empty<string, number>();
		const indexToKey = HashMap.empty<number, string>();

		const stream = rep.content;

		const findContent4 = () =>
			Effect.gen(function* () {
				const store = new Store(model);

				yield* Stream.async<R.ExperimentalNoIndexDiff>((emit) => {
					const unsubscribe = replicache.experimentalWatch(
						(diffs) => {
							emit(Effect.succeed(Chunk.make(diffs)));
							console.log({ diffs, key: model.key });
						},
						{
							initialValuesInFirstDiff: true,
							prefix: model.key
						}
					);
					// console.log({ unsubscribe });
					return Effect.sync(() => {
						console.log('unsubscribing from store', model.key);
						unsubscribe();
					});
				})
					.pipe(
						Stream.runForEach((diffs) =>
							Effect.gen(function* () {
								yield* Effect.log('got diff', diffs);
								const { add = [], change = [], del = [] } = Array.groupBy(diffs, (diff) => diff.op);
								console.log({ add, change, del });
								const valuesToPut = Chunk.unsafeFromArray(add).pipe(
									Chunk.appendAll(Chunk.unsafeFromArray(change)),
									Chunk.toArray
								);
								const keysToRemove = del.map((diff) => diff.key);
								console.log({ valuesToPut, keysToRemove });
								// TODO: maybe need to look at key vs id
								yield* Effect.zip(store.put(valuesToPut), store.remove(keysToRemove));
							})
						)
						// Effect.forever,
						// Effect.interrupt,
						// Effect.forkScoped
						// Stream.runForEachChunk(chunk =>
						// {
						//     chunk
						//   })
						// TODO: try yet another version that does the grouping below with the stream in chunks
						// Stream.runForEach((diff) =>
						// 	Effect.gen(function* () {
						// 		yield* Effect.log('Processing', diff);
						//
						// 		const { add, change, del } = Array.groupBy(diffs, (diff) => diff.op);
						// 		const valuesToPut = Chunk.unsafeFromArray(add).pipe(
						// 			Chunk.appendAll(Chunk.unsafeFromArray(change)),
						// 			Chunk.toArray
						// 		);
						// 		const keysToRemove = del.map((diff) => diff.key);
						// 		// TODO: yield this, so it needs to not be inside this callback function
						// 		Effect.zip(store.put(valuesToPut), store.remove(keysToRemove));
						// 	})
						// )
					)
					.pipe(Effect.forkScoped);
				// const x = yield* Effect.forkScoped(stream);
				console.log('returning store', { store });
				console.log({ stream });
				return store;
			});
		const findContent3 = (prefix?: string) =>
			Effect.gen(function* () {
				const store = new Store(model);

				const stream = Stream.async<R.ExperimentalDiffOperation<string>>((emit) => {
					const unsubscribe = replicache.experimentalWatch(
						(diffs) => emit.chunk(Chunk.unsafeFromArray(diffs)),
						{
							initialValuesInFirstDiff: true,
							prefix
						}
					);
					// console.log({ unsubscribe });
					return Effect.sync(() => unsubscribe());
				}).pipe(
					Stream.runForEach((diff) =>
						Effect.gen(function* () {
							// yield* Effect.log('Processing', diff);
							if (diff.op === 'del') {
								// TODO: actually take in the key here, use that in tuple
								yield* store.remove([diff.key]);
							} else {
								yield* store.put([diff.newValue]);
							}
						})
					)
					// Effect.forever,
					// Effect.interrupt,
					// Effect.forkScoped
					// Stream.runForEachChunk(chunk =>
					// {
					//     chunk
					//   })
					// TODO: try yet another version that does the grouping below with the stream in chunks
					// Stream.runForEach((diff) =>
					// 	Effect.gen(function* () {
					// 		yield* Effect.log('Processing', diff);
					//
					// 		const { add, change, del } = Array.groupBy(diffs, (diff) => diff.op);
					// 		const valuesToPut = Chunk.unsafeFromArray(add).pipe(
					// 			Chunk.appendAll(Chunk.unsafeFromArray(change)),
					// 			Chunk.toArray
					// 		);
					// 		const keysToRemove = del.map((diff) => diff.key);
					// 		// TODO: yield this, so it needs to not be inside this callback function
					// 		Effect.zip(store.put(valuesToPut), store.remove(keysToRemove));
					// 	})
					// )
				);
				const x = yield* Effect.forkScoped(stream);
				console.log('returning store', { store });
				console.log({ stream });
				return store;
			});

		const findContent2 = (prefix?: string) =>
			Effect.gen(function* () {
				const store = new Store(model);
				const unsubscribe = replicache.experimentalWatch((diffs) => {
					const { add, change, del } = Array.groupBy(diffs, (diff) => diff.op);
					const valuesToPut = Chunk.unsafeFromArray(add).pipe(
						Chunk.appendAll(Chunk.unsafeFromArray(change)),
						Chunk.toArray
					);
					const keysToRemove = del.map((diff) => diff.key);
					// TODO: yield this, so it needs to not be inside this callback function
					Effect.zip(store.put(valuesToPut), store.remove(keysToRemove));
				});
			});
		const findContent = (prefix?: string) =>
			Effect.gen(function* () {
				const keyToIndex = MutableHashMap.empty<string, number>();
				const indexToKey = MutableHashMap.empty<number, string>();

				return Stream.async<S['Type']>((emit) => {
					const unsubscribe = replicache.experimentalWatch(
						(diffs) => {
							// TODO: use effect loop
							for (const diff of diffs) {
								if (diff.op === 'add') {
									const value = decode(diff.newValue);
									Option.match(value, {
										onSome: () => {},
										onNone: () => console.warn('error parsing value', value)
									});
								}
							}
							const chunk = Chunk.fromIterable(diffs);
							console.log('making an iterable chunk');
							emit.chunk(chunk);
						},
						{
							initialValuesInFirstDiff: true,
							prefix
						}
					);
					return Effect.sync(() => unsubscribe());
				});
			});

		// TODO: what's the effect-y way to do this
		// TODO: can we make it not be svelte-y, but effect-y?
		const scan = Effect.gen(function* () {
			// const data = $state(Array.empty<S['Type']>());

			console.log('scanning');

			const ref = yield* SubscriptionRef.make(Array.empty<S['Type']>());
			// TODO: use rx or something?
			console.log('here is my ref', { ref });
			yield* stream.pipe(
				Stream.runForEach((diff) =>
					Effect.gen(function* () {
						yield* Effect.log('investigating diff inside stream');
						// Make this more effect-y
						if (diff.op === 'add') {
							const value = decode(diff.newValue);
							yield* Effect.log('add op', diff.key);
							yield* Option.match(value, {
								onSome: (value) =>
									Effect.gen(function* () {
										const a = yield* SubscriptionRef.updateAndGet(ref, (data) =>
											Array.append(data, value)
										);
										const index = a.length;
										HashMap.set(keyToIndex, diff.key, index - 1);
										HashMap.set(indexToKey, index - 1, diff.key);
									}),
								onNone: () => Console.error(value)
							});
							console.log({ ref });
						} else if (diff.op === 'change') {
							const index = HashMap.get(keyToIndex, diff.key);
							yield* Option.all([index, decode(diff.newValue)]).pipe(
								Option.match({
									onSome: ([index, value]) =>
										SubscriptionRef.update(ref, (data) => Array.replace(data, index, value)),
									onNone: () => Effect.void
								})
							);
						} else if (diff.op === 'del') {
							const toRemove = HashMap.get(keyToIndex, diff.key);
							yield* Option.match(Option.all([toRemove]), {
								onNone: () => Console.warn('Got a del with no index'),
								onSome: ([toRemove]) =>
									Effect.gen(function* () {
										const data = yield* SubscriptionRef.updateAndGet(ref, (data) =>
											Array.remove(data, toRemove)
										);
										HashMap.remove(keyToIndex, diff.key);
										HashMap.remove(indexToKey, toRemove);
										const lastKey = HashMap.get(indexToKey, data.length - 1);
										Option.match(lastKey, {
											onNone: () => {},
											onSome: (lastKey) => {
												HashMap.set(keyToIndex, lastKey, toRemove);
												HashMap.set(indexToKey, toRemove, lastKey);
											}
										});
										HashMap.remove(indexToKey, data.length - 1);
									})
							});

							// TODO
						}
					})
				)
				// Stream.run(
				//     Sink.forEach(diff => {
				//         console.log({diff})
				//         return Effect.void
				//     })
				// )
			);

			console.log({ ref });
			return ref;
		});

		// const stream = rep.contentFn(model.key);
		// const stream2 = rep.contentFn2(model.key);
		console.log({
			stream
			// stream2
		});

		// const subscriptionRef = yield* SubscriptionRef.make<S['Type'][]>([]);

		// const [head, rest] = yield* Stream.peel(stream2, Sink.head());

		// const ref = yield* SubscriptionRef.make(yield* head);
		// yield* Stream.runForEach(rest, (item) => SubscriptionRef.set(ref, item)).pipe(
		// 	Effect.forkScoped,
		// 	Effect.interruptible
		// );
		// return ref

		// const i = stream.pipe(
		// 	Stream.filterMapEffect((diff) => diff)
		// 	// Stream.map(diff => {
		// 	//     return diff
		// 	// })
		// );

		// const adds = stream2.pipe(Stream.filter((diff) => diff.op === 'add'));

		// const a2 = (filter?: (values: S['Type']) => S['Type']) =>
		// 	stream2.pipe(
		// 		Stream.tap((diff) => Console.log(diff)),
		// 		Stream.filterMap((diff) => {
		// 			// return Option.some(1);
		// 			console.log({ diff });
		// 			const a = decode(diff);

		// 			if (a._tag === 'None') {
		// 				console.log('NONE', a);
		// 			}

		// 			return a as Option.Option<S['Type']>;
		// 		}),
		// 		Stream.filter((s) => (filter ? filter(s) : true))
		// 	);

		const put = (tx: R.WriteTransaction, id: string, item: S['Type']) => {
			// or put this into replicache like replicache.mutators.--> didk.
			const key = [model.key, id].join('/');
			return Effect.promise(() => tx.set(key, item));
		};

		return {
			stream,
			scan,
			put,
			findContent3,
			findContent4
		} as const;

		// return { content, contentFn } as const;
	}).pipe(Effect.provide(Replicache.Live), Effect.provide(ReplicacheStream.Live));

const make = Effect.gen(function* () {
	const replicache = yield* Replicache;

	const content = Stream.async<R.ExperimentalDiffOperation<string>>((emit) => {
		const unsubscribe = replicache.experimentalWatch(
			(diffs) => {
				const chunk = Chunk.fromIterable(diffs);
				console.log('making an iterable chunk');
				emit.chunk(chunk);
			},
			{
				initialValuesInFirstDiff: true
				// prefix: ''
			}
		);
		return Effect.sync(() => unsubscribe());
	});
	const contentFn = (prefix: string) =>
		Stream.async<R.ExperimentalNoIndexDiff>((emit) => {
			const unsubscribe = replicache.experimentalWatch(
				(diffs) => {
					const chunk = Chunk.make(diffs);
					console.log(`makin' a chunk`, chunk);
					emit.chunk(chunk);
				},
				{
					initialValuesInFirstDiff: true,
					prefix
				}
			);
			return Effect.sync(() => unsubscribe());
		});
	const contentFn2 = (prefix: string) =>
		Stream.async<R.ExperimentalNoIndexDiff[number]>((emit) => {
			const unsubscribe = replicache.experimentalWatch(
				(diffs) => {
					console.log('HAHAHAHA');
					for (const diff of diffs) {
						emit.single(diff);
					}
					// const chunk = Chunk.make(diffs);
					// const a = Effect.forEach(diffs, (diff) =>
					// 	Effect.gen(function* () {
					// 		return diff;
					// 	})
					// );
				},
				{
					initialValuesInFirstDiff: true,
					prefix
				}
			);
			return Effect.sync(() => unsubscribe());
		});
	return { content, contentFn, contentFn2 } as const;
});

export class ReplicacheStream extends Effect.Tag('ReplicacheStream')<
	ReplicacheStream,
	Effect.Effect.Success<typeof make>
>() {
	static Live = Layer.effect(this, make).pipe(Layer.provide(Replicache.Live));
}

export const runtime = Rx.runtime(ReplicacheStream.Live);

export const stream = runtime.pull(() => Stream.unwrap(ReplicacheStream.content));
export const stream2 = runtime.rx(ReplicacheStream.content);
export const stream3 = runtime.pull((get) => Stream.unwrap(ReplicacheStream.content));

export const streamFn = (prefix: string) =>
	runtime.pull(() => Stream.unwrap(ReplicacheStream.contentFn(prefix)));
