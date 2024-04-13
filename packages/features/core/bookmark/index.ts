import { createId, isValidUrl } from '@margins/lib';
import { zod } from '../utils/zod.js';
import {
	BookmarkModel,
	CollectionItemsModel,
	EntryModel,
} from '@margins/db/zod';
import { parseUrlToEntry } from '../../index.js';
import { createCompiledInsertBookmarkQuery } from './queries.js';
import { useUser } from '../user.js';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { useTransaction } from '../utils/transaction.js';

export const create = zod(
	BookmarkModel.pick({
		entryId: true,
		id: true,
		status: true,
		uri: true,
	})
		.extend({
			collection: CollectionItemsModel.pick({
				collectionId: true,
				id: true,
			}),
			relatedEntryId: EntryModel.shape.id,
			status: BookmarkModel.shape.status.default('Backlog'),
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
		console.log({ entryId, uri });

		// TODO: abstract this into its own entry handler

		if (!entryId && uri) {
			// TODO: cache lookup for given uri -> entry id (since given uri might resolve differently than final uri)
			useTransaction(async (db) => {
				const existingEntry = await db
					.selectFrom('Entry as e')
					.select('id')
					.where('uri', '=', uri)
					.executeTakeFirst();

				console.log({ existingEntry });
				if (!existingEntry && uri) {
					// TODO: cache check
					try {
						const article = await parseUrlToEntry(uri);
						entryId = nanoid();

						await db
							.insertInto('Entry')
							.values({
								id: entryId,
								updatedAt: new Date(),
								...article,
							})
							.ignore()
							.executeTakeFirst();
					} catch (e) {
						console.error(e);
					}
				} else if (existingEntry) {
					// Entry already exists - bump it to the top of the list, and return that info
					entryId = existingEntry.id;
				}
			});
		}

		console.log({
			entryId,
		});

		if (!entryId) {
			throw new Error('Could not create or retrieve entry');
		}

		const user = useUser();
		console.log({ user });

		const res = await useTransaction(async (trx) => {
			if (!entryId) {
				throw new Error('entryId is undefined');
			}
			const _entryId = entryId;

			console.log({ collection, relatedEntryId, status });

			if (status) {
				const q = createCompiledInsertBookmarkQuery(trx, {
					entryId: _entryId,
					id: input.id ?? createId(),
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
			return await trx
				.selectFrom('Entry as e')
				.selectAll()
				.where('id', '=', entryId)
				.executeTakeFirst();
		});

		return res;
	},
);

// TODO: accept entry id?
export const update = zod(
	z.object({
		id: z.string(),
		input: BookmarkModel.pick({
			status: true,
		}),
	}),
	async (input) => {
		const user = useUser();
		const { id } = input;
		return await useTransaction(async (db) => {
			await db
				.updateTable('Bookmark')
				.set({
					...input,
					updatedAt: new Date(),
				})
				.where('id', '=', id)
				.where('userId', '=', user.id)
				.execute();

			return await db
				.selectFrom('Bookmark as b')
				.selectAll()
				.where('id', '=', id)
				.where('userId', '=', user.id)
				.executeTakeFirst();
		});
	},
);
