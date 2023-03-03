import type {
    Credits,
    ExternalIds,
    Movie,
    MovieDetails,
    Person,
    Search,
    TV,
    TvShowDetails,
    WatchProviders,
} from "tmdb-ts";
import { z } from "zod";

import { TMDB_ACCESS_TOKEN } from "$env/static/private";

import { protectedProcedure, publicProcedure, router } from "../t";

const BASE_URL_V3 = "https://api.themoviedb.org/3";

class Tmdb {
    constructor(private accessToken: string) {
        this.accessToken = accessToken;
    }

    async get<T>(path: string): Promise<T> {
        console.log(`${BASE_URL_V3}${path}`);
        const response = await fetch(`${BASE_URL_V3}${path}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json;charset=utf-8",
            },
        });
        return (await response.json()) as T;
    }
}
const _tmdb = new Tmdb(TMDB_ACCESS_TOKEN);

type MoviePlusType = Movie & {
    media_type: "movie";
};
type TvPlusType = TV & {
    media_type: "tv";
};
type PersonPlusType = Person & {
    media_type: "person";
};

export const SaveMovieSchema = z.object({
    tmdbId: z.number(),
    imdbId: z.string(),
    // TODO: data ala tmdb?  Accept json, but also fetch it with tmdb ourselves if not provided
    author: z.string().optional(),
    title: z.string(),
    summary: z.string(),
    original: z.any(),
    image: z.string().optional(),
    type: z.enum(["movie", "tv"]),
    stateId: z.number().optional(),
    release: z.coerce.date(),
    duration: z.coerce.number(),
});

type MultiSearch = Search<MoviePlusType | TvPlusType | PersonPlusType>;

// type MediaType<T> = T & {
// 	media_type: "tv" | "movie" | "person";
// };

interface TmdbMovieImage {
    aspect_ratio?: number;
    file_path?: string;
    height?: number;
    iso_639_1?: null | string;
    vote_average?: number;
    width?: number;
}

// const tmdb = new TMDB(TMDB_ACCESS_TOKEN);

export const moviesRouter = router({
    save: protectedProcedure.input(SaveMovieSchema).query(async ({ ctx, input }) => {
        const { userId, prisma } = ctx;
        const { tmdbId, imdbId, type, author, title, summary, original, image, release } = input;
        console.log({ input })
        const bookmark = await prisma.bookmark.create({
            data: {
                user: {
                    connect: {
                        id: userId,
                    },
                },
                state: {
                    connect: {
                        id: input.stateId ?? (ctx.user?.default_state_id as number),
                    },
                },
                entry: {
                    connectOrCreate: {
                        where: {
                            tmdbId,
                        },
                        create: {
                            // REVIEW: do we need uri? should it be tmdbid? movie+director+year?
                            // Bookmarks require uri, which is a little silly, so that's how we'll do it for now
                            // Maybe the uri should be the *imdb* id...
                            uri: imdbId,
                            tmdbId,
                            type,
                            title,
                            image,
                            author, // director
                            published: release,
                            // REVIEW: should decide on a standard for summary vs content/text
                            summary,
                            text: summary,
                            duration: input.duration
                            // To save: duration, extended data
                            // saving original is too expensive for now. We can always fetch it later
                            // original,
                            // TODO: original?
                            // original
                        },
                    },
                },
            },
        });
        return bookmark;
    }),
    public: router({
        search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
            // TODO: we should query for TV shows too. This can be done with either Promise.all(search.movies, search.tv) OR doing a custom multi search and filtering out people. Would probably want to increase results so that we don't just get people though, right?
            // or should it be a separate searchTv function?
            // const movies = await tmdb.search.movies({ query: input });

            // const multi = await fetch(
            // 	`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(input)}`
            // ).then((res) => res.json() as Promise<Search<Movie | TV | Person>>);
            const multi = await _tmdb.get<MultiSearch>(`/search/multi?query=${encodeURIComponent(input)}`);
            const results = multi.results.filter((m) => m.media_type !== "person") as (
                | MoviePlusType
                | TvPlusType
            )[];
            return {
                ...multi,
                results,
            };
            // return { ...multi, results: multi.results.filter((m) => m.media_type !== "person") };
            // return multi;
            // console.dir(
            // 	{ multi },
            // 	{
            // 		depth: null,
            // 	}
            // );
            // console.log(movies);
            // // REVIEW: should we sort by popularity?
            // return movies;
            // // return {
            // 	...movies,
            // 	results: movies.results.sort((a, b) => a.popularity - b.popularity),
            // };
        }),
        byId: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
            // REVIEW: append to response??
            // const movie = await tmdb.movies.details(input);

            const tmdb = new Tmdb(TMDB_ACCESS_TOKEN);

            // TODO: set language based on localization!!!
            const lang = "en";
            // check for entry in db
            // if not, fetch from tmdb
            // if so, return that
            const [movie, entry] = await Promise.all([
                tmdb.get<
                    MovieDetails & {
                        credits: Credits;
                        images: {
                            backdrops?: TmdbMovieImage[];
                            logos: TmdbMovieImage[];
                            posters: TmdbMovieImage[];
                        };
                        "watch/providers": WatchProviders;
                        external_ids: ExternalIds;
                    }
                >(
                    `/movie/${input}?append_to_response=${encodeURIComponent(
                        "credits,watch/providers,images,external_ids"
                    )}&language=en-US&include_image_language=en,null`
                ),
                ctx.prisma.entry.findUnique({
                    where: {
                        tmdbId: input,
                    },
                }),
            ]);
            console.log({ movie });
            return { movie, entry };
            // return movie;
        }),
        tvById: publicProcedure.input(z.number()).query(async ({ input }) => {
            // REVIEW: append to response??
            // const movie = await tmdb.movies.details(input);

            // TODO: set language based on localization!!!
            const lang = "en";
            const tvshow = await _tmdb.get<
                TvShowDetails & {
                    credits: Credits;
                    images: {
                        backdrops?: TmdbMovieImage[];
                        logos: TmdbMovieImage[];
                        posters: TmdbMovieImage[];
                    };
                    "watch/providers": WatchProviders;
                    external_ids: ExternalIds;
                }
            >(
                `/tv/${input}?append_to_response=${encodeURIComponent(
                    "credits,watch/providers,images,external_ids"
                )}&language=en-US&include_image_language=en,null`
            );
            console.log({ tvshow });
            return tvshow;
            // return movie;
        }),
        trending: publicProcedure.input(z.enum(["movie", "tv"]).default("movie")).query(async ({ input }) => {
            const trending = await _tmdb.get<Search<Movie>>(`/trending/${input}/week`);
            return trending;
        }),
    }),
});
