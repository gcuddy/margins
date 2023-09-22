// TODO: move all functions over here

import type { GetLibrarySchema } from '$lib/schemas/library';
import type { LibraryEntry } from '$lib/server/queries';
import { Status, type Entry } from '@prisma/client';
import { z } from 'zod';
import {
	applyFilter,
	generateComparatorClause,
	type BaseInputFilter,
} from '../utils/comparators';
import { stringComparatorSchema } from '$lib/schemas/inputs/comparators';
import { db } from '$lib/db';
export function getCursor({
	grouping,
	nextItem,
	sort,
}: {
	grouping: GetLibrarySchema['grouping'];
	nextItem: LibraryEntry;
	sort: GetLibrarySchema['sort'];
}): NonNullable<GetLibrarySchema['cursor']> {
	switch (sort) {
		case null:
		case undefined:
		case 'manual': {
			return {
				id: nextItem.id,
				sort_order: nextItem.sort_order!,
				type: grouping === 'type' ? nextItem.type : undefined,
			};
		}
		// TODO continue here with cursors
		case 'author': {
			return {
				author: nextItem.bookmark_author ?? nextItem.author,
				id: nextItem.id,
			};
		}
		case 'title': {
			return {
				id: nextItem.id,
				title: nextItem.title,
			};
		}
		case 'updatedAt': {
			return {
				id: nextItem.id,
				updatedAt: nextItem.updatedAt!,
			};
		}
		case 'time': {
			return {
				id: nextItem.id,
				time: nextItem.estimatedReadingTime,
			};
		}
		case 'createdAt': {
			return {
				createdAt: nextItem.savedAt!,
				id: nextItem.id,
			};
		}
		case 'published': {
			return {
				id: nextItem.id,
				published: nextItem.published!,
			};
		}
	}
}

export function filterLibrary() {}

// note: already made this for library, trying to rebuild ehre with idea from collection
export const libraryInput = z.object({
	bookmark: z.object({
		status: z.nativeEnum(Status).optional(),
	}),
	title: stringComparatorSchema,
}) satisfies z.ZodType<BaseInputFilter<Partial<Entry>>>;

export async function library({
	filter,
	userId,
}: {
	filter: z.infer<typeof libraryInput>;
	userId: string;
}) {
	// dfdfdf
	let query = db
		.selectFrom('Entry as e')
		.innerJoin('Bookmark as b', 'b.entryId', 'e.id')
		.where('b.userId', '=', userId)
		.select(['e.id']);
	if (filter) {
		const { bookmark, ...restFilter } = filter;
		query = query.where((eb) => {
			const f = applyFilter(eb, restFilter);

			// const exp = generateComparatorClause(eb, "e.title", filter.title);

			return f;
		});
	}

	return await query.execute();
}
