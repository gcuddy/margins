import {
	type CompiledQuery,
	type Insertable,
	type InsertResult,
	type Kysely,
	sql,
	type Transaction,
} from 'kysely';

import { db, json } from '$lib/db';
import { entrySelect } from '$lib/db/selects';
import type { GetCtx } from '$lib/db/types';
import { nanoid } from '$lib/nanoid';
import type parse from '$lib/parse';
import type { Bookmark, DB } from '$lib/prisma/kysely/types';
import type { bookmarkCreateInput } from '$lib/schemas/inputs/bookmark.schema';
import { isValidUrl } from '$lib/utils';

// TODO: this function combies logic of bookmark/entry, and maybe should be split up

export async function bookmarkCreate({
	ctx,
	input,
}: GetCtx<typeof bookmarkCreateInput>) {
	const {
		event: { fetch },
		userId,
	} = ctx;
	const { collection, relatedEntryId, status, url } = input;
	let { entryId } = input;

	if (url && !isValidUrl(url)) {
		// TODO: handle this case with ISBN, etc.
		throw new Error('Invalid URL');
	}

	if (!entryId && url) {
		const existingEntry = await db
			.selectFrom('Entry as e')
			.select(entrySelect)
			.where('uri', '=', url)
			.executeTakeFirst();

		if (!existingEntry && url) {
			const res = await fetch(`/api/parse/${encodeURIComponent(url)}`);
			if (!res.ok) {
				throw new Error(res.statusText);
			}

			const { url: _url, ...rest } = (await res.json()) as Awaited<
				ReturnType<typeof parse>
			>;

			const { insertId } = await db
				.insertInto('Entry')
				.values({
					updatedAt: new Date(),
					...rest,
					original: rest.original ? json(rest.original) : null,
					podcastIndexId: rest.podcastIndexId
						? Number(rest.podcastIndexId)
						: null,
					uri: url,
				})
				.ignore()
				.executeTakeFirst();

			entryId = Number(insertId);
		}
	}

	if (!entryId) {
		throw new Error('Could not create or retrieve entry');
	}

	await db.transaction().execute(async (trx) => {
		if (!entryId) {
			throw new Error('entryId is undefined');
		}
		const _entryId = entryId;

		if (status) {
			const q = createCompiledInsertBookmarkQuery(trx, {
				entryId: _entryId,
				status,
				updatedAt: new Date(),
				userId,
			});
			await trx.executeQuery(q);
		}

		if (collection) {
			await trx
				.insertInto('CollectionItems')
				.values({
					collectionId: collection.collectionId,
					entryId: _entryId,
					id: collection.id ?? nanoid(),
					updatedAt: new Date(),
				})
				.execute();
		}

		if (!relatedEntryId) {
			return;
		}
		await trx
			.insertInto('Relation')
			.values({
				entryId,
				id: nanoid(),
				relatedEntryId,
				updatedAt: new Date(),
				userId,
			})
			.execute();
	});

	// return entry we inserted

	return await db
		.selectFrom('Entry as e')
		.select(entrySelect)
		.where('id', '=', entryId)
		.executeTakeFirst();

	// TODO: Return payload
}

/**
 * Create a compiled query for inserting a bookmark, and sorts it to the top of the list.
 * @param insertable
 * @returns
 */

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

	return _db
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
		.compile();
}
