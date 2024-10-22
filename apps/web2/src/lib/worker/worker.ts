import * as Runner from '@effect/platform/WorkerRunner';
import * as BrowserRunner from '@effect/platform-browser/BrowserWorkerRunner';
import { Requests, SearchError } from './schema';
import { Console, Effect, Layer, Option, pipe } from 'effect';
import { Schema } from '@effect/schema';
import { Entry } from '@margins/api2/src/Domain/Entry';
import { Replicache } from '$lib/services/Replicache';
import { create, insert, remove, update, search } from '@orama/orama';
// import { Highlight } from '@orama/highlight';

const decode = Schema.decodeUnknownEither(Entry);

const makeSearchIndex = Effect.gen(function* () {
	const replicache = yield* Replicache;
	const db = create({
		schema: {
			// for now, let's do this...
			title: 'string',
			author: 'string',
			text: 'string',
			image: 'string'
		}
	});

	const u = replicache.experimentalWatch(
		(diffs) => {
			for (const diff of diffs) {
				if (diff.op === 'add' || diff.op === 'change') {
					const decoded = decode(diff.newValue);
					if (decoded._tag === 'Right') {
						if (diff.op === 'add') {
							insert(db, {
								id: decoded.right.id,
								author: decoded.right.author.pipe(Option.getOrUndefined),
								text: decoded.right.text.pipe(Option.getOrUndefined),
								title: decoded.right.title.pipe(Option.getOrUndefined),
								image: decoded.right.image.pipe(Option.getOrUndefined)
							});
						} else {
							update(db, diff.key, {
								id: decoded.right.id,
								author: decoded.right.author.pipe(Option.getOrUndefined),
								text: decoded.right.text.pipe(Option.getOrUndefined),
								title: decoded.right.title.pipe(Option.getOrUndefined),
								image: decoded.right.image.pipe(Option.getOrUndefined)
							});
						}
					}
				} else {
					const decoded = decode(diff.oldValue);
					if (decoded._tag === 'Right') {
						remove(db, decoded.right.id);
					} else {
						remove(db, diff.key);
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

	return { db } as const;
});

export class SearchIndex extends Effect.Service<SearchIndex>()('SearchIndex', {
	scoped: makeSearchIndex,
	dependencies: [Replicache.Default]
}) {}

// todo: finalizers etc

// // TODO: effectify
// function createIndex() {}

Runner.layerSerialized(Requests, {
	Search: ({ q }) =>
		Effect.gen(function* () {
			yield* Effect.log('SEARCHING FROM A WORKER!');
			const { db } = yield* SearchIndex;
			if (q.trim().length === 0) {
				return {
					count: 0,
					hits: [],
					elapsed: {
						formatted: '0.00ms',
						raw: 0
					}
				};
			}
			const results =
				yield *
				Effect.tryPromise({
					try: async () => {
						const searchResult = await search(db, {
							term: q,
							properties: ['author', 'title', 'text'],
							boost: {
								author: 2,
								title: 3
							},
							threshold: 0.5
						});
						return searchResult;
					},
					catch: () => new SearchError()
				});
			return results;
		}),
	InitialMessage: () =>
		Effect.gen(function* () {
			console.log('Hello from worker');
			const { db } = yield* SearchIndex;
			console.log({ db });
		})
}).pipe(
	Layer.provide(BrowserRunner.layer),
	Layer.provide(SearchIndex.Default),
	Layer.launch,
	Effect.runPromise
);
