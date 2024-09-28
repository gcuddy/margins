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
	pipe,
	Sink,
	Stream,
	SubscriptionRef
} from 'effect';
import { Replicache } from '../../routes/(app)/profile/Replicache';
import * as R from 'replicache';
import { Rx } from '@effect-rx/rx';
import type { Model } from '@effect/sql';
import { Schema } from '@effect/schema';
import { unwrap } from 'effect/Config';
import { reconcile } from 'solid-js/store';

export const makeRepo = <S extends Model.AnyNoContext & { key: string }>(model: S) =>
	Effect.gen(function* () {
		const replicache = yield* Replicache;
		const rep = yield* ReplicacheStream;

		const decode = Schema.decodeUnknownOption(model);

		const ref = yield* SubscriptionRef.make(Array.empty<S['Type']>());

		// Maybe make this mutable?
		const keyToIndex = HashMap.empty<string, number>();
		const indexToKey = HashMap.empty<number, string>();

		const stream = rep.content;
		// TODO: what's the effect-y way to do this
		// TODO: can we make it not be svelte-y, but effect-y?
		const scan = () =>
			Effect.gen(function* () {
				const data = $state(Array.empty<S['Type']>());

				console.log('scanning');

				stream.pipe(
					Stream.runForEach((diff) =>
						Effect.gen(function* () {
							// Make this more effect-y
							if (diff.op === 'add') {
								console.log('adding', diff);
								const value = decode(diff.newValue);
								console.log('adding', value);
								Option.match(value, {
									onSome: (value) => {
										const index = data.push(value);
										HashMap.set(keyToIndex, diff.key, index - 1);
										HashMap.set(indexToKey, index - 1, diff.key);
									},
									onNone: () => Console.error(value)
								});
							} else if (diff.op === 'change') {
								const index = HashMap.get(keyToIndex, diff.key);
								Option.all([index, decode(diff.newValue)]).pipe(
									Option.match({
										onSome: ([index, value]) => {
											data[index] = reconcile(value)(unwrap(data[index]));
										},
										onNone: () => {}
									})
								);
							} else if (diff.op === 'del') {
								const toRemove = HashMap.get(keyToIndex, diff.key);
								const last = Array.tail(data);
								const lastKey = HashMap.get(indexToKey, data.length - 1);
								Option.match(Option.all([toRemove, last, lastKey]), {
									onNone: () => Console.warn('Got a del with no index'),
									onSome: ([toRemove, last, lastKey]) => {
										data[toRemove] = last;
										HashMap.remove(keyToIndex, diff.key);
										HashMap.remove(indexToKey, toRemove);

										HashMap.set(keyToIndex, lastKey, toRemove);
										HashMap.set(indexToKey, toRemove, lastKey);
										HashMap.remove(indexToKey, data.length - 1);

										data.pop();
									}
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
				return data;
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
			put
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
				initialValuesInFirstDiff: true,
				prefix: 'entries'
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
