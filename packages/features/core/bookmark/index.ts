import { isValidUrl } from '@margins/lib';
import { zod } from '../utils/zod.js';
import {
	db,
	BookmarkModel,
	CollectionItemsModel,
	EntryModel,
} from '@margins/db';
import { parseUrlToEntry } from '../../index.js';
import { createCompiledInsertBookmarkQuery } from './queries.js';
import { useUser } from '../user.js';
import { nanoid } from 'nanoid';

export const create = zod(
	BookmarkModel.pick({
		entryId: true,
		status: true,
		uri: true,
	})
		.extend({
			collection: CollectionItemsModel.pick({
				collectionId: true,
				id: true,
			}),
			relatedEntryId: EntryModel.shape.id,
		})
		.partial()
		.required({
			uri: true,
		}),
	async (input) => {
		const { collection, relatedEntryId, status, uri } = input;
		let { entryId } = input;

		if (uri && !isValidUrl(uri)) {
			// TODO: handle this case with ISBN, etc.
			throw new Error('Invalid URL');
		}

		if (!entryId && uri) {
			const existingEntry = await db
				.selectFrom('Entry as e')
				.select('id')
				.where('uri', '=', uri)
				.executeTakeFirst();

			if (!existingEntry && uri) {
				// TODO: cache check
				const article = await parseUrlToEntry(uri);

				const { insertId } = await db
					.insertInto('Entry')
					.values({
						updatedAt: new Date(),
						...article,
					})
					.ignore()
					.executeTakeFirst();

				entryId = Number(insertId);
			} else if (existingEntry) {
				// Entry already exists - bump it to the top of the list, and return that info
				entryId = existingEntry.id;
			}
		}

		if (!entryId) {
			throw new Error('Could not create or retrieve entry');
		}

		const user = useUser();

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
					userId: user.id,
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
					userId: user.id,
				})
				.execute();
		});

		// return entry we inserted

		return await db
			.selectFrom('Entry as e')
			.selectAll()
			.where('id', '=', entryId)
			.executeTakeFirst();
	},
);
