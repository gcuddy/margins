import { tmdb } from '$lib/api/tmdb';
import { db } from '$lib/db';
import {
	annotationWithEntry,
	annotations,
	entrySelect,
	feed,
	getFirstBookmarkSort,
	withEntry
} from '$lib/db/selects';
import { nanoid } from '$lib/nanoid';
import {
	add_to_collection,
	deleteAnnotation,
	getNotebook,
	getNotebookSchema,
	s_add_to_collection,
	set_tags_on_entry,
	tagsOnEntrySchema,
	updateBookmark,
	updateBookmarkSchema,
	upsertAnnotation
} from '$lib/queries/server';
import { sql } from 'kysely';
import { z } from 'zod';
import { fetchList, inputSchema } from './(listables)/library/fetch.server';
import { jsonArrayFrom } from 'kysely/helpers/mysql';
import { books } from '$lib/api/gbook';
import {
	fetchRss,
	inputSchema as rssInputSchema
} from './(listables)/subscriptions/latest/fetch.server';
import { annotationSchema } from '$lib/annotation';
import { type Condition, View } from './views/new/View';
import spotify from '$lib/api/spotify';
import { get_entry_details } from '$lib/server/queries';
import { typeSchema } from '$lib/types';
import { twitter } from '$lib/twitter';
import type { Tweet } from '$lib/api/twitter';
import { Status } from '@prisma/client';

interface Query<I extends z.ZodTypeAny, Data> {
	staleTime?: number;
	fn: (args: {
		input: I extends z.ZodType<object> ? z.infer<I> : undefined;
		ctx: {
			userId: string;
		};
	}) => Promise<Data>;
	schema?: I;
	headers?: Record<string, string>;
}

export const query = <I extends z.ZodTypeAny, Data>(args: Query<I, Data>) => args;

export const idSchema = z.object({
	id: z.string()
});

export const mutations = {
	// tag_entry: query({
	//     schema: z.object({
	//         entry_id: z.number().int(),
	//         tag_id: z.number().int()
	//     }),
	//     fn: async ({ input: { entry_id, tag_id }, ctx: { userId } }) => {
	//         await db.insertInto("EntryTag")
	//             .values({
	//                 entryId: entry_id,
	//                 tagId: tag_id,
	//                 userId
	//             })
	//             .execute();
	//     }
	// }),
	save_note: query({
		schema: annotationSchema.omit({
			userId: true
		}),
		fn: async ({ ctx: { userId }, input }) => upsertAnnotation({ ...input, userId })
	}),
	deleteAnnotation: query({
		schema: idSchema,
		fn: async ({ ctx: { userId }, input: { id } }) => deleteAnnotation(userId, id)
	}),
	update_note: query({
		schema: z.object({
			id: z.string(),
			body: z.string().optional(),
			reponse: z.string().optional(),
			contentData: z.any().optional()
		}),
		fn: async ({ ctx: { userId }, input }) => {
			const { id, ...rest } = input;
			await db.updateTable('Annotation as a').where('a.id', '=', id).set(rest).execute();
		}
	}),
	updateBookmarkSortOrder: query({
		schema: z.object({
			data: z.array(
				z.object({
					id: z.number().int(),
					sort_order: z.number().int()
				})
			)
		}),
		fn: async ({ input, ctx }) => {
			// id refers to *entryId*, which is a bit confusing
			const data = input.data.map((d) => ({
				entryId: d.id,
				sort_order: d.sort_order,
				userId: ctx.userId,
				updatedAt: new Date()
			}));
			console.dir({ data }, { depth: null });
			// we're updating but using the on duplicate key update "hack"
			await db
				.insertInto('Bookmark')
				.values(data)
				.onDuplicateKeyUpdate({
					sort_order: sql`VALUES(sort_order)`
				})
				.execute();
		}
	}),
	updateBookmark: query({
		schema: updateBookmarkSchema.and(
			z.object({
				userId: z.string().optional()
			})
		),
		fn: async ({ input, ctx }) =>
			updateBookmark({
				...input,
				userId: ctx.userId
			})
	}),
	update_status: query({
		schema: z.object({
			status: z.nativeEnum(Status),
			ids: z.array(z.number().int()),
			sort_order: z.number().int().optional()
		}),
		fn: async ({ input, ctx }) => {
			const new_sort_order =
				input.sort_order ?? (await getFirstBookmarkSort(ctx.userId, input.status));
			await db
				.updateTable('Bookmark')
				.where('entryId', 'in', input.ids)
				.where('userId', '=', ctx.userId)
				.set({
					status: input.status,
					sort_order: new_sort_order
				})
				.execute();
		}
	}),
	createCollection: query({
		schema: z.object({
			name: z.string(),
			items: z
				.array(
					z.object({
						entryId: z.number().int().optional(),
						annotationId: z.string().optional()
					})
				)
				.optional()
		}),
		fn: async ({ ctx, input }) => {
			const result = await db
				.insertInto('Collection')
				.values({
					name: input.name,
					userId: ctx.userId,
					updatedAt: new Date()
				})
				.executeTakeFirst();
			const id = Number(result.insertId);
			if (input.items) {
				await db
					.insertInto('CollectionItems')
					.values(
						input.items.map((i) => ({
							collectionId: id,
							entryId: i.entryId,
							annotationId: i.annotationId,
							updatedAt: new Date(),
							id: nanoid()
						}))
					)
					.execute();
			}
			return { id };
		}
	}),
	addToCollection: query({
		schema: s_add_to_collection,
		fn: async ({ input, ctx: { userId } }) => add_to_collection({ ...input, userId })
	}),
	addRelation: query({
		schema: z.object({
			entryId: z.number().int(),
			relatedEntryId: z.number().int(),
			type: z.enum(['Related', 'SavedFrom']).default('Related').optional()
		}),
		fn: async ({ input, ctx }) => {
			return await db
				.insertInto('Relation')
				.values({
					entryId: input.entryId,
					relatedEntryId: input.relatedEntryId,
					type: input.type,
					id: nanoid(),
					updatedAt: new Date(),
					userId: ctx.userId
				})
				.execute();
		}
	}),
	deleteInteraction: query({
		schema: z.object({
			id: z.number().int()
		}),
		fn: async ({ input, ctx }) => {
			await db
				.deleteFrom('EntryInteraction')
				.where('id', '=', input.id)
				.where('userId', '=', ctx.userId)
				.execute();
		}
	}),
	saveInteraction: query({
		schema: z.object({
			entryId: z.number().int(),
			id: z.number().int().optional(),
			progress: z.number().min(0).max(1).nullish(),
			is_read: z.coerce
				.boolean()
				.transform((b) => +b)
				.optional(),
			last_viewed: z.date().optional()
		}),
		fn: async ({ input, ctx }) => {
			await db
				.insertInto('EntryInteraction')
				.values({
					...input,
					userId: ctx.userId,
					updatedAt: new Date()
				})
				.onDuplicateKeyUpdate(input)
				.execute();
		}
	}),
	set_tags_on_entry: query({
		schema: tagsOnEntrySchema,
		fn: async ({ input, ctx }) => {
			return set_tags_on_entry({ ...input, userId: ctx.userId });
		}
	})
};

const qSchema = z.object({
	q: z.string().nonempty()
});

export const queries = {
	get_entry_deets: query({
		schema: z.object({
			id: z.number().int()
		}),
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
			'cache-control': `s-maxage=1, stale-while-revalidate=${60 * 60 * 24}`
		}
	}),
	get_entry: query({
		schema: z.object({
			id: z.number().int(),
			type: typeSchema
		}),
		fn: async ({ input, ctx }) => {
			return get_entry_details(input.id, {
				userId: ctx.userId,
				type: input.type,
				use_entry_id: true
			});
		}
	}),
	view_entries: query({
		schema: z.object({
			conditions: z.any().array(),
			cursor: z.coerce.date().nullish()
		}),
		fn: async ({ input, ctx }) => {
			return await View.preview(input.conditions as Condition[], ctx.userId, input.cursor);
		}
	}),

	get_annotation: query({
		schema: z.object({
			id: z.string()
		}),
		fn: async ({ input }) => {
			const query = annotationWithEntry().where('a.id', '=', input.id);
			return await query.executeTakeFirstOrThrow();
		}
	}),

	list_subscriptions: query({
		fn: async ({ ctx }) => {
			return await db
				.selectFrom('Subscription as s')
				.innerJoin('Feed as f', 'f.id', 's.feedId')
				.where('userId', '=', ctx.userId)
				.select(['s.id', 's.title', 'feedId', 's.updatedAt', 'f.feedUrl', 'f.imageUrl'])
				.execute();
		}
	}),
	entriesByFeedId: query({
		schema: z.object({
			id: z.number().int(),
			cursor: z.date().optional()
		}),
		fn: async ({ input }) => {
			return await db
				.selectFrom('Subscription as s')
				.innerJoin('Feed as f', 'f.id', 's.feedId')
				.where('f.id', '=', input.id)
				.limit(25)
				.select(['s.title', 's.feedId', 'f.imageUrl', 'f.feedUrl'])
				.select((eb) => feed.withEntries(eb, 25, input.cursor))
				.executeTakeFirstOrThrow();
		}
	}),
	findOrCreateEntry: query({
		schema: z
			.object({
				tmdbId: z.number()
			})
			.partial(),
		fn: async ({ input }) => {
			if (input.tmdbId) {
				const entry = await db
					.selectFrom('Entry')
					.where('tmdbId', '=', input.tmdbId)
					.select(['id'])
					.executeTakeFirst();
				if (entry) {
					return entry;
				}
				const movie = await tmdb.movie.details(input.tmdbId);
				const new_entry = await db
					.insertInto('Entry')
					.values({
						title: movie.title,
						html: movie.overview,
						uri: `tmdb:${movie.id}`,
						tmdbId: movie.id,
						author: movie.credits?.crew?.find((c) => c.job === 'Director')?.name,
						published: movie.release_date,
						image: tmdb.media(movie.poster_path),
						type: 'movie',
						updatedAt: new Date()
					})
					.executeTakeFirst();
				if (new_entry.insertId) {
					return {
						id: Number(new_entry.insertId)
					};
				}
			}
		}
	}),
	entries_by_tag: query({
		schema: z.object({
			name: z.string(),
			cursor: z.coerce.number().optional()
		}),
		fn: async ({ input, ctx }) => {
			let query = db
				.selectFrom('TagOnEntry as toe')
				.innerJoin('Entry as e', 'e.id', 'toe.entryId')
				.innerJoin('Tag as t', (join) =>
					join.onRef('t.id', '=', 'toe.tagId').on('t.name', '=', input.name)
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
				nextCursor
			};
		}
	}),
	tags: query({
		fn: ({ ctx }) => {
			return db.selectFrom('Tag').where('userId', '=', ctx.userId).select(['id', 'name']).execute();
		}
	}),
	collections: query({
		staleTime: 1000,
		fn: ({ ctx }) => {
			return db.selectFrom('Collection').where('userId', '=', ctx.userId).selectAll().execute();
		}
	}),
	search: query({
		staleTime: 1000,
		fn: async ({ input, ctx }) => {
			return await db
				.selectFrom('Entry as e')
				.innerJoin('Bookmark as b', (join) =>
					join.onRef('e.id', '=', 'b.entryId').on('b.userId', '=', ctx.userId)
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
					'e.wordCount'
				])
				.limit(10)
				// .orderBy("createdAt", "desc")
				.execute();
		},
		schema: qSchema
	}),
	search_titles: query({
		fn: async ({ input, ctx }) => {
			const match_q = `${input.q}*`;
			const like_q = `%${input.q}%`;
			return await db
				.selectFrom('Entry as e')
				.innerJoin('Bookmark as b', (join) =>
					join.onRef('e.id', '=', 'b.entryId').on('b.userId', '=', ctx.userId)
				)
				.where(
					sql`MATCH(e.title,e.author) AGAINST (${match_q} IN BOOLEAN MODE) and (e.title like ${like_q} or e.author like ${like_q})`
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
					'e.wordCount'
				])
				.limit(25)
				// .orderBy("createdAt", "desc")
				.execute();
		},
		schema: qSchema
	}),
	notebook: query({
		schema: getNotebookSchema,
		fn: ({ input: { cursor }, ctx: { userId } }) => getNotebook({ cursor, userId })
	}),
	note_mentions: query({
		schema: z.object({
			title: z.string().nonempty(),
			id: z.number().int()
		}),
		fn: async ({ ctx, input: { title, id } }) => {
			const references = db
				.selectFrom('Annotation')
				.select((eb) =>
					jsonArrayFrom(
						eb
							.selectFrom('annotation_to_entry_reference as r')
							.innerJoin('Entry as e', 'r.entryId', 'e.id')
							.innerJoin('Annotation as a', 'r.annotationId', 'a.id')
							.where('e.id', '=', id)
							.select(annotations.select)
						// .select(eb => [
						//     withEntry(eb)
						// ])
					).as('references')
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
							.orderBy('a.createdAt', 'desc')
					).as('mentions')
				);
			return await references.executeTakeFirst();
		}
	}),
	searchNotes: query({
		schema: qSchema,
		fn: async ({ input, ctx }) => {
			const notes = await db
				.selectFrom('Annotation as a')
				.where(sql`MATCH(a.title,a.body,a.exact) AGAINST (${input.q})`)
				.select(annotations.select)
				.select((eb) => [withEntry(eb)])
				.where('a.userId', '=', ctx.userId)
				.limit(10)
				.orderBy('a.createdAt', 'desc')
				.execute();
			return notes;
		}
	}),
	searchBooks: query({
		schema: qSchema,
		fn: async ({ input }) => {
			const { items } = await books.search(input.q);
			return items ?? [];
		}
	}),
	searchMovies: query({
		schema: qSchema,
		fn: async ({ input }) => {
			// TODO Caching
			const { results } = await tmdb.search(input.q);
			return results;
		}
	}),
	searchMusic: query({
		schema: qSchema,
		fn: async ({ input }) => {
			const { albums } = await spotify.search(input.q);
			return albums.items;
		}
	}),
	fetch_list: query({
		schema: inputSchema.omit({
			userId: true
		}),
		fn: async ({ ctx, input }) => {
			return fetchList({
				...input,
				userId: ctx.userId
			});
		}
	}),
	rss: query({
		schema: rssInputSchema.omit({
			userId: true
		}),
		fn: async ({ ctx: { userId }, input }) => fetchRss({ ...input, userId })
	}),
	get_tweet: query({
		schema: z.object({
			id: z.string()
		}),
		fn: async ({ input: { id } }) => {
			return (await twitter.singleTweet(id, {
				expansions: [
					'author_id',
					'attachments.media_keys',
					'in_reply_to_user_id',
					'referenced_tweets.id',
					'referenced_tweets.id.author_id',
					'entities.mentions.username'
				],
				'media.fields': ['url', 'preview_image_url', 'type', 'alt_text', 'duration_ms', 'variants'],
				'user.fields': ['name', 'username', 'profile_image_url'],
				'tweet.fields': [
					'created_at',
					'conversation_id',
					'text',
					'entities',
					'public_metrics',
					'referenced_tweets',
					'in_reply_to_user_id'
				]
			})) as Tweet;
		}
	})
} as const;

export type Queries = typeof queries;
export type Mutations = typeof mutations;

export const query_keys = Object.keys(queries) as (keyof typeof queries)[];

//usage $sq.tags // returns tags
