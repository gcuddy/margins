import {
	sql,
	type CompiledQuery,
	type InsertResult,
	type Insertable,
	type Kysely,
	type Transaction,
} from 'kysely';
import type { DB, Bookmark } from '@margins/db/kysely/types.js';
import { db, values } from '@margins/db';

export function createCompiledInsertBookmarkQuery(
	dbOrTrx: Kysely<DB> | Transaction<DB>,
	insertable: Insertable<Bookmark>,
): CompiledQuery<InsertResult>;

export function createCompiledInsertBookmarkQuery(
	insertable: Insertable<Bookmark>,
): CompiledQuery<InsertResult>;

export function createCompiledInsertBookmarkQuery(
	dbOrTrxOrInsertable: Kysely<DB> | Transaction<DB> | Insertable<Bookmark>,
	insertable?: Insertable<Bookmark>,
): CompiledQuery<InsertResult> {
	let _insertable: Insertable<Bookmark>;
	let _db: Kysely<DB> | Transaction<DB>;
	if (
		'selectFrom' in dbOrTrxOrInsertable &&
		typeof dbOrTrxOrInsertable.selectFrom === 'function'
	) {
		_db = dbOrTrxOrInsertable;
		_insertable = insertable!;
	} else {
		_db = db;
		_insertable = dbOrTrxOrInsertable as Insertable<Bookmark>;
	}
	const columns = Object.keys(_insertable) as ReadonlyArray<
		keyof DB['Bookmark']
	>;

	return (
		_db
			.insertInto('Bookmark')
			.columns([...columns, 'sort_order'])
			.expression((eb) =>
				eb
					.selectFrom('Bookmark')
					.select(({ ref }) => [
						...columns.map((c) => sql`${_insertable[c]}`.as(c)),
						sql`min(${ref('sort_order')}) - 100`.as('sort_order'),
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
