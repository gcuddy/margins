// reactive class svelte store, similar to tldraw. maybe use effect for this? optimize for perf.
//
//

import { Schema } from '@effect/schema';
import type { ParseError } from '@effect/schema/ParseResult';
import type { SchemaClass } from '@effect/schema/Schema';
import { Console, Effect, Equal, Option, Record, Ref } from 'effect';
import { reconcile, unwrap } from 'solid-js/store';

export class Store<A extends { id: string }, I> {
	public readonly id: string;
	// dataSchema: SchemaClass<A, I, never>;
	schema: Schema.Schema<A, I, never>;
	atoms = $state(Record.empty<string, A>());
	arr = $derived(Record.values(this.atoms));
	get = (id: A['id']) => {
		console.log('begin get');
		console.log({ id });
		console.log('atoms', $state.snapshot(this.atoms));
		const item = $derived(Record.get(this.atoms, id));

		$inspect({ item });
		return item;
	};
	ref = $state(Ref.make(Record.empty<string, A>()));
	decode: (u: unknown) => Option.Option<A>;
	encode: (a: A) => Option.Option<I>;
	d: (u: unknown) => Effect.Effect<A, ParseError, never>;

	// TODO: ref?

	constructor(schema: Schema.Schema<A, I, never>) {
		this.id = Math.random().toString();
		// TODO: this would work for equals.equals but results in errors
		// const dataSchema = Schema.Data(schema);
		this.schema = schema;
		// this.dataSchema = dataSchema;
		this.decode = Schema.decodeUnknownOption(schema);
		this.d = Schema.decodeUnknown(schema);
		this.encode = Schema.encodeOption(schema);
	}

	put(records: unknown[]) {
		const atoms = this.atoms;
		const decode = this.d;
		// const encode = this.encode;
		return Effect.forEach(records, (record) =>
			Effect.gen(function* () {
				console.log('validating', record);
				const validated = yield* decode(record);
				yield* Console.log({ record, validated });
				const existing = Record.get(atoms, validated.id);
				// check if these are equals
				Option.match(existing, {
					onSome: (recordAtom) => {
						if (Equal.equals(recordAtom, validated)) {
							return;
						}
						// TODO: can we do this ourselves with equals?
						const updatedValue = reconcile(validated)(unwrap(recordAtom));
						atoms[validated.id] = updatedValue;
					},
					onNone: () => {
						atoms[validated.id] = validated;
					}
				});
				console.log('finished put');
				console.log($state.snapshot(atoms));
			}).pipe(Effect.catchTag('ParseError', Effect.logError), Effect.withLogSpan('Store.put'))
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
