import { makeRepo } from '$lib/services/replicache-store.svelte';
import { Effect, Layer, Stream } from 'effect';

import { Annotation } from '@margins/api2/src/Domain/Annotation';
import { Rx } from '@effect-rx/rx';
import { makeReplicacheRepository } from '../../routes/(app)/profile/model.svelte';
import { Replicache } from '../../routes/(app)/profile/Replicache';

const make = Effect.gen(function* () {
	const repo = yield * makeRepo(Annotation);

	return {
		...repo
	} as const;
});

export class Annotations extends Effect.Tag('Annotations')<
	Annotations,
	Effect.Effect.Success<typeof make>
>() {
	static Live = Layer.scoped(Annotations, make).pipe(Layer.provide(Replicache.Live));
}

export const annotationsRuntime = Rx.runtime(Annotations.Live);

// export const annotations = annotationsRuntime.rx(Annotations.stream());
export const annotations = annotationsRuntime.pull(Stream.unwrap(Annotations.stream));
export const annotationsEffect = annotationsRuntime.rx(Annotations.scan);

// export const addAnnotation = annotationsRuntime.rx(Annotations.put())
