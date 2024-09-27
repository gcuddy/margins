/* eslint-disable require-yield */
import * as Runner from '@effect/platform/WorkerRunner';
import * as BrowserRunner from '@effect/platform-browser/BrowserWorkerRunner';
import { Requests } from './schema';
import { Console, Effect, Layer, Option, pipe } from 'effect';
import FlexSearch from 'flexsearch';
// import { Replicache } from 'replicache';
import { Schema } from '@effect/schema';
import { Entry } from '@margins/api2/src/Domain/Entry';
import { Replicache } from '../../routes/(app)/profile/Replicache';

// const index = new FlexSearch.Index({ tokenize: 'forward' });
// // const replicache = new Replicache({
// // 	name: 'n0za7qlnp1rca3s',
// // 	licenseKey: 'ld43a69e6baa14a1a85eb6bb09661739e'
// // });

const decode = Schema.decodeUnknownEither(Entry);

const makeSearchIndex = Effect.gen(function* () {
	const replicache = yield* Replicache;
	const index = new FlexSearch.Index({ tokenize: 'forward' });

	const u = replicache.experimentalWatch(
		(diffs) => {
			for (const diff of diffs) {
				if (diff.op === 'add') {
					const decoded = decode(diff.newValue);
					if (decoded._tag === 'Right') {
						let search = '';
						if (Option.isSome(decoded.right.title)) {
							search = decoded.right.title.value;
						}
						if (Option.isSome(decoded.right.author)) {
							search += ' ' + decoded.right.author.value;
						}
						if (Option.isSome(decoded.right.text)) {
							search += ' ' + decoded.right.text.value;
						}
						index.add(diff.key, search);
					}
				}
			}
		},
		{
			prefix: 'entries',
			initialValuesInFirstDiff: true
		}
	);

	yield* Effect.addFinalizer((exit) => {
		return pipe(
			Effect.sync(() => u()),
			Effect.tap(() => Console.log('running rep finalizer for initialmessage', exit))
		);
	});

	return { index } as const;
});

export class SearchIndex extends Effect.Tag('SearchIndex')<
	SearchIndex,
	Effect.Effect.Success<typeof makeSearchIndex>
>() {
	static Live = Layer.scoped(SearchIndex, makeSearchIndex).pipe(Layer.provide(Replicache.Live));
}

// todo: finalizers etc

// // TODO: effectify
// function createIndex() {}

Runner.layerSerialized(Requests, {
	Search: ({ q }) =>
		Effect.gen(function* () {
			yield* Effect.log('SEARCHING FROM A WORKER!');
			const { index } = yield * SearchIndex;
			console.log({ index });
			const x = index.search(q) as string[];
			return x;
		}),
	InitialMessage: () =>
		Effect.gen(function* () {
			console.log('Hello from worker');
			const { index } = yield * SearchIndex;
			console.log({ index });

			// const u = replicache.experimentalWatch(
			// 	(diffs) => {
			// 		for (const diff of diffs) {
			// 			if (diff.op === 'add') {
			// 				const decoded = decode(diff.newValue);
			// 				if (decoded._tag === 'Right') {
			// 					if (Option.isSome(decoded.right.title)) {
			// 						index.add(diff.key, decoded.right.title.value);
			// 					}
			// 				}
			// 			}
			// 		}
			// 	},
			// 	{
			// 		prefix: 'entries',
			// 		initialValuesInFirstDiff: true
			// 	}
			// );

			// yield *
			// 	Effect.addFinalizer((exit) => {
			// 		return pipe(
			// 			Effect.sync(() => u()),
			// 			Effect.tap(() => Console.log('running rep finalizer for initialmessage', exit))
			// 		);
			// 	});
		})
}).pipe(
	Layer.provide(BrowserRunner.layer),
	Layer.provide(SearchIndex.Live),
	Layer.launch,
	Effect.runPromise
);
