import { error } from '@sveltejs/kit';
// import { cacheMovieResponse } from '$lib/redis';
// import { cacheMovieIds } from '$lib/redis';
import type {
	Credits,
	DetailedCollection,
	Images,
	Movie as TMovie,
	Person,
	Recommendations,
	Search,
	Season as TSeason,
	TV,
	Videos,
} from 'tmdb-ts';

import { browser } from '$app/environment';
import { TMDB_API_KEY } from '$env/static/private';
import { objectValuesToString } from '$lib/helpers';

type Season = TSeason & {
	episodes: Array<{
		air_date: string;
		episode_number: number;
		id: number;
		name: string;
		overview: string;
		production_code: string;
		season_number: number;
		still_path: string;
		vote_average: number;
		vote_count: number;
	}>;
};

type Movie = TMovie & {
	imdb_id: string;
	runtime: number;
};

export type MovieDetails = Movie & {
	belongs_to_collection: {
		backdrop_path: string;
		id: number;
		name: string;
		poster_path: string;
	};
	budget: number;
	credits: Credits;
	genres: Array<{
		id: number;
		name: string;
	}>;
	keywords?: {
		keywords: Array<{
			id: number;
			name: string;
		}>;
	};
	// images: Images & {
	// 	backdrops: Array<{
	// 		aspect_ratio: number;
	// 		file_path: string;
	// 		height: number;
	// 		iso_639_1: string;
	// 		vote_average: number;
	// 		vote_count: number;
	// 		width: number;
	// 	}>;
	// };
	production_companies: Array<{
		id: number;
		logo_path: string | null;
		name: string;
		origin_country: string;
	}>;
	production_countries: Array<{
		iso_3166_1: string;
		name: string;
	}>;
	recommendations: Recommendations;
	// TODO
	// release_dates: {
	// 	results: Array<ReleaseDateResult>;
	// };
	revenue: number;
	status: string;
	tagline: string;
	videos: Videos;
};

type TVDetails = TV & {
	created_by: Array<{
		credit_id: string;
		gender: number;
		id: number;
		name: string;
		profile_path: string;
	}>;
	credits: Credits;
	images: Images;
	number_of_episodes: number;
	number_of_seasons: number;
	recommendations: Recommendations;
	status: string;
	videos: Videos;
};

type MoviePlusType = Movie & {
	media_type: 'movie';
};
type TvPlusType = TV & {
	media_type: 'tv';
};
type PersonPlusType = Person & {
	media_type: 'person';
};
type MultiSearch = Search<MoviePlusType | TvPlusType | PersonPlusType>;

export type List = {
	description: string;
	favorite_count: number;
	id: string;
	iso_639_1: string;
	item_count: number;
	list_type: string;
	name: string;
	poster_path: string | null;
};

const VOTE_THRESHOLD = 20;

export const base = 'https://api.themoviedb.org/3';
export const media_base = 'https://image.tmdb.org/t/p';

const cache = new Map();

function validateApiKey(key: unknown): asserts key is string {
	if (typeof key !== 'string') {
		throw new Error('Missing TMDB_API_KEY');
	}
}

export const tmdb = {
	collection: async (id: number) => {
		validateApiKey(TMDB_API_KEY);

		const url = `${base}/collection/${id}?api_key=${TMDB_API_KEY}`;

		const response = await fetch(url);

		if (!response.ok) {
			throw error(response.status);
		}

		return (await response.json()) as DetailedCollection;
	},
	media: (path: string, size: `w${number}` | 'original' = 'w500') =>
		`${media_base}/${size}${path}`,

	movie: {
		details: async (id: number) => {
			// TODO: store in redis cache with slimmed down version
			validateApiKey(TMDB_API_KEY);
			// TODO: release dates
			const url = `${base}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,recommendations,keywords`;

			if (cache.has(url)) {
				console.log('(map) cache hit');
				return cache.get(url) as MovieDetails;
			}

			const response = await fetch(url);

			if (!response.ok) {
				throw error(response.status);
			}

			const data = (await response.json()) as MovieDetails;

			if (browser) {
				cache.set(url, data);
			}

			return data;
		},
		search: async (q: string, opts: { year?: number } = {}) => {
			validateApiKey(TMDB_API_KEY);
			const params = new URLSearchParams({
				api_key: TMDB_API_KEY,
				query: q,
				...(opts ? objectValuesToString(opts) : {}),
			});
			const url = `${base}/search/movie?${params}`;

			if (cache.has(url)) {
				return cache.get(url) as Search<Movie>;
			}

			const response = await fetch(url);

			if (!response.ok) {
				throw error(response.status);
			}

			const data = (await response.json()) as Search<Movie>;

			cache.set(url, data);

			return data;
		},
	},

	person: {
		details: async (id: number) => {
			if (typeof TMDB_API_KEY !== 'string') {
				throw new Error('Missing TMDB_API_KEY');
			}
			const url = `${base}/person/${id}?api_key=${TMDB_API_KEY}&append_to_response=combined_credits,images`;

			const response = await fetch(url);

			if (!response.ok) {
				throw error(response.status);
			}

			const data = (await response.json()) as Person & {
				combined_credits: {
					cast: Array<Movie>;
					crew: Array<
						Movie & {
							department: string;
							job: string;
						}
					>;
				};
			};

			data.combined_credits.crew = data.combined_credits.crew.filter(
				(movie) => {
					// clean up results
					return !!movie.poster_path && !!movie.title && !!movie.release_date;
				},
			);

			return data;
		},
		search: async (q: string) => {
			validateApiKey(TMDB_API_KEY);
			const url = `${base}/search/person?api_key=${TMDB_API_KEY}&query=${q}`;

			const response = await fetch(url);

			if (!response.ok) {
				throw error(response.status);
			}

			const data = (await response.json()) as Search<Person>;

			return data;
		},
	},
	/**
	 * Multi Search
	 * @param q search query
	 */
	search: async (q: string) => {
		validateApiKey(TMDB_API_KEY);
		const response = await fetch(
			`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
				q,
			)}`,
		);

		if (!response.ok) {
			throw error(response.status);
		}

		const multi = (await response.json()) as MultiSearch;
		console.log({ multi });

		return multi;
	},
	tv: {
		details: async (id: number) => {
			validateApiKey(TMDB_API_KEY);
			const url = `${base}/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,images,videos,recommendations`;

			if (cache.has(url)) {
				console.log('(map) cache hit');
				return cache.get(url) as TVDetails;
			}

			const response = await fetch(url);

			if (!response.ok) {
				throw error(response.status);
			}

			const data = (await response.json()) as TVDetails;

			if (browser) {
				cache.set(url, data);
			}

			return data;
		},
		season: async (id: number, season: number) => {
			// &append_to_response=credits,images,videos
			validateApiKey(TMDB_API_KEY);
			const url = `${base}/tv/${id}/season/${season}?api_key=${TMDB_API_KEY}`;

			// if (cache.has(url)) {
			//     console.log('(map) cache hit')
			//     return cache.get(url) as TVDetails;
			// }

			const response = await fetch(url);

			if (!response.ok) {
				throw error(response.status);
			}

			const data = (await response.json()) as Season;

			// if (browser) {
			//     cache.set(url, data);
			// }

			return data;
		},
	},
};

export async function searchMovies(searchQuery: string, page: number) {
	validateApiKey(TMDB_API_KEY);
	const response = await fetch(
		`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&page=${page}&include_adult=false&query=${searchQuery}`,
	);
	const parsed = (await response.json()) as Search<Movie>;

	// filter out obscure movies
	const filteredMovies = parsed.results.filter(
		(movie) => movie.vote_count >= VOTE_THRESHOLD,
	);
	const removedMovies = parsed.results.filter(
		(movie) => movie.vote_count < VOTE_THRESHOLD,
	);
	console.log(
		'Filtered out:',
		removedMovies.map((m) => m.title),
	);

	parsed.results = filteredMovies;

	// await cacheMovieIds(filteredMovies.map((m) => m.id));

	return parsed;
}

export async function getMovieDetailsFromApi(id: number) {
	console.time('getMovieDetailsFromApi');
	const movieResponse = await getMovieDetails(id);
	if (movieResponse.ok) {
		const movie = (await movieResponse.json()) as Movie & { credits: Credits };
		console.timeEnd('getMovieDetailsFromApi');
		// await cacheMovieResponse(id, movie, credits);
		return {
			movie,
		};
	}
	console.log('Bad status from API', movieResponse.status);
	console.timeEnd('getMovieDetailsFromApi');
	throw error(500, 'unable to retrieve movie details from API');
}

async function getMovieDetails(id: number) {
	validateApiKey(TMDB_API_KEY);
	return await fetch(
		`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits`,
	);
}
