import * as Runner from '@effect/platform/WorkerRunner';
import * as BrowserRunner from '@effect/platform-browser/BrowserWorkerRunner';
import { Requests, SearchError } from './schema';
import { Console, Effect, Layer, Option, pipe } from 'effect';
import { Schema } from '@effect/schema';
import { Entry } from '@margins/api2/src/Domain/Entry';
import { Replicache } from '$lib/services/Replicache';
import { create, insert, remove, search, update } from '@orama/orama';

const decode = Schema.decodeUnknownEither(Entry);

const makeSearchIndex = Effect.gen(function* () {
	const replicache = yield* Replicache;
	const db = create({
		schema: {
			// for now, let's do this...
			title: 'string',
			author: 'string',
			text: 'string'
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
								id: diff.key,
								author: decoded.right.author.pipe(Option.getOrUndefined),
								text: decoded.right.text.pipe(Option.getOrUndefined),
								title: decoded.right.title.pipe(Option.getOrUndefined)
							});
						} else {
							update(db, diff.key, {
								id: diff.key,
								author: decoded.right.author.pipe(Option.getOrUndefined),
								text: decoded.right.text.pipe(Option.getOrUndefined),
								title: decoded.right.title.pipe(Option.getOrUndefined)
							});
						}
					}
				} else {
					remove(db, diff.key);
				}
			}
		},
		{
			prefix: 'entries',
			initialValuesInFirstDiff: true
		}
	);

	yield *
		Effect.addFinalizer((exit) => {
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
			console.log({ db });
			const results = yield* Effect.tryPromise({
				try: async () => {
					const searchResult = await search(db, { term: q });
					return searchResult;
				},
				catch: () => new SearchError()
			});
			console.log({ results });
			return results.hits.map((hit) => hit.id);
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
