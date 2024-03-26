import type { ExpressionBuilder, InferResult } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql';

import { entrySelect } from '$lib/db/selects';
import type {
	DB,
	Entry,
} from '$lib/prisma/kysely/types';

export function selectEntryFromLibrary(
	eb: ExpressionBuilder<
		DB & {
			e: Entry;
		},
		'e'
	>,
	userId: string,
) {
	return eb
		.selectFrom('Bookmark as b')
		.where('b.userId', '=', userId)
		.select([
			'e.id',
			'e.image',
			'e.published',
			'e.type',
			'e.title',
			'e.author',
			'e.uri',
			'e.tmdbId',
			'e.googleBooksId',
			'e.podcastIndexId',
			'b.updatedAt',
			'e.wordCount',
			'e.estimatedReadingTime',
			'e.spotifyId',
			'b.status',
			'b.sort_order',
			// hate how i've done this!
			'b.title as bookmark_title',
			'b.author as bookmark_author',
			// 'i.progress',
			// 'i.currentPage',
		])
		.select((eb) => [
			jsonArrayFrom(
				eb
					.selectFrom('Annotation')
					.innerJoin('auth_user', 'auth_user.id', 'Annotation.userId')
					.select([
						'Annotation.id',
						'Annotation.contentData',
						'Annotation.start',
						'Annotation.body',
						'Annotation.target',
						'Annotation.entryId',
						'auth_user.username',
						'Annotation.title',
						'Annotation.createdAt',
						'Annotation.exact',
					])
					// .select((eb) => eb.fn.countAll('Annotation').as('num_annotations'))
					// .select(eb.fn.count("Annotation.id").as("count")
					.whereRef('Annotation.entryId', '=', 'e.id')
					.where('Annotation.userId', '=', userId)
					.orderBy('Annotation.start', 'asc')
					.orderBy('Annotation.createdAt', 'asc')
					// TODO: add count column to get all
					.limit(10),
			).as('annotations'),
			jsonObjectFrom(
				eb
					.selectFrom('EntryInteraction as i')
					.select(['i.progress', 'i.currentPage'])
					.whereRef('i.entryId', '=', 'e.id')
					.where('i.userId', '=', userId),
			).as('interaction'),
			jsonArrayFrom(
				eb
					.selectFrom('Tag')
					.select(['Tag.id', 'Tag.name'])
					.innerJoin('TagOnEntry as et', 'et.tagId', 'Tag.id')
					.whereRef('et.entryId', '=', 'e.id'),
			).as('tags'),
			jsonArrayFrom(
				eb
					.selectFrom('Collection')
					.select(['Collection.id', 'Collection.name'])
					.innerJoin(
						'CollectionItems as ci',
						'ci.collectionId',
						'Collection.id',
					)
					.whereRef('ci.entryId', '=', 'e.id'),
			).as('collections'),
			jsonArrayFrom(
				eb
					.selectFrom('Relation as r')
					.whereRef('r.entryId', '=', 'e.id')
					.select(['r.id', 'r.type', 'r.entryId', 'r.relatedEntryId'])
					.select((eb) =>
						jsonObjectFrom(
							eb
								.selectFrom('Entry as e')
								.whereRef('e.id', '=', 'r.relatedEntryId')
								.select(entrySelect),
						).as('entry'),
					)
					.unionAll(
						eb
							.selectFrom('Relation as r')
							.select(['r.id', 'r.type', 'r.entryId', 'r.relatedEntryId'])
							.select((eb) =>
								jsonObjectFrom(
									eb
										.selectFrom('Entry as e')
										.whereRef('e.id', '=', 'r.entryId')
										.select(entrySelect),
								).as('entry'),
							)
							.whereRef('r.relatedEntryId', '=', 'e.id'),
					),
			).as('relations'),
			eb
				.selectFrom('Annotation')
				.whereRef('Annotation.entryId', '=', 'e.id')
				.where('Annotation.userId', '=', userId)
				.select((eb) => eb.fn.count('Annotation.id').as('n'))
				.as('num_annotations'),
		])
}

export type LibraryEntry = InferResult<ReturnType<typeof selectEntryFromLibrary>>[number];
