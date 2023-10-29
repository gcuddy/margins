import { Status, ViewType } from '$lib/types/enums';
import type { RequestEvent } from '@sveltejs/kit';
import { Insertable, sql } from 'kysely';
import { jsonArrayFrom } from 'kysely/helpers/mysql';
import { z } from 'zod';

import { books } from '$lib/api/gbook';
import spotify from '$lib/api/spotify';
import pindex from '$lib/api/pindex';

import { tmdb } from '$lib/api/tmdb';
import type { Tweet } from '$lib/api/twitter';
import { db, json } from '$lib/db';
import {
	collections,
	collectionUpdate,
	collectionUpdateSchema,
} from '$lib/db/queries/collections';
import { importMovies, importMoviesInput } from '$lib/db/queries/integration';
import {
	saveInteraction,
	saveInteractionSchema,
} from '$lib/db/queries/interaction';
import {
	subscription,
	subscriptionCreateMutation,
	subscriptionInputSchema,
} from '$lib/db/queries/subscriptions';
import {
	viewPreferencesCreate,
	viewPreferencesCreateInput,
	viewPreferencesGetOrCreate,
	viewPreferencesUpdate,
	viewPreferencesUpdateInput,
} from '$lib/db/queries/view-preferences';
import {
	annotations,
	annotationWithEntry,
	entrySelect,
	feed,
	getFirstBookmarkSort,
	withEntry,
} from '$lib/db/selects';
import { nanoid } from '$lib/nanoid';
import { attachmentCreate } from '$lib/queries/attachment';
import { bookmarkCreate } from '$lib/queries/bookmark';
import {
	add_to_collection,
	convertTo,
	convertToSchema,
	count_library,
	countLibrarySchema,
	createEntry,
	createFavorite,
	createFavoriteSchema,
	createTag,
	createTagSchema,
	deleteAnnotation,
	entry_by_id,
	entry_by_id_schema,
	get_authors,
	get_notes_for_tag,
	getNotebook,
	getNotebookSchema,
	note,
	notes,
	notesInputSchema,
	pins,
	s_add_to_collection,
	save_to_library,
	saveToLibrarySchema,
	set_tags_on_entry,
	tagsOnEntrySchema,
	updateBookmark,
	updateBookmarkSchema,
	updateFavorite,
	updateFavoriteSchema,
	updateTag,
	updateTagSchema,
	upsertAnnotation,
	upsertAnnotationSchema,
} from '$lib/queries/server';
import { idOptionalArraySchema, idSchema } from '$lib/schemas';
import { collectionsInputSchema } from '$lib/schemas/inputs';
import { attachmentCreateInput } from '$lib/schemas/inputs/attachment.schema';
import { bookmarkCreateInput } from '$lib/schemas/inputs/bookmark.schema';
import { collectionItemUpdateInputSchema } from '$lib/schemas/inputs/collection.schema';
import { booleanNumberSchema } from '$lib/schemas/inputs/helpers';
import {
	get_entry_details,
	get_library,
	get_library_schema,
} from '$lib/server/queries';
import { twitter } from '$lib/twitter';
import { typeSchema } from '$lib/types';

import {
	fetchRss,
	inputSchema as rssInputSchema,
} from './(app2)/(listables)/subscriptions/latest/fetch.server';
import { fetchList, inputSchema } from './(app2)/library/fetch.server';
import { customViewCreate } from '$lib/db/queries/custom-view';
import { jsonSchema } from '$lib/schemas/types';
import type { Replace } from 'type-fest';
import { replace } from '$lib/helpers/string';
import type { TargetSchema } from '$lib/annotation';
import type { JSONContent } from '@tiptap/core';
import { searchNotes } from '$lib/db/queries/note';
import type { TagOnEntry } from '$lib/prisma/kysely/types';

type Query<TSchema extends z.ZodTypeAny, TData> = {
	// defaults to TRUE
	authorized?: boolean;
	fn: (args: {
		ctx: {
			event: RequestEvent;
			userId: string;
		};
		input: z.infer<TSchema>;
	}) => Promise<TData>;
	headers?: Record<string, string>;
	schema?: TSchema;
	staleTime?: number;
};

// TODO: rename this to "procedure"
export const query = <TSchema extends z.ZodTypeAny, TData>(
	args: Query<TSchema, TData>,
) => args;

export const mutations = {
	addRelation: query({
		fn: async ({ ctx, input }) => {
			const ids = Array.isArray(input.entryId)
				? input.entryId
				: [input.entryId];

			await db.transaction().execute(async (trx) => {
				// First select relations that already exist - we don't insert when there's a relation coming the other direction with the same type
				const existingBiDirectionalRelations = await trx
					.selectFrom('Relation')
					.where((eb) =>
						eb.or([
							eb.and([
								eb('entryId', 'in', ids),
								eb('relatedEntryId', '=', input.relatedEntryId),
							]),
							eb.and([
								eb('entryId', '=', input.relatedEntryId),
								eb('relatedEntryId', 'in', ids),
							]),
						]),
					)
					.where('type', '=', input.type ?? 'Related')
					.where('userId', '=', ctx.userId)
					.select(['entryId', 'relatedEntryId', 'id'])
					.execute();

				// now filter out the ones that already exist

				const existingBiDirectionalRelationsMap = new Map<
					string,
					{ entryId: number; relatedEntryId: number; id: string }
				>();

				for (const rel of existingBiDirectionalRelations) {
					existingBiDirectionalRelationsMap.set(
						`${rel.entryId}-${rel.relatedEntryId}`,
						rel,
					);
				}

				const insertables: Insertable<Relation>[] = [];

				for (const entryId of ids) {
					const key = `${entryId}-${input.relatedEntryId}`;
					if (!existingBiDirectionalRelationsMap.has(key)) {
						insertables.push({
							entryId,
							id: nanoid(),
							relatedEntryId: input.relatedEntryId,
							type: input.type,
							updatedAt: new Date(),
							userId: ctx.userId,
						});
					}
				}

				for (const entryId of ids) {
					const key = `${input.relatedEntryId}-${entryId}`;
					if (!existingBiDirectionalRelationsMap.has(key)) {
						insertables.push({
							entryId: input.relatedEntryId,
							id: nanoid(),
							relatedEntryId: entryId,
							type: input.type,
							updatedAt: new Date(),
							userId: ctx.userId,
						});
					}
				}

				return await trx
					.insertInto('Relation')
					.values(insertables)
					// just to be safe
					.ignore()
					.execute();
			});

			// now filter out the ones that already exist

			// const res = await db
			// 	.insertInto('Relation')
			// 	.values(
			// 		ids.map((entryId) => ({
			// 			entryId,
			// 			id: nanoid(),
			// 			relatedEntryId: input.relatedEntryId,
			// 			type: input.type,
			// 			updatedAt: new Date(),
			// 			userId: ctx.userId,
			// 		})),
			// 	)
			// 	.ignore()
			// 	.executeTakeFirst();

			// return {
			// 	numAffected: Number(res.numInsertedOrUpdatedRows),
			// };
		},
		schema: z.object({
			entryId: z.number().int().or(z.number().array()),
			relatedEntryId: z.number().int(),
			type: z.enum(['Related', 'SavedFrom']).default('Related').optional(),
		}),
	}),
	addToCollection: query({
		fn: async ({ ctx: { userId }, input }) =>
			add_to_collection({ ...input, userId }),
		schema: s_add_to_collection,
	}),
	attachmentCreate: query({
		fn: attachmentCreate,
		schema: attachmentCreateInput,
	}),
	bookmarkCreate: query({
		fn: bookmarkCreate,
		schema: bookmarkCreateInput,
	}),
	bookmarkDelete: query({
		schema: z.object({
			// bookmarkIds: z.number().array(),
			entryIds: z.number().array(),
		}),
		fn: async ({ ctx, input }) => {
			// or should we perform soft delete? tbd
			await db
				.deleteFrom('Bookmark')
				.where('userId', '=', ctx.userId)
				.where('entryId', 'in', input.entryIds)
				// .where("id", "in", input.bookmarkIds)
				.execute();
		},
	}),
	bulkNoteInsert: query({
		schema: z.object({
			contentData: jsonSchema,
			entryIds: z.number().array(),
		}),
		fn: async ({ ctx, input }) => {
			await db
				.insertInto('Annotation')
				.values(
					input.entryIds.map((entryId) => ({
						contentData: json(input.contentData),
						entryId,
						id: nanoid(),
						userId: ctx.userId,
						updatedAt: new Date(),
					})),
				)
				.execute();
		},
	}),
	bulkTagInsert: query({
		schema: z.object({
			entryIds: z.number().array(),
			tagIds: z.number().array(),
			tagIdsToRemove: z.number().array().optional(),
		}),
		fn: async ({ ctx, input }) => {
			// Simply insert all tags and ignore duplicates
			const insertables: Insertable<TagOnEntry>[] = [];
			for (const entryId of input.entryIds) {
				for (const tagId of input.tagIds) {
					insertables.push({
						entryId,
						tagId,
						userId: ctx.userId,
					});
				}
			}
			if (insertables.length) {
				await db
					.insertInto('TagOnEntry')
					.values(insertables)
					.ignore()
					.execute();
			}

			if (input.tagIdsToRemove?.length) {
				await db
					.deleteFrom('TagOnEntry')
					.where('entryId', 'in', input.entryIds)
					.where('tagId', 'in', input.tagIdsToRemove)
					.where('userId', '=', ctx.userId)
					.execute();
			}
		},
	}),
	collectionUpdate: query({
		fn: collectionUpdate,
		schema: collectionUpdateSchema,
	}),
	convertEntry: query({
		fn: convertTo,
		schema: convertToSchema,
	}),
	createCollection: query({
		fn: async ({ ctx, input }) => {
			const result = await db
				.insertInto('Collection')
				.values({
					name: input.name,
					updatedAt: new Date(),
					userId: ctx.userId,
				})
				.executeTakeFirst();
			const id = Number(result.insertId);
			if (input.items) {
				await db
					.insertInto('CollectionItems')
					.values(
						input.items.map((i) => ({
							annotationId: i.annotationId,
							collectionId: id,
							entryId: i.entryId,
							id: nanoid(),
							updatedAt: new Date(),
						})),
					)
					.execute();
			}
			return { id };
		},
		schema: z.object({
			items: z
				.array(
					z.object({
						annotationId: z.string().optional(),
						entryId: z.number().int().optional(),
					}),
				)
				.optional(),
			name: z.string(),
		}),
	}),
	createFavorite: query({
		fn: createFavorite,
		schema: createFavoriteSchema,
	}),
	createTag: query({
		fn: createTag,
		schema: createTagSchema,
	}),
	customViewCreate,
	deleteAnnotation: query({
		fn: async ({ ctx: { userId }, input: { id } }) =>
			deleteAnnotation(userId, id),
		schema: idSchema,
	}),
	deleteFavorite: query({
		fn: async ({ ctx, input }) => {
			let query = db.deleteFrom('Favorite').where('userId', '=', ctx.userId);
			query = Array.isArray(input.id)
				? query.where('id', 'in', input.id)
				: query.where('id', '=', input.id);
			await query.execute();
		},
		schema: idOptionalArraySchema,
	}),
	deleteInteraction: query({
		fn: async ({ ctx, input }) => {
			await db
				.deleteFrom('EntryInteraction')
				.where('id', '=', input.id)
				.where('userId', '=', ctx.userId)
				.execute();
		},
		schema: z.object({
			id: z.number().int(),
		}),
	}),
	importMovies: query({
		fn: importMovies,
		schema: importMoviesInput,
	}),
	markAllAsRead: query({
		fn: async ({ ctx, input }) => {
			if ('feedId' in input) {
				const ids = Array.isArray(input.feedId) ? input.feedId : [input.feedId];
				await db
					.insertInto('UserEntry')
					.columns(['entryId', 'seen', 'userId'])
					.expression((eb) =>
						eb
							.selectFrom('Entry')
							.where('feedId', 'in', ids)
							.select((eb) => [
								'Entry.id',
								sql`now()`.as('seen'),
								eb.val(ctx.userId).as('userId'),
							]),
					)
					.onDuplicateKeyUpdate({
						seen: sql`now()`,
					})
					.execute();
			} else {
				await db
					.insertInto('UserEntry')
					.values(
						input.entryIds.map((entryId) => ({
							entryId,
							seen: sql`now()`,
							userId: ctx.userId,
						})),
					)
					.onDuplicateKeyUpdate({
						seen: sql`now()`,
					})
					.execute();
			}
		},
		schema: z
			.object({
				feedId: z.number().or(z.number().array()),
			})
			.or(
				z.object({
					entryIds: z.number().array(),
				}),
			),
	}),
	removeFromCollection: query({
		fn: async ({ ctx: { userId }, input }) => {
			const query = db
				.deleteFrom('CollectionItems')
				.where('collectionId', '=', input.collectionId);
			if (input.entryId) {
				await query.where('entryId', '=', input.entryId).execute();
			} else if (input.annotationId) {
				await query.where('annotationId', '=', input.annotationId).execute();
			}
		},
		schema: z
			.object({
				annotationId: z.string().optional(),
				collectionId: z.number().int(),
				entryId: z.number().int().optional(),
			})
			.refine(
				(v) => v.entryId || v.annotationId,
				'Must provide either entryId or annotationId',
			),
	}),
	saveInteraction: query({
		fn: saveInteraction,
		schema: saveInteractionSchema,
	}),
	save_note: query({
		fn: upsertAnnotation,
		schema: upsertAnnotationSchema,
	}),
	save_to_library: query({
		fn: save_to_library,
		schema: saveToLibrarySchema,
	}),
	set_tags_on_entry: query({
		fn: async ({ ctx, input }) => {
			return set_tags_on_entry({ ...input, userId: ctx.userId });
		},
		schema: tagsOnEntrySchema,
	}),
	subscriptionCreate: subscriptionCreateMutation,
	updateBookmark: query({
		fn: async ({ ctx, input }) =>
			updateBookmark({
				...input,
				userId: ctx.userId,
			}),
		schema: updateBookmarkSchema,
	}),
	updateBookmarkSortOrder: query({
		fn: async ({ ctx, input }) => {
			// id refers to *entryId*, which is a bit confusing
			const data = input.data.map((d) => ({
				entryId: d.id,
				sort_order: d.sort_order,
				updatedAt: new Date(),
				userId: ctx.userId,
			}));
			// we're updating but using the on duplicate key update "hack"
			await db
				.insertInto('Bookmark')
				.values(data)
				.onDuplicateKeyUpdate({
					sort_order: sql`VALUES(sort_order)`,
				})
				.execute();
		},
		schema: z.object({
			data: z.array(
				z.object({
					id: z.number().int(),
					sort_order: z.number().int(),
				}),
			),
		}),
	}),
	updateCollectionItem: query({
		fn: async ({ ctx, input }) => {
			const { data, id } = input;
			await db
				.updateTable('CollectionItems')
				.where('id', '=', id)
				.set(data)
				.execute();
		},
		schema: collectionItemUpdateInputSchema,
	}),
	updateCollectionItemsPosition: query({
		fn: async ({ ctx, input }) => {
			await db
				.insertInto('CollectionItems')
				.values(
					input.map((item) => ({
						collectionId: item.collectionId,
						id: item.id,
						position: item.position,
						updatedAt: new Date(),
					})),
				)
				.onDuplicateKeyUpdate({
					position: sql`VALUES(position)`,
				})
				.execute();
		},
		schema: z.array(
			z.object({
				collectionId: z.number(),
				id: z.string(),
				position: z.number(),
			}),
		),
	}),
	updateFavorite: query({
		fn: updateFavorite,
		schema: updateFavoriteSchema,
	}),
	updateTag: query({
		fn: updateTag,
		schema: updateTagSchema,
	}),
	update_note: query({
		fn: async ({ ctx: { userId }, input }) => {
			const { id, ...rest } = input;
			await db
				.updateTable('Annotation as a')
				.where('a.id', '=', id)
				.set(rest)
				.execute();
		},
		schema: z.object({
			body: z.string().optional(),
			contentData: z.any().optional(),
			id: z.string(),
			reponse: z.string().optional(),
		}),
	}),
	update_status: query({
		fn: async ({ ctx, input }) => {
			const new_sort_order =
				input.sort_order ??
				(await getFirstBookmarkSort(ctx.userId, input.status));

			await db.transaction().execute(async (trx) => {
				await trx
					.updateTable('Bookmark')
					.where('entryId', 'in', input.ids)
					.where('userId', '=', ctx.userId)
					.set({
						sort_order: new_sort_order,
						status: input.status,
					})
					.execute();

				// and add history item
				// await trx.insertInto("BookmarkHistory")
				//     .values({
				//         fromStatus
				//     })
			});
		},
		schema: z.object({
			ids: z.array(z.number().int()),
			sort_order: z.number().int().optional(),
			status: z.nativeEnum(Status),
		}),
	}),
	userEntryInsert: query({
		fn: async ({ ctx, input }) => {
			const { entryId, seen } = input;
			const { userId } = ctx;
			await db
				.insertInto('UserEntry')
				.values({
					entryId,
					seen,
					userId,
				})
				.onDuplicateKeyUpdate({
					seen,
				})
				.execute();
		},
		schema: z.object({
			entryId: z.number(),
			seen: z.coerce.date().nullish(),
		}),
	}),
	viewUpsert: query({
		// TODO: upgrade this
		fn: async ({ ctx, input }) => {
			const view = await db
				.insertInto('SmartList')
				.values({
					entryFilterType: input.type,
					filterData: json(input.filterData),
					id: input.id,
					name: input.name,
					userId: ctx.userId,
					updatedAt: new Date(),
				})
				.onDuplicateKeyUpdate({
					entryFilterType: input.type,
					filterData: json(input.filterData),
					name: input.name,
					updatedAt: new Date(),
				})
				.executeTakeFirst();

			return {
				id: input.id ?? Number(view.insertId),
			};
		},
		schema: z.object({
			filterData: jsonSchema,
			id: z.number().optional(),
			name: z.string(),
			// todo: auto generate
			type: z.enum(['Library', 'Subscriptions', 'All']).optional(),
		}),
	}),
	viewPreferencesCreate: query({
		fn: viewPreferencesCreate,
		schema: viewPreferencesCreateInput,
	}),
	viewPreferencesUpdate: query({
		fn: viewPreferencesUpdate,
		schema: viewPreferencesUpdateInput,
	}),
} as const;

const qSchema = z.object({
	q: z.string().nonempty(),
});

export const queries = {
	artistAlbums: query({
		authorized: false,
		fn: ({ input }) => spotify.artist.albums(input.id),
		headers: {
			'cache-control': 's-maxage=1, stale-while-revalidate=86400',
		},
		schema: z.object({
			id: z.string(),
		}),
	}),
	collections: query({
		// fn: ({ ctx }) => {
		// 	return db
		// 		.selectFrom('Collection')
		// 		.where('userId', '=', ctx.userId)
		// 		.orderBy('name', 'asc')
		// 		.selectAll()
		// 		.execute();
		// }
		fn: collections,
		schema: collectionsInputSchema,
	}),
	count_library: query({
		fn: count_library,
		schema: countLibrarySchema,
	}),
	entriesByFeedId: query({
		fn: async ({ input }) => {
			return await db
				.selectFrom('Subscription as s')
				.innerJoin('Feed as f', 'f.id', 's.feedId')
				.where('f.id', '=', input.id)
				.limit(25)
				.select(['s.title', 's.feedId', 'f.imageUrl', 'f.feedUrl'])
				.select((eb) => feed.withEntries(eb, 25, input.cursor))
				.executeTakeFirstOrThrow();
		},
		schema: z.object({
			cursor: z.date().optional(),
			id: z.number().int(),
		}),
	}),
	entries_by_tag: query({
		fn: async ({ ctx, input }) => {
			let query = db
				.selectFrom('TagOnEntry as toe')
				.innerJoin('Entry as e', 'e.id', 'toe.entryId')
				.innerJoin('Tag as t', (join) =>
					join.onRef('t.id', '=', 'toe.tagId').on('t.name', '=', input.name),
				)
				.select(entrySelect)
				.select(['t.id as tag_id'])
				.where('toe.userId', '=', ctx.userId)
				.orderBy('toe.id', 'desc');

			if (input.cursor) {
				query = query.where('toe.id', '<', input.cursor);
			}
			const entries = await query.limit(25 + 1).execute();
			const hasMore = entries.length > 25;
			let nextCursor: typeof input.cursor = undefined;
			if (hasMore) {
				const nextItem = entries.pop();
				if (nextItem) {
					nextCursor = nextItem.id;
				}
			}
			return {
				entries,
				nextCursor,
			};
		},
		schema: z.object({
			cursor: z.coerce.number().optional(),
			name: z.string(),
		}),
	}),

	entryContent: query({
		// TODO: maybe should be authorized, if it has owner?
		authorized: false,
		fn: async ({ input }) => {
			const entry = await db
				.selectFrom('Entry')
				.where('id', '=', input.id)
				.select(['html'])
				.executeTakeFirstOrThrow();
			return entry;
		},
		headers: {
			'cache-control': `s-maxage=1, stale-while-revalidate=${60 * 60 * 24}`,
		},
		schema: z.object({
			id: z.number().int(),
		}),
	}),

	entry_by_id: query({
		fn: entry_by_id,
		schema: entry_by_id_schema,
	}),

	entryAnnotations: query({
		fn: async ({ ctx, input }) => {
			return await db
				.selectFrom('Annotation as a')
				.innerJoin('Entry as e', 'e.id', 'a.entryId')
				.where('e.id', '=', input.id)
				.where('a.userId', '=', ctx.userId)
				// TODO: select only the fields we need
				.selectAll('a')
				.execute();
		},
		schema: z.object({
			id: z.number(),
		}),
	}),

	entryRelations: query({
		fn: async ({ ctx, input }) => {
			const relations = await db
				.selectFrom('Relation as r')
				.where((eb) =>
					eb.or([
						eb('r.entryId', '=', input.id),
						eb('r.relatedEntryId', '=', input.id),
					]),
				)
				.where('r.userId', '=', ctx.userId)
				.leftJoin('Entry as e1', (join) =>
					join
						.onRef('r.relatedEntryId', '=', 'e1.id')
						.on('r.entryId', '=', input.id),
				)
				.leftJoin('Entry as e2', (join) =>
					join
						.onRef('r.entryId', '=', 'e2.id')
						.on('r.relatedEntryId', '=', input.id),
				)
				.select([
					'r.id as relation_id',
					'r.type as relation_type',
					'r.entryId',
					'r.relatedEntryId',
					'e1.title as entryTitle',
					'e2.title as relatedEntryTitle',
				])
				// Ridiculous type magic here:
				.select(({ eb, fn: { coalesce } }) =>
					entrySelect.map((s) => {
						const col = s.replace('e.', '') as Replace<typeof s, 'e.', ''>;
						return coalesce(`e1.${col}`, `e2.${col}`).as(
							replace(s, 'e.', 'entry_'),
						);
						// return coalesce(`e1.${col}`, `e2.${col}`).as(
						// 	`entry_${s}` as Replace<typeof s, 'e.', 'entry_'>,
						// );
					}),
				)
				.select((eb) =>
					eb
						.case()
						.when('r.entryId', '=', input.id)
						.then('outbound')
						.when('r.relatedEntryId', '=', input.id)
						.then('inbound')
						.end()
						.as('direction'),
				)
				.execute();
			return relations;
		},
		schema: z.object({
			id: z.number(),
		}),
	}),

	fetch_list: query({
		fn: async ({ ctx, input }) => {
			return fetchList({
				...input,
				userId: ctx.userId,
			});
		},
		schema: inputSchema.omit({
			userId: true,
		}),
	}),
	findOrCreateEntry: query({
		fn: async ({ input }) => {
			if (input.type === 'movie') {
				const tmdbId = input.id;
				const entry = await db
					.selectFrom('Entry')
					.where('tmdbId', '=', tmdbId)
					.select(['id'])
					.executeTakeFirst();
				if (entry) {
					return entry;
				}
				const movie = await tmdb.movie.details(tmdbId);
				const new_entry = await db
					.insertInto('Entry')
					.values({
						author: movie.credits.crew.find((c) => c.job === 'Director')?.name,
						html: movie.overview,
						image: tmdb.media(movie.poster_path),
						published: movie.release_date,
						title: movie.title,
						tmdbId: movie.id,
						type: 'movie',
						updatedAt: new Date(),
						uri: `tmdb:${movie.id}`,
					})
					.executeTakeFirst();
				if (new_entry.insertId) {
					return {
						id: Number(new_entry.insertId),
					};
				}
			} else if (input.type === 'book') {
				const entry = await db
					.selectFrom('Entry')
					.where('googleBooksId', '=', input.id)
					.select(['id'])
					.executeTakeFirst();

				if (entry) {
					return entry;
				}

				const newEntry = await createEntry({
					type: 'book',
					googleBooksId: input.id,
				});

				return {
					id: newEntry.id,
				};
			}
		},
		schema: z.union([
			z.object({
				id: z.number().int(),
				type: z.literal('movie'),
			}),
			z.object({
				id: z.string(),
				type: z.literal('book'),
			}),
		]),
	}),
	getAllEntries: query({
		fn: async ({ ctx }) => {
			const entries = await db
				.selectFrom('Bookmark as b')
				.innerJoin('Entry as e', 'e.id', 'b.entryId')
				.leftJoin('EntryInteraction as i', (join) =>
					join.onRef('e.id', '=', 'i.entryId').on('i.userId', '=', ctx.userId),
				)
				.where('b.userId', '=', ctx.userId)
				.select(entrySelect.filter((s) => s !== 'e.title' && s !== 'e.author'))
				.select(['b.status', 'i.progress', 'b.bookmarked_at'])
				.select((eb) => [
					eb.fn.coalesce('b.title', 'e.title').as('title'),
					eb.fn.coalesce('b.author', 'e.author').as('author'),
				])
				.select((eb) =>
					eb
						.case()
						.when('e.uri', 'regexp', '^(http|https)://')
						.then(
							sql`SUBSTRING_INDEX(SUBSTRING_INDEX(e.uri, '/', 3), '//', -1)`,
						)
						.else(sql`null`)
						.end()
						.as('domain'),
				)
				.orderBy('title asc')
				.execute();
			return entries;
		},
	}),
	getBookByIsbn: query({
		authorized: false,
		fn: async ({ input }) => {
			const { items } = await books.search(`isbn:${input}`);
			return items?.[0];
		},
		headers: {
			'cache-control': 's-maxage=1, stale-while-revalidate=86400',
		},
		schema: z.string(),
	}),
	get_annotation: query({
		fn: async ({ input }) => {
			const query = annotationWithEntry().where('a.id', '=', input.id);
			return await query.executeTakeFirstOrThrow();
		},
		schema: z.object({
			id: z.string(),
		}),
	}),
	get_authors: query({
		fn: get_authors,
	}),
	get_entries_for_tag: query({
		fn: async ({ ctx, input }) => {
			const query = db
				.selectFrom('TagOnEntry as toe')
				.innerJoin('Entry as e', 'e.id', 'toe.entryId')
				.innerJoin('Tag as t', (join) =>
					join.onRef('t.id', '=', 'toe.tagId').on('t.name', '=', input.name),
				)
				.select(entrySelect)
				.select(['t.id as tag_id'])
				.where('toe.userId', '=', ctx.userId)
				.orderBy('toe.id', 'desc')
				.execute();
			return query;
		},
		schema: z.object({
			name: z.string().nonempty(),
		}),
	}),
	get_entry: query({
		fn: async ({ ctx, input }) => {
			return get_entry_details(input.id, {
				type: input.type,
				use_entry_id: true,
				userId: ctx.userId,
			});
		},
		schema: z.object({
			id: z.number().int(),
			type: typeSchema,
		}),
	}),
	get_entry_deets: query({
		fn: async ({ input: { id } }) => {
			//
			const entry = await db
				.selectFrom('Entry as e')
				.where('id', '=', id)
				.select(entrySelect)
				.select(['e.html'])
				.executeTakeFirstOrThrow();
			return entry;
		},
		headers: {
			'cache-control': `s-maxage=1, stale-while-revalidate=${60 * 60 * 24}`,
		},
		schema: z.object({
			id: z.number().int(),
		}),
	}),
	get_library: query({
		fn: async ({ ctx, input }) => {
			const { userId } = ctx;
			return get_library({
				userId,
				...input,
			});
		},
		schema: get_library_schema,
	}),
	get_notes_for_tag: query({
		fn: async ({ ctx: { userId }, input: { name } }) =>
			get_notes_for_tag({ name, userId }),
		schema: z.object({ name: z.string().nonempty() }),
	}),
	get_tag_deets: query({
		fn: async ({ ctx: { userId }, input: { name } }) => {
			return db
				.selectFrom('Tag')
				.leftJoin('Favorite as pin', 'pin.tagId', 'Tag.id')
				.where('Tag.name', '=', name)
				.where('Tag.userId', '=', userId)
				.select(['Tag.id', 'Tag.name', 'Tag.color', 'pin.id as pin_id'])
				.executeTakeFirstOrThrow();
		},
		schema: z.object({ name: z.string().nonempty() }),
	}),
	get_tweet: query({
		fn: async ({ input: { id } }) => {
			return (await twitter.singleTweet(id, {
				expansions: [
					'author_id',
					'attachments.media_keys',
					'in_reply_to_user_id',
					'referenced_tweets.id',
					'referenced_tweets.id.author_id',
					'entities.mentions.username',
				],
				'media.fields': [
					'url',
					'preview_image_url',
					'type',
					'alt_text',
					'duration_ms',
					'variants',
				],
				'tweet.fields': [
					'created_at',
					'conversation_id',
					'text',
					'entities',
					'public_metrics',
					'referenced_tweets',
					'in_reply_to_user_id',
				],
				'user.fields': ['name', 'username', 'profile_image_url'],
			})) as Tweet;
		},
		schema: z.object({
			id: z.string(),
		}),
	}),
	list_subscriptions: query({
		fn: async ({ ctx }) => {
			const subscriptions = await db
				.selectFrom('Subscription as s')
				.innerJoin('Feed as f', 'f.id', 's.feedId')
				// .leftJoin('Unread as u', (join) =>
				// 	join.onRef('u.feedId', '=', 'f.id').on('u.userId', '=', ctx.userId),
				// )
				.where('s.userId', '=', ctx.userId)
				.select((eb) =>
					eb
						.selectFrom('Entry as e')
						.select((eb) => eb.fn.countAll().as('unreadCount'))
						.whereRef('e.feedId', '=', 'f.id')
						.where((eb) =>
							eb.not(
								eb.exists(
									eb
										.selectFrom('UserEntry as ue')
										.select(sql.lit(1).as('one'))
										.where('ue.userId', '=', ctx.userId)
										.whereRef('ue.entryId', '=', 'e.id')
										.where('ue.seen', 'is not', null),
								),
							),
						)
						.as('unreadCount'),
				)
				.select([
					'f.id',
					// TODO: because of legacy doing this, but not great
					'f.id as feedId',
					's.title',
					's.id as subscriptionId',
					'f.lastParsed',
					'f.podcastIndexId',
					'f.podcast',
					// 'f.podcast',
					's.updatedAt',
					'f.feedUrl',
					'f.imageUrl',
					'f.link',
					'f.guid',
				])
				// .select((eb) => eb.fn.count('ue.entryId').as('unreadCount'))
				// .select([
				// 	's.id',
				// 	's.title',
				// 	'feedId',
				// 	's.updatedAt',
				// 	'f.feedUrl',
				// 	'f.imageUrl',
				// 	'f.link',
				// ])
				// .groupBy(['s.id'])
				.orderBy('s.title asc')
				.execute();
			// console.dir(subscriptions, { depth: null });
			return subscriptions;
		},
	}),
	movieCollection: query({
		authorized: false,
		fn: async ({ input }) => await tmdb.collection(input),
		headers: {
			'cache-control': 's-maxage=1, stale-while-revalidate=86400',
		},
		schema: z.number().int(),
	}),
	note: query({
		fn: note,
		schema: idSchema,
	}),
	note_mentions: query({
		fn: async ({ ctx, input: { id, title } }) => {
			const references = db
				.selectFrom('Annotation')
				.select((eb) =>
					jsonArrayFrom(
						eb
							.selectFrom('annotation_to_entry_reference as r')
							.innerJoin('Entry as e', 'r.entryId', 'e.id')
							.innerJoin('Annotation as a', 'r.annotationId', 'a.id')
							.where('e.id', '=', id)
							.select(annotations.select),
						// .select(eb => [
						//     withEntry(eb)
						// ])
					).as('references'),
				)
				.select((eb) =>
					jsonArrayFrom(
						eb
							.selectFrom('Annotation as a')
							.where('a.body', 'like', `%${title}%`)
							.select(annotations.select)
							.select((eb) => [withEntry(eb)])
							.where('a.userId', '=', ctx.userId)
							.limit(10)
							.orderBy('a.createdAt', 'desc'),
					).as('mentions'),
				);
			return await references.executeTakeFirst();
		},
		schema: z.object({
			id: z.number().int(),
			title: z.string().nonempty(),
		}),
	}),
	notebook: query({
		fn: ({ ctx: { userId }, input: { cursor } }) =>
			getNotebook({ cursor, userId }),
		schema: getNotebookSchema,
	}),
	notes: query({
		fn: notes,
		schema: notesInputSchema,
	}),
	pins: query({
		fn: pins,
	}),
	rss: query({
		fn: async ({ ctx: { userId }, input }) => fetchRss({ ...input, userId }),
		schema: rssInputSchema.omit({
			userId: true,
		}),
	}),
	search: query({
		fn: async ({ ctx, input }) => {
			return await db
				.selectFrom('Entry as e')
				.innerJoin('Bookmark as b', (join) =>
					join.onRef('e.id', '=', 'b.entryId').on('b.userId', '=', ctx.userId),
				)
				.where(sql`MATCH(title,author) AGAINST (${input.q})`)
				.select([
					'e.id',
					'e.title',
					'e.type',
					'e.image',
					'e.published',
					'e.author',
					'e.googleBooksId',
					'e.tmdbId',
					'e.podcastIndexId',
					'e.spotifyId',
					'e.uri',
					'e.wordCount',
				])
				.limit(10)
				// .orderBy("createdAt", "desc")
				.execute();
		},
		schema: qSchema,
		staleTime: 1000,
	}),
	searchBooks: query({
		fn: async ({ input }) => {
			const { items } = await books.search(input.q);
			return items ?? [];
		},
		schema: qSchema,
	}),
	searchPodcasts: query({
		fn: async ({ input }) => {
			const search = await pindex.search(input.q);
			return search.feeds ?? [];
		},
		schema: qSchema,
	}),
	searchMovies: query({
		fn: async ({ input }) => {
			// TODO Caching
			const { results } = await tmdb.movie.search(input.q);
			return results;
		},
		schema: qSchema,
	}),
	searchMoviesMulti: query({
		fn: async ({ input }) => {
			// TODO Caching
			const { results } = await tmdb.search(input.q);
			return results;
		},
		schema: qSchema,
	}),
	searchMusic: query({
		fn: async ({ input }) => {
			const { albums } = await spotify.search(input.q);
			return albums.items;
		},
		schema: qSchema,
	}),
	searchNotes: query({
		// TODO: this is a bit of a mess
		fn: async ({ ctx, input }) => {
			const notes = await searchNotes(input.q, ctx.userId);
			return notes;
		},
		schema: qSchema,
	}),
	search_titles: query({
		fn: async ({ ctx, input }) => {
			const match_q = `${input.q}*`;
			const like_q = `%${input.q}%`;
			return await db
				.selectFrom('Entry as e')
				.innerJoin('Bookmark as b', (join) =>
					join.onRef('e.id', '=', 'b.entryId').on('b.userId', '=', ctx.userId),
				)
				.where(
					sql`MATCH(e.title,e.author) AGAINST (${match_q} IN BOOLEAN MODE) and (e.title like ${like_q} or e.author like ${like_q})`,
				)
				.select([
					'e.id',
					'e.title',
					'e.type',
					'e.image',
					'e.published',
					'e.author',
					'e.googleBooksId',
					'e.tmdbId',
					'e.podcastIndexId',
					'e.spotifyId',
					'e.uri',
					'e.wordCount',
				])
				.limit(25)
				// .orderBy("createdAt", "desc")
				.execute();
		},
		schema: qSchema,
	}),
	similarEntries: query({
		fn: async ({ ctx, input }) => {
			// TODO: massage this a bit, try out different ways of doing it. also could do a search for url if provided.

			const entries = await db
				.selectFrom('Entry as e')
				.leftJoin('Bookmark as b', (join) =>
					join.onRef('b.entryId', '=', 'e.id').on('b.userId', '=', ctx.userId),
				)
				.leftJoin('Subscription as s', (join) =>
					join
						.onRef('s.feedId', '=', 'e.feedId')
						.on('s.userId', '=', ctx.userId),
				)
				.select(entrySelect)
				.select(
					sql<number>`MATCH (e.title, e.author, text) AGAINST ('>("${sql.raw(
						input.title,
					)}") <(${sql.raw(input.title)}) ("${sql.raw(
						input.author ?? '',
					)}")' IN BOOLEAN MODE)`.as('score'),
				)
				.where(
					sql`MATCH (e.title, e.author, text) AGAINST ('"${sql.raw(
						input.title,
					)}" <(${sql.raw(input.title)}) "${sql.raw(
						input.author ?? '',
					)}"' IN BOOLEAN MODE)`,
				)
				// where bookmarked, or subscription exists
				.where((eb) =>
					eb.or([eb('b.id', 'is not', null), eb('s.id', 'is not', null)]),
				)
				.having(sql`score > 0.5`)
				// look for where in library or subscriptions
				.limit(25)
				.execute();

			return entries;
		},
		schema: z.object({
			title: z.string(),
			author: z.string().nullish(),
		}),
	}),
	subscription: query({
		fn: subscription,
		schema: subscriptionInputSchema,
	}),
	// tag: query(),
	tags: query({
		fn: ({ ctx }) => {
			return db
				.selectFrom('Tag')
				.where('userId', '=', ctx.userId)
				.select(['id', 'name', 'color'])
				.orderBy('Tag.name', 'asc')
				.execute();
		},
	}),
	viewPreferencesGetOrCreate: query({
		fn: ({ ctx, input }) => {
			return viewPreferencesGetOrCreate(ctx.userId, input.viewType);
		},
		schema: z.object({
			viewType: z.nativeEnum(ViewType),
		}),
	}),
} as const;

export type Queries = typeof queries;
export type Mutations = typeof mutations;

export const query_keys = Object.keys(queries) as Array<keyof typeof queries>;

//usage $sq.tags // returns tags
