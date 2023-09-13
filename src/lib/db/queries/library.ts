// TODO: move all functions over here

import type { GetLibrarySchema } from '$lib/schemas/library';
import type { LibraryEntry } from '$lib/server/queries';

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
				sort_order: nextItem.sort_order,
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
				updatedAt: nextItem.updatedAt,
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
				createdAt: nextItem.savedAt,
				id: nextItem.id,
			};
		}
	}
}
