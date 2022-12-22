import { Prisma } from '@prisma/client';

import { db } from '$lib/db';

import type { LOCATIONS } from './types/schemas/Locations';

export const bookmarkSelect = Prisma.validator<Prisma.BookmarkSelect>()({
	data: true,
	id: true,
	createdAt: true,
	entryId: true,
	// entry: true,
	uri: true,
	// entry: {
	// 	select: {
	// 		id: true,
	// 	},
	// },
	stateId: true,
	annotations: true,
	private: true,
	interaction: {
		select: {
			is_read: true,
			progress: true,
		},
	},
	tags: {
		select: {
			id: true,
		},
	},
});

export const getBookmarks = async ({
	state,
	take,
	location,
	userId,
}: {
	state?: number;
	take?: number;
	location?: typeof LOCATIONS[number];
	userId: string;
}) => {
	// const rawBookmarks =
	// 	await db.$queryRaw`SELECT id, data, createdAt FROM Bookmark where UserId = ${userId}`;
	// console.log({ rawBookmarks });
	const bookmarks = await db.bookmark.findMany({
		orderBy: [
			{
				createdAt: 'desc',
			},
			// {
			// 	sortOrder: 'asc',
			// },
		],
		where: {
			userId: userId,
			stateId: state,
			// deleted: null,
			// state: {
			// 	is: {
			// 		type: location,
			// 	},
			// },
		},
		select: bookmarkSelect,
		// include: {
		// 	annotations: true,
		// 	// TODO: only include entry data if this bookmark doesn't have any custom data... does that make sense?
		// 	// ala db.bookmark.fields.data ? undefined : true
		// 	entry: true,
		// 	state: true,
		// },
		take,
	});
	console.log({ bookmarks });
	return bookmarks;
};
