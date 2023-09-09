import { Status } from '@prisma/client';
import { z } from 'zod';

import { type MovieDetails, tmdb } from '$lib/api/tmdb';
import { db } from '$lib/db';
import queue from '$lib/helpers/async/queue';

import type { GetCtx } from '../types';
import { movieInsert } from '../utils/inserts';

export const movieImportSchema = z.object({
	title: z.string(),
	tmdbId: z.number().optional(),
	year: z.number(),
});

export const importMoviesInput = z.object({
	movies: z.array(movieImportSchema),
	status: z.nativeEnum(Status).default('Backlog'),
});

export async function importMovies({
	ctx,
	input,
}: GetCtx<typeof importMoviesInput>) {
	// TODO

	// for all movies, grab tmdb data

	const q = queue(8);

	const movies: Array<MovieDetails> = [];

	for (const movie of input.movies) {
		q.add(async () => {
			const results = await tmdb.movie.search(movie.title, {
				year: movie.year,
			});
			const result = results.results[0];
			if (result) {
				const details = await tmdb.movie.details(result.id);
				movies.push(details);
			}
		});
	}

	await q.close();

	console.log({ movies });

	await db.transaction().execute(async (trx) => {
		await trx
			.insertInto('Entry')
			.values(movies.map(movieInsert))
			.ignore()
			.execute();

		// now get the entryids...
		// and insert into Bookmark

		const entries = await trx
			.selectFrom('Entry')
			.select('id')
			.where(
				'tmdbId',
				'in',
				movies.map((m) => m.id),
			)
			.execute();
		const entryIds = entries.map((e) => e.id);

		return await trx
			.insertInto('Bookmark')
			.values(
				entryIds.map((entryId) => ({
					entryId,
					status: input.status,
					updatedAt: new Date(),
					userId: ctx.userId,
				})),
			)
			.execute();
	});

	return {
		movies,
	};
}
