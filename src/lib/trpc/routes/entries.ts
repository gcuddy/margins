import { z } from 'zod';

import { db } from '$lib/db';
import { auth } from '$lib/trpc/middleware/auth';
import { t } from '$lib/trpc/t';

import { logger } from '../middleware/logger';

const idInput = z.object({
	id: z.number(),
});

export const entries = t.router({
	list: t.procedure
		.use(auth)
		.use(logger)
		.query(
			({ ctx: { userId } }) =>
				db.entry
					.findMany({
						select: {
							id: true,
							title: true,
							author: true,
							// html: true,
							image: true,
							uri: true,
							summary: true,
							updatedAt: true,
							annotations: {
								where: {
									type: 'note',
								},
							},
							tags: {
								select: {
									id: true,
								},
							},
							_count: {
								select: { annotations: true },
							},
						},
						orderBy: { updatedAt: 'desc' },
						where: {
							bookmarks: {
								some: {
									userId,
								},
							},
						},
						take: 20,
					})
					.then((entries) => entries.map((entry) => ({ ...entry, bookmark: true })))
			// .then((books) => books.map((book) => ({ ...book, price: book.price.toJSON() })))
		),
	loadData: t.procedure
		.use(auth)
		.use(logger)
		.input(
			idInput.extend({
				// todo: maybe this shuold be select instead for prisma ergonomics
				data: z
					.object({
						annotations: z.boolean(),
						html: z.boolean(),
					})
					.partial(),
			})
		)
		.query(({ input: { id, data } }) =>
			db.entry
				.findUniqueOrThrow({
					where: {
						id,
					},
					select: {
						...data,
					},
					// todo: allow no select to be passed in to get everything
				})
				.then((data) => {
					return data;
				})
		),
	getAnnotations: t.procedure
		.use(auth)
		.use(logger)
		.input(idInput)
		.query(({ input: { id } }) =>
			db.entry
				.findUniqueOrThrow({
					where: {
						id,
					},
					select: {
						annotations: true,
					},
				})
				.then((data) => data.annotations)
		),
});
