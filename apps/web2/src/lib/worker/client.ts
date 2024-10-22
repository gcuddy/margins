import * as Worker from '@effect/platform/Worker';
import * as BrowserWorker from '@effect/platform-browser/BrowserWorker';
import { Effect } from 'effect';
import SearchWorker from './worker?worker';
import { InitialMessage, Search, type Requests } from '$lib/worker/schema';
import { Rx } from '@effect-rx/rx';

const makePool = Worker.makePoolSerialized<Requests>({
	initialMessage: () => new InitialMessage(),
	minSize: 1,
	maxSize: 10,
	timeToLive: 20000,
	concurrency: 5,
	targetUtilization: 0.8
});

// export class Pool extends Context.Tag('app/Pool')<Pool, Effect.Effect.Success<typeof makePool>>() {
// 	static Live = Layer.scoped(this, makePool).pipe(
// 		Layer.provide(BrowserWorker.layer(() => new SearchWorker()))
// 	);
// }
//
export class Pool extends Effect.Service<Pool>()('app/Pool', {
	scoped: makePool,
	dependencies: [BrowserWorker.layer(() => new SearchWorker())]
}) {}

// rx

const runtime = Rx.runtime(Pool.Default);

export const getIdRx = runtime.fn((q: string) => {
	return Pool.pipe(Effect.flatMap((pool) => pool.executeEffect(new Search({ q }))));
});
