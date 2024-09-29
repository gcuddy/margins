// reactive class svelte store, similar to tldraw. maybe use effect for this? optimize for perf.
//
//

import type { Schema } from '@effect/schema';
import { Effect, Record } from 'effect';

export class Store<Schema extends Schema.Schema<{ id: string }, any, never>> {
	public readonly id: string;
	schema: Schema;
	atoms = $state(Record.empty<string, Schema['Type']>());
	arr = $derived.by(() => Object.values(this.atoms));

	// TODO: ref?

	constructor(schema: Schema) {
		this.id = Math.random().toString();
		this.schema = schema;
	}

	put(records: Schema['Type'][]) {
		const atoms = this.atoms;
		console.log('appending', records, 'to', $state.snapshot(atoms));
		return Effect.forEach(
			records,
			(record) =>
				Effect.gen(function* () {
					const has = Record.has(atoms, record.id);
					console.log({ has });
					if (has) {
						// TODO: throw error?
					}
					atoms[record.id] = record;
					// Record.set(atoms, record.id, record);
				}),
			{
				batching: true
			}
		);
	}

	remove(ids: string[]) {
		// Record.remove
		const atoms = this.atoms;
		return Effect.forEach(ids, (id) =>
			Effect.gen(function* () {
				delete atoms[id];
			})
		);
	}

	toArray() {
		const r = $derived.by(() => Record.values(this.atoms));
		return r;
	}
}

// What we need: put, remove, has, modify, merge, and then toArray or something.

// Maybe use Effect?
//

// or do this? yield nanoid etc.
const make = Effect.gen(function* () {});
