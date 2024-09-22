/* eslint-disable require-yield */
import { Replicache } from './Replicache';
import { Chunk, Effect, Either, Option, Stream, SubscriptionRef } from 'effect';
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
export const makeReplicacheRepository = <S extends Model.AnyNoContext & { key: string }>(
	model: S,
	options?: {
		prefix?: string;
		indexName?: string;
	}
) =>
	Effect.gen(function* () {
		const replicache = yield* Replicache;
		// const array = Schema.Array(model);
		// const decode = Schema.decodeUnknownSync(array);
		const decodeItem = Schema.decodeUnknownEither(model);

		// TODO: make this use Effect.Stream
		// TODO: maybe refine should be called on each? also maybe schema.array instead of call on eacH?
		const scan = (refine?: (values: S['Type'][]) => S['Type'][]) =>
			Effect.gen(function* () {
				let data = $state<S['Type'][]>([]);
				let ready = $state(false);
				yield* Effect.log(`Scanning ${model.key}`);
				// hash maps?
				const keyToIndex = new Map<string, number>();
				const indexToKey = new Map<number, string>();

				yield* Effect.sync(() => {
					$effect(() =>
						replicache.experimentalWatch(
							(diffs) => {
								// fast initial diff if we haven't seen diffs
								if (!ready) {
									const values: S['Type'][] = [];
									for (const diff of diffs) {
										if (diff.op === 'add') {
											// const value = decode(diff.newValue);
											// TODO: properly decode
											const value = decodeItem(diff.newValue);
											if (Either.isRight(value)) {
												const index = values.push(value.right);
												keyToIndex.set(diff.key, index - 1);
												indexToKey.set(index - 1, diff.key);
											} else {
												// TODO: send to open telemetry / sentry
												console.error(value);
											}
										}
									}
									ready = true;
									console.log('ready', ready);
									console.log('setting data', values);
									data = values;
								} else {
									for (const diff of diffs) {
										if (diff.op === 'add') {
											// const value = decode(diff.newValue);
											// TODO: properly decode
											const value = decodeItem(diff.newValue);
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
											const value = decodeItem(diff.newValue);
											if (Either.isRight(value)) {
												// data[keyToIndex.get(diff.key)!] = value.right;
												// TODO: don't use solidjs?
												data[index!] = reconcile(value.right)(unwrap(data[index!]));
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
							},
							{
								prefix: model.key,
								indexName: options?.indexName,
								initialValuesInFirstDiff: true
							}
						)
					);
				});

				yield* Effect.log(`Scanning ${model.key} complete`);
				return {
					get data() {
						return refine ? refine(data) : data;
					},
					get ready() {
						return ready;
					}
				};
				// return {
				// 	get data() {
				// 		return refine ? refine(data) : data;
				// 	},
				// 	get ready() {
				// 		return ready;
				// 	}
				// } as
				// 	| {
				// 			data: undefined;
				// 			ready: false;
				// 	  }
				// 	| {
				// 			data: S['Type'][];
				// 			ready: true;
				// 	  };
			}).pipe(Effect.withLogSpan('replicache-scan'));

		const get = (id: string) =>
			Effect.gen(function* () {
				let data = $state({} as Option.Option<S['Type']>);
				let ready = $state(false);
				yield* Effect.log(`Getting ${model.key} ${id}`);
				$effect(() =>
					replicache.experimentalWatch(
						(diffs) => {
							for (const diff of diffs) {
								if (diff.op === 'add') {
									const value = decodeItem(diff.newValue);
									Either.match(value, {
										onRight: (value) => {
											data = Option.some(value);
										},
										onLeft: (error) => {
											console.error('parse error', error);
										}
									});
								}
								if (diff.op === 'change') {
									const value = decodeItem(diff.newValue);
									Either.match(value, {
										onRight: (value) => {
											Option.match(data, {
												onSome: (d) => {
													data = reconcile(value)(unwrap(d));
												},
												onNone: () => {
													data = Option.some(value);
												}
											});
										},
										onLeft: (error) => {
											console.error('parse error', error);
										}
									});
								}
								if (diff.op === 'del') {
									data = Option.none();
								}
							}
							ready = true;
						},
						{
							prefix: `${model.key}/${id}`,
							initialValuesInFirstDiff: true
						}
					)
				);
				return {
					get data() {
						return data;
					},
					get ready() {
						return ready;
					}
				};
			});

		const streamSubscriptionRef = () =>
			Effect.gen(function* () {
				const ref = yield* SubscriptionRef.make<S['Type'][]>([]);

				// Stream.runDrain;

				$effect(() => {
					let unsubscribe: (() => void) | undefined = undefined;

					unsubscribe = replicache.experimentalWatch((diffs) => {
						SubscriptionRef.update(ref, (data) => {
							for (const diff of diffs) {
								if (diff.op === 'add') {
									data.push(diff.newValue);
								}
							}
							return data;
						});
					});

					// Stream.async((emit) => {
					// 	unsubscribe = replicache.experimentalWatch((diffs) => {
					// 		emit(Effect.succeed(Chunk.of(diffs)));
					// 	});
					// });

					return unsubscribe;
				});

				return ref;
			});
		return {
			get,
			scan,
			streamSubscriptionRef
			// stream
		} as const;
	});
