/* eslint-disable require-yield */
import * as Runner from '@effect/platform/WorkerRunner';
import * as BrowserRunner from '@effect/platform-browser/BrowserWorkerRunner';
import { Requests } from './schema';
import { Effect, Layer, Option } from 'effect';
import FlexSearch from 'flexsearch';
import { Replicache } from 'replicache';
import { Schema } from '@effect/schema';
import { Entry } from '@margins/api2/src/Domain/Entry';

const index = new FlexSearch.Index({ tokenize: 'forward' });
const replicache = new Replicache({
	name: 'n0za7qlnp1rca3s',
	licenseKey: 'ld43a69e6baa14a1a85eb6bb09661739e'
});

const decode = Schema.decodeUnknownEither(Entry);

// todo: finalizers etc
replicache.experimentalWatch(
	(diffs) => {
		for (const diff of diffs) {
			if (diff.op === 'add') {
				const decoded = decode(diff.newValue);
				if (decoded._tag === 'Right') {
					if (Option.isSome(decoded.right.title)) {
						index.add(diff.key, decoded.right.title.value);
					}
				}
			}
		}
	},
	{
		prefix: 'entries',
		initialValuesInFirstDiff: true
	}
);

// // TODO: effectify
// function createIndex() {}

Runner.layerSerialized(Requests, {
	Search: ({ q }) =>
		Effect.gen(function* () {
			yield* Effect.log('SEARCHING FROM A WORKER!');
			const x = index.search(q);
			// TODO: find first slash etc.

			const output: Entry[] = [];
			return x;
		}),
	InitialMessage: () =>
		Effect.gen(function* () {
			console.log('Hello from worker');
		})
}).pipe(Layer.provide(BrowserRunner.layer), Layer.launch, Effect.runPromise);
