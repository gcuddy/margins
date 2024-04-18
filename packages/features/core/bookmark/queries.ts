import {
	sql,
	type CompiledQuery,
	type InsertResult,
	type Insertable,
	type Kysely,
	type Transaction,
} from 'kysely';
import type { DB, Bookmark } from '@margins/db/kysely/types';
import { values } from '@margins/db';

export function createCompiledInsertBookmarkQuery(
	trx: Kysely<DB> | Transaction<DB>,
	insertable: Insertable<Bookmark>,
): CompiledQuery<InsertResult> {
	const columns = Object.keys(insertable) as ReadonlyArray<
		keyof DB['Bookmark']
	>;

	console.log('inserting bookmark');

	return (
		trx
			.insertInto('Bookmark')
			.columns([...columns, 'sort_order'])
			.expression((eb) =>
				eb
					.selectFrom('Bookmark')
					.select(({ ref }) => [
						...columns.map((c) => sql`${insertable[c]}`.as(c)),
						sql`coalesce(min(${ref('sort_order')}), 0) - 100`.as('sort_order'),
					]),
			)
			// Bump to top
			// TODO: should this be an option?
			.onDuplicateKeyUpdate(({ ref }) => ({
				sort_order: values(ref('sort_order')),
			}))
			.compile()
	);
}
