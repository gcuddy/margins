import type { Entry, Prisma, PrismaClient } from '@prisma/client';
import { z } from 'zod';

import { db } from '$lib/db';

export async function getExtendedEntry({ entryId, userId }: { entryId: number; userId?: string }) {
	const entry = await db.entry.findFirstOrThrow({
		where: {
			id: entryId,
		},
		include: {
			// TODO: annotations as well but only if no bookmark
			bookmarks: {
				where: {
					userId,
				},
				// select: bookmarkSelect,
				// include: {
				// 	tags: {
				// 		select: {
				// 			id: true,
				// 		},
				// 	},
				// 	annotations: true,
				// 	state: true,
				// 	interaction: true,
				// },
			},
			tags: true,
			annotations: true,
			interactions: {
				where: {
					userId,
				},
			},
		},
	});
	const { bookmarks, interactions, ...transformedEntry } = entry;
	// Bookmark and Interaction *should just be one*
	if (entry.bookmarks.length > 1 || entry.interactions.length > 1) {
		console.warn('Bookmarks/Interactions array greater than  ');
	}
	const e = {
		...transformedEntry,
		bookmark: entry.bookmarks[0],
		interaction: entry.interactions[0],
	};
	console.log(`/entry.server`, { e });
	return e;
}

export type EntryWithBookmark = Prisma.PromiseReturnType<typeof getExtendedEntry>;

const Tag = z.object({
	tags: z
		.object({
			// name: z.string(),
			id: z.number().or(z.string().transform((str) => +str)),
		})
		.array(),
	entryId: z.number(),
	userId: z.string(),
});
type Tag = z.infer<typeof Tag>;

export class Entries {
	// could also make this a function -https://www.prisma.io/docs/concepts/components/prisma-client/custom-models
	private userId?: string;

	constructor(private readonly prisma: PrismaClient['entry']) { }

	async tag(data: Tag): Promise<Entry> {
		const parsed = Tag.parse(data);
		return this.prisma.update({
			where: {
				id: parsed.entryId,
			},
			data: {
				tags: {
					set: parsed.tags.map((tag) => {
						return {
							entryId_tagId_userId: {
								entryId: parsed.entryId,
								tagId: tag.id,
								userId: parsed.userId,
							},
						};
					}),
				},
			},
		});
	}
}
// should this exist here, vs in db.ts?
export const entries = new Entries(db.entry);
