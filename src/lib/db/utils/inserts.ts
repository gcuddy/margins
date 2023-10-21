import type { Insertable } from 'kysely';

import { type MovieDetails, tmdb } from '$lib/api/tmdb';
import type { Entry } from '$lib/prisma/kysely/types';

export const movieInsert = (movie: MovieDetails): Insertable<Entry> => {
	return {
		author: movie.credits.crew.find((c) => c.job === 'Director')?.name,
		html: movie.overview,
		image: tmdb.media(movie.poster_path),
		published: movie.release_date,
		title: movie.title,
		tmdbId: movie.id,
		type: 'movie',
		updatedAt: new Date(),
		uri: `tmdb:${movie.id}`,
	};
};
