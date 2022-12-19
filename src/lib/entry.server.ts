import type { Prisma } from '@prisma/client';

import { db } from '$lib/db';

export async function getEntryAndAnnotations({
	entryId,
	userId,
}: {
	entryId: number;
	userId?: string;
}) {
	const entry = await db.entry.findFirstOrThrow({
		where: {
			id: entryId,
		},
		include: {
			annotations: {
				where: {
					userId,
				},
				include: {
					tags: {
						select: {
							id: true,
							annotationId: true,
							tag: {
								select: {
									name: true,
									id: true,
								},
							},
						},
					},
					children: true,
					state: true,
				},
			},
			interactions: {
				where: {
					userId,
				},
			},
		},
	});
	return entry;
}

export type EntryWithAnnotations = Prisma.PromiseReturnType<typeof getEntryAndAnnotations>;
