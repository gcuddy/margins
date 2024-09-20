import { Effect, Layer } from 'effect';

const make = Effect.gen(function* () {
	const effect = null;

	// Desired output { watch, scan, get } etc and can build that here as effects. From Replicache. Helper to make it a store like Model.makeRepository.

	return {
		effect
	} as const;
});

export class Entries extends Effect.Tag('Entries')<Entries, Effect.Effect.Success<typeof make>>() {
	static Live = Layer.effect(Entries, make);
}
