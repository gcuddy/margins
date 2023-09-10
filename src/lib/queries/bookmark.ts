import { type Insertable, sql } from 'kysely';

import { db, json } from '$lib/db';
import { entrySelect } from '$lib/db/selects';
import type { GetCtx } from '$lib/db/types';
import { nanoid } from '$lib/nanoid';
import type parse from '$lib/parse';
import type { Bookmark, DB } from '$lib/prisma/kysely/types';
import type { bookmarkCreateInput } from '$lib/schemas/inputs/bookmark.schema';
import { isValidUrl } from '$lib/utils';

export async function bookmarkCreate({
	ctx,
	input,
}: GetCtx<typeof bookmarkCreateInput>) {
	const {
		event: { fetch },
		userId,
	} = ctx;
	const { relatedEntryId, status, url } = input;

	if (!isValidUrl(url)) {
		// TODO: handle this case with ISBN, etc.
		throw new Error('Invalid URL');
	}

	const existingEntry = await db
		.selectFrom('Entry as e')
		.select(entrySelect)
		.where('uri', '=', url)
		.executeTakeFirst();

	let entryId: number | undefined = existingEntry?.id;

	if (!existingEntry) {
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

	if (!entryId) {
		throw new Error('Could not create or retrieve entry');
	}

	await db.transaction().execute(async (trx) => {
		if (!entryId) {
			throw new Error('entryId is undefined');
		}
		const _entryId = entryId;
		await trx
			.insertInto('Bookmark')
			.columns(['entryId', 'sort_order', 'updatedAt', 'userId'])
			.expression((eb) =>
				eb
					.selectFrom('Bookmark')
					.select(({ ref }) => [
						sql`${_entryId}`.as('entryId'),
						sql`min(${ref('sort_order')}) - 100`.as('sort_order'),
						sql`${new Date()}`.as('updatedAt'),
						sql`${userId}`.as('userId'),
					]),
			)
			.execute();
		// await trx
		// 	.insertInto('Bookmark')
		// 	.values(({ selectNoFrom }) => ({
		// 		entryId,
		// 		sort_order: selectNoFrom(({ ref }) =>
		// 			sql<number>`min(${ref('sort_order')}) - 100`.as('sort_order'),
		// 		)
		// 			.where('Bookmark.status', '=', status)
		// 			.where('Bookmark.userId', '=', userId),
		// 		updatedAt: new Date(),
		// 		userId,
		// 	}))
		// 	.execute();

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

	// TODO: Return payload
}

/**
 * Create a compiled query for inserting a bookmark, and sorts it to the top of the list.
 * @param insertable
 * @returns
 */
export function createCompiledInsertBookmarkQuery(
	insertable: Insertable<Bookmark>,
) {
	const columns = Object.keys(insertable) as ReadonlyArray<
		keyof DB['Bookmark']
	>;

	return db
		.insertInto('Bookmark')
		.columns(columns)
		.expression((eb) =>
			eb
				.selectFrom('Bookmark')
				.select(({ ref }) => [
					...columns.map((c) => sql`${insertable[c]}`.as(c)),
					sql`min(${ref('sort_order')}) - 100`.as('sort_order'),
					sql`${new Date()}`.as('updatedAt'),
				]),
		)
		.compile();
}
