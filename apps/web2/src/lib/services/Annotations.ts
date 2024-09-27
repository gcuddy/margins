import { makeRepo } from '$lib/services/replicache-store';
import { Effect, Layer, Stream } from 'effect';

import { Annotation } from '@margins/api2/src/Domain/Annotation';
import { Rx } from '@effect-rx/rx';
import { makeReplicacheRepository } from '../../routes/(app)/profile/model.svelte';

const make = Effect.gen(function* () {
	const repo = yield* makeReplicacheRepository(Annotation);

	return {
		...repo
	} as const;
});

export class Annotations extends Effect.Tag('Annotations')<
	Annotations,
	Effect.Effect.Success<typeof make>
>() {
	static Live = Layer.effect(Annotations, make);
}

// export const annotationsRuntime = Rx.runtime(Annotations.Live);

// export const annotations = annotationsRuntime.pull(Stream.unwrap(Annotations.stream()));

// export const addAnnotation = annotationsRuntime.rx(Annotations.put())
