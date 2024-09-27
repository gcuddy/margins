/* eslint-disable require-yield */
import { Annotations } from '$lib/services/Annotations';
import { Context, Effect, Layer } from 'effect';
import * as R from 'replicache';

const make = Effect.gen(function* () {
	// TODO: make this a config
	// const annotations = yield* Annotations;
	const replicache = new R.Replicache({
		name: 'n0za7qlnp1rca3s',
		licenseKey: 'ld43a69e6baa14a1a85eb6bb09661739e',
		pullURL: 'http://0.0.0.0:3030/sync/pull',
		pushURL: 'http://0.0.0.0:3030/sync/push',

		auth: 'Bearer mnywTdF8-3wdpuCz4lj-ZFiY6',
		logLevel: 'debug',
		mutators: {
			a: (tx: R.WriteTransaction, input: { text: string }) => {}
		}
	});

	return replicache;
});

// TODO: mutators
// TODO: live
export class Replicache extends Context.Tag('Replicache')<
	Replicache,
	Effect.Effect.Success<typeof make>
>() {
	static Live = Layer.effect(Replicache, make);
}
