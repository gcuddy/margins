// desired api:
// db.entry.join(bookmark).
// db.entry.join(bookmark).
//

import type { Schema } from '@effect/schema';
import { Entry } from '@margins/api2/src/Domain/Entry';
import type { Replicache } from 'replicache';
// import { Store as SvelteStore } from '../store.svelte';

export class DBProxyHandler<T extends object> implements ProxyHandler<T> {}

// declare const rep: Replicache;
//
//
type Schemas = Record<string, Schema.Schema.AnyNoContext & { key: string }>;

type Nullable<T> = T | null | undefined;

type Impl<Models extends Schemas> = {
	[K in keyof Models]: {
		sortBy: <F extends keyof Models[K]['Type']>(
			field: F,
			order: 'asc' | 'desc' | ((a: Models[K]['Encoded'][F], b: Models[K]['Encoded'][F]) => number)
		) => Impl<Models>[K];
		where: <F extends keyof Models[K]['Type']>(
			field: F,
			operator: Models[K]['Encoded'][F] extends number | Nullable<number>
				? '>' | '<' | '=' | '>=' | '<='
				: '=' | '!=',
			value: Models[K]['Encoded'][F] extends Nullable<number>
				? NonNullable<Models[K]['Encoded'][F]>
				: Models[K]['Encoded'][F]
		) => Impl<Models>[K];
		execute: () => Models[K]['Type'][];
	};
};

interface Store<T = unknown> {
	put: (records: T[]) => void;
	remove: (ids: string[]) => void;
	get: (id: string) => T;
	getAll: () => T[];
}

export type Newable<T> = { new (...args: unknown[]): T };

// TODO: make adapters for Effect Schema, Zod, etc.
export function createReplicache<R extends Replicache, Models extends Schemas>(
	rep: R,
	models: Models,
	Store: Newable<Store>
	// Store: Newable<Store<Models[keyof Models]['Type']>>
) {
	const unsubscribe = rep.experimentalWatch((diffs) => {
		for (const diff of diffs) {
			if (diff.op === 'add') {
				// build indez
			} else if (diff.op === 'change') {
				// do something elsej
			} else {
				// it's a del
			}
		}
	});

	const proxy = new Proxy<Impl<Models>>({} as Impl<Models>, {
		get(target, prop) {
			if (typeof prop === 'string' && prop in models) {
				const store = new Store();
				// TODO: make it generalizable for other frameworks beyond svelte?? some sort of adapter...
				// TODO: move to its own class with own state management
				const unsubscribe = rep.experimentalWatch(
					(diffs) => {
						for (const diff of diffs) {
							if (diff.op === 'add' || diff.op === 'change') {
								// build index
								store.put([diff.newValue]);
							} else {
								store.remove([diff.key]);
								// it's a del
							}
						}
					},
					{
						prefix: models[prop].key,
						initialValuesInFirstDiff: true
					}
				);
				class QueryBuilder<T> {
					private sortFields: Array<{
						field: keyof T;
						order: 'asc' | 'desc' | ((a: T[keyof T], b: T[keyof T]) => number);
					}> = [];
					private whereConditions: Array<{ field: keyof T; operator: string; value: unknown }> = [];

					constructor(private store: Store) {}

					sortBy<F extends keyof T>(
						field: F,
						order: 'asc' | 'desc' | ((a: T[F], b: T[F]) => number)
					) {
						this.sortFields.push({ field, order: order as 'asc' });
						return this;
					}

					where<F extends keyof T>(field: F, operator: string, value: T[F]) {
						this.whereConditions.push({ field, operator, value });
						return this;
					}

					execute(): T[] {
						let result = this.store.getAll() as T[];

						// Apply where conditions
						for (const condition of this.whereConditions) {
							result = result.filter((item) => {
								const itemValue = item[condition.field];
								switch (condition.operator) {
									case '>':
										return typeof itemValue === 'number' && typeof condition.value === 'number'
											? itemValue > condition.value
											: false;
									case '<':
										return typeof itemValue === 'number' && typeof condition.value === 'number'
											? itemValue < condition.value
											: false;
									case '>=':
										return typeof itemValue === 'number' && typeof condition.value === 'number'
											? itemValue >= condition.value
											: false;
									case '<=':
										return typeof itemValue === 'number' && typeof condition.value === 'number'
											? itemValue <= condition.value
											: false;
									case '===':
										return itemValue === condition.value;
									default:
										return true;
								}
							});
						}

						// Apply sort
						for (const { field, order } of this.sortFields.reverse()) {
							result.sort((a, b) => {
								const aValue = a[field];
								const bValue = b[field];
								if (typeof order === 'function') {
									return order(aValue, bValue);
								}
								if (aValue < bValue) return order === 'asc' ? -1 : 1;
								if (aValue > bValue) return order === 'asc' ? 1 : -1;
								return 0;
							});
						}

						return result;
					}
				}

				return new QueryBuilder(store);

				// const impl: Impl<Models>[string] = {
				// 	sortBy: (field, order) => new QueryBuilder(store).sortBy(field, order),
				// 	where: (field, operator, value) => new QueryBuilder(store).where(field, operator, value),
				// 	execute: () => new QueryBuilder(store).execute()
				// };
				// return impl;
			}
			throw new Error(`Unknown property: ${String(prop)}`);
		}
	});

	// TODO: write wrapper for svelte etc to use this
	// TODO: incorporate with Effect?
	return [proxy, unsubscribe] as const;
}

const models = {
	entry: Entry
} as const satisfies Schemas;

declare const rep: Replicache;

class SvelteStore implements Store {
	put() {}
	remove() {}
	get() {
		return {};
	}
	getAll() {
		return [];
	}
}

const [db] = createReplicache(rep, models, SvelteStore);

const a = db.entry.where('duration', '>', 1000).sortBy('createdAt', 'desc').execute();
