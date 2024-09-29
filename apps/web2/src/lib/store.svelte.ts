// reactive class svelte store, similar to tldraw. maybe use effect for this? optimize for perf.
//
//

import { Schema } from '@effect/schema';
import type { SchemaClass } from '@effect/schema/Schema';
import { Console, Effect, Equal, Option, Record, Ref } from 'effect';
import { reconcile, unwrap } from 'solid-js/store';

export class Store<
	A extends { id: string },
	I extends readonly any[],
	Schema extends Schema.Schema<A, I, never>
> {
	public readonly id: string;
	schema: SchemaClass<A, I, never>;
	private atoms = $state(Record.empty<string, A>());
	arr = $derived(Record.values(this.atoms));
	ref = $state(Ref.make(Record.empty<string, A>()));
	decode: (u: unknown) => Option.Option<A>;
	encode: (a: A) => Option.Option<I>;

	// TODO: ref?

	constructor(schema: Schema) {
		this.id = Math.random().toString();
		const dataSchema = Schema.Data(schema);
		this.schema = dataSchema;
		this.decode = Schema.decodeUnknownOption(dataSchema);
		this.encode = Schema.encodeOption(dataSchema);
	}

	put(records: Schema['Type'][]) {
		const atoms = this.atoms;
		const decode = this.decode;
		// const encode = this.encode;
		return Effect.forEach(records, (record) =>
			Effect.gen(function* () {
				const validated = decode(record);
				yield* Console.log({ record, validated });
				if (Option.isNone(validated)) {
					yield* Effect.logError('Error validating record.', record);
					return;
				}
				const existing = Record.get(atoms, record.id);
				// check if these are equals
				Option.match(existing, {
					onSome: (recordAtom) => {
						if (Equal.equals(recordAtom, validated.value)) {
							return;
						}
						// TODO: can we do this ourselves with equals?
						const updatedValue = reconcile(validated.value)(unwrap(recordAtom));
						atoms[record.id] = updatedValue;
					},
					onNone: () => {
						atoms[record.id] = record;
					}
				});
			})
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
}

// What we need: put, remove, has, modify, merge, and then toArray or something.

// Maybe use Effect?
//

// or do this? yield nanoid etc.
const make = Effect.gen(function* () {});
