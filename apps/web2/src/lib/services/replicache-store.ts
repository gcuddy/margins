/* eslint-disable require-yield */
import {
	Array,
	Chunk,
	Console,
	Effect,
	HashMap,
	Layer,
	Option,
	Stream,
	SubscriptionRef
} from 'effect';
import { Replicache } from '../../routes/(app)/profile/Replicache';
import * as R from 'replicache';
import { Rx } from '@effect-rx/rx';
import type { Model } from '@effect/sql';
import { Schema } from '@effect/schema';

export const makeRepo = <S extends Model.AnyNoContext & { key: string }>(model: S) =>
	Effect.gen(function* () {
		// const replicache = yield * Replicache;
		const rep = yield* ReplicacheStream;

		const decode = Schema.decodeUnknownOption(model);

		// Maybe make this mutable?
		const keyToIndex = HashMap.empty<string, number>();
		const indexToKey = HashMap.empty<number, string>();

		const stream = rep.content;
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
