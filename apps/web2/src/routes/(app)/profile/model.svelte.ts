/* eslint-disable require-yield */
import { Replicache } from './Replicache';
import { Effect, Either } from 'effect';
import { Schema } from '@effect/schema';
import { Model } from '@effect/sql';
import { reconcile, unwrap } from 'solid-js/store';
// import type { ParseError } from '@effect/schema/ParseResult';
// import { Rx } from '@effect-rx/rx';

// class ReplicacheScanError extends Data.TaggedError('ReplicacheScanError')<{
// 	readonly message: string;
// }> {}

// const scanRef = SubscriptionRef.make([]);

// const t = Rx.subscriptionRef(scanRef);

// type DataState<Success, Failure> = Data.TaggedEnum<{
// 	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
// 	Loading: {};
// 	Success: { readonly data: Success };
// 	Failure: { readonly reason: Failure };
// }>;

// TODO: read up on how to do this with Streams
// should return : Effect.Effect<
// 	{
// 		readonly scan: () => Effect.Effect<S['Type'][], ParseError, never>;
// 	},
// 	never,
// 	never
// >
export const makeReplicacheRepository = <S extends Model.Any>(
	model: S,
	options: {
		prefix: string;
		indexName?: string;
	}
) =>
	Effect.gen(function* () {
		const replicache = yield * Replicache;

		// TODO: make this use Effect.Stream
		// TODO: maybe refine should be called on each? also maybe schema.array instead of call on eacH?
		const scan = (refine?: (values: S['Type'][]) => S['Type'][]) =>
			Effect.gen(function* () {
				// let data = $state<T[]>([]);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const decode = Schema.decodeUnknownEither(model as any);
				// TODO: how to derive prefix type from Model maybe?
				// TODO: use experimentalWatch for better performance
				// see my existing code
				// replicache.subscribe()
				// Maybe there's a way to do this too...
				// const actions = $state(Data.taggedEnum<DataState<S['Type'][], ParseError>>());
				// const data = $state<S['Type'][]>([]);
				// for now we'll adapt what we had

				let data = $state<S['Type'][]>([]);
				let ready = $state(false);

				// hash maps?
				const keyToIndex = new Map<string, number>();
				const indexToKey = new Map<number, string>();

				$effect(() => {
					return replicache.experimentalWatch(
						(diffs) => {
							// fast initial diff if we haven't seen diffs
							if (!ready) {
								const values: S['Type'][] = [];
								for (const diff of diffs) {
									if (diff.op === 'add') {
										// const value = decode(diff.newValue);
										// TODO: properly decode
										const value = Either.right(diff.newValue);
										if (Either.isRight(value)) {
											const index = values.push(value);
											keyToIndex.set(diff.key, index - 1);
											indexToKey.set(index - 1, diff.key);
										} else {
											// TODO: send to open telemetry / sentry
											console.error(value);
										}
									}
								}
								ready = true;
								data = values;
							} else {
								for (const diff of diffs) {
									if (diff.op === 'add') {
										// const value = decode(diff.newValue);
										// TODO: properly decode
										const value = Either.right(diff.newValue);
										Either.match(value, {
											onRight: (value) => {
												const index = data.push(value);
												keyToIndex.set(diff.key, index - 1);
												indexToKey.set(index - 1, diff.key);
											},
											onLeft: (error) => {
												console.error('parse error', error);
												// TODO: handle error
											}
										});
									} else if (diff.op === 'change') {
										const index = keyToIndex.get(diff.key);
										// const value = decode(diff.newValue);
										// TODO: properly decode
										const value = Either.right(diff.newValue);
										if (Either.isRight(value)) {
											// data[keyToIndex.get(diff.key)!] = value.right;
											// TODO: don't use solidjs?
											data[index!] = reconcile(value)(unwrap(data[index!]));
										} else {
											console.error('parse error', value);
										}
									} else if (diff.op === 'del') {
										const toRemove = keyToIndex.get(diff.key)!;
										const last = data.at(-1);
										const lastKey = indexToKey.get(data.length - 1)!;

										data[toRemove] = last;
										keyToIndex.delete(diff.key);
										indexToKey.delete(toRemove);

										keyToIndex.set(lastKey, toRemove);
										indexToKey.set(toRemove, lastKey);
										indexToKey.delete(data.length - 1);

										data.pop();
									}
								}
							}
							// const chunk = Chunk.fromIterable(diffs);
							// return Effect.succeed(chunk);
						},
						{
							prefix: options.prefix,
							initialValuesInFirstDiff: true
						}
					);
				});
				return {
					get data() {
						return refine ? refine(data) : data;
					},
					get ready() {
						return ready;
					}
				} as
					| {
							data: undefined;
							ready: false;
					  }
					| {
							data: S['Type'][];
							ready: true;
					  };
				// TODO: there's definitely a way to do this with RX / Streams / SubscriptionRefs fun.
				// const s = Stream.async((emit) => {
				// 	replicache.experimentalWatch(
				// 		(diffs) => {
				// 			const chunk = Chunk.fromIterable(diffs);
				// 			return emit(Effect.succeed(chunk));
				// 		},
				// 		{
				// 			prefix: options.prefix,
				// 			initialValuesInFirstDiff: true
				// 		}
				// 		// {
				// 		// 	indexName: 'test'
				// 		// }
				// 	);
				// });
				// return s;

				// const a = replicache.subscribe(
				// 	async (tx) => {
				// 		const x = Stream.fromAsyncIterable(
				// 			tx.scan(),
				// 			(e) => new ReplicacheScanError({ message: String(e) })
				// 		);
				//         return x;
				// 		const entries = await tx.scan().entries().toArray();
				// 		console.log({ entries });
				// 		return entries;
				// 	},
				// 	(items) => {
				// 		console.log({ items });
				//         return items
				// 	}
				// );

				// return data;
			});

		return {
			scan
			// stream
		} as const;
	});
