import { GOOGLE_BOOKS_API_KEY, TMDB_API_KEY } from '$env/static/private';
import { books } from '$lib/api/gbook';
import pindex from '$lib/api/pindex';
import { redis } from '$lib/redis';
import type { books_v1 } from '@googleapis/books';
import { error, redirect } from '@sveltejs/kit';
import type { Movie, Search, TV, Person } from 'tmdb-ts';
import { db } from '$lib/db';
import { sql } from 'kysely';
import { getId } from '$lib/utils/entries';
import type { PageServerLoad } from './$types';
import spotify from '$lib/api/spotify';
import { annotations } from '$lib/db/selects';

type GoodObject = {
    id: string | number;
    title?: string;
    type: "movie" | "tv" | "book";
    date?: string;
    image?: string;
    author?: string;
    description?: string;
    isbn?: string;
}

type MoviePlusType = Movie & {
    media_type: "movie";
};
type TvPlusType = TV & {
    media_type: "tv";
};
type PersonPlusType = Person & {
    media_type: "person";
};
type MultiSearch = Search<MoviePlusType | TvPlusType | PersonPlusType>;
const googleBooksApi = "https://www.googleapis.com/books/v1/volumes";




function adaptTmdb(tmdb: MoviePlusType | TvPlusType): GoodObject {
    if (tmdb.media_type === "movie") {
        return {
            id: tmdb.id,
            title: tmdb.title,
            type: "movie",
            image: tmdb.poster_path ? `https://image.tmdb.org/t/p/w300${tmdb.poster_path}` : undefined,
            date: tmdb.release_date ? new Date(tmdb.release_date).getFullYear().toString() : undefined,
        }
    } else {
        return {
            id: tmdb.id,
            title: tmdb.name,
            type: "tv",
            image: tmdb.poster_path ? `https://image.tmdb.org/t/p/w300${tmdb.poster_path}` : undefined,
            date: tmdb.first_air_date ? `${new Date(tmdb.first_air_date).getFullYear()}` : undefined
        }
    }
}

function adaptBook(book: books_v1.Schema$Volume): GoodObject {
    const info = book.volumeInfo;
    const isbn = info?.industryIdentifiers?.find(i => i.type === "ISBN_13")?.identifier ?? info?.industryIdentifiers?.find(i => i.type === "ISBN_10")?.identifier;
    return {
        id: book.id!,
        isbn,
        title: info?.title,
        type: "book",
        image: info?.imageLinks?.thumbnail,
        author: info?.authors?.join(", "),
        date: info?.publishedDate ? new Date(info.publishedDate).getFullYear().toString() : undefined,
    }
}


export const load = (async (e) => {
    console.time("search")
    console.log({ e })
    const type = e.url.searchParams.get("type");

    const session = await e.locals.validate();
    if (!session) throw error(401, "Unauthorized");
    if (!type) {
        throw redirect(307, e.url.pathname + "?type=my");
    }
    const q = e.url.searchParams.get("q");
    console.log({ q })
    if (!q) {
        return {
            results: [],
            type,
            q: ""
        }
    }
    const cached = await redis.get(`search:${type}:${q}`);
    if (cached) {
        console.log("cache hit")
        console.timeEnd("search")
        return {
            results: cached as GoodObject[],
            type,
            q
        }
    }
    // extract this out to api/search endpoint
    // search here
    if (type === "movies") {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}`
        )
        const cacheControl = response.headers.get('Cache-Control') || response.headers.get('cache-control');
        if (cacheControl) {
            e.setHeaders({
                'Cache-Control': cacheControl,
            })
        }
        const multi = await response.json() as MultiSearch;
        console.log({ multi })
        const results = (multi.results.filter(r => r.media_type !== "person") as (MoviePlusType | TvPlusType)[]).map(adaptTmdb)
        await redis.set(`search:${type}:${q}`, results, {
            ex: 60 * 60 * 24
        });
        return {
            results,
            type,
            q
        };
    }
    if (type === "books") {
        e.setHeaders({
            'Cache-Control': "public, max-age=3600"
        })

        const { items } = await books.search(q);

        const adapted = items?.map(adaptBook) || [];
        if (adapted) {
            await redis.set(`search:${type}:${q}`, adapted, {
                ex: 60 * 60 * 24
            });
        }

        // maybe don't do this if we're caching....
        const bookmarks = db.selectFrom("Bookmark as b")
            .innerJoin("Entry as e", "e.id", "b.entryId")
            .where("b.userId", "=", session.userId)
            .where("e.googleBooksId", "in", adapted.map(a => a.id as string))
            .select(["e.googleBooksId", "b.status"])
            .execute();

        return {
            // ...results.items,
            results: adapted,
            type,
            q,
            bookmarks
        }
    }
    if (type === "my") {
        // look for entries with this title

        console.time("entry search")
        const entries = await db.selectFrom("Entry")
            .where(sql`MATCH(title,author,text) AGAINST (${q})`)
            .select([
                "id",
                "title",
                "type",
                "image",
                "published",
                "author",
                "googleBooksId",
                "tmdbId",
                "podcastIndexId",
                "uri",
                "spotifyId"
            ])
            .limit(10)
            .orderBy("createdAt", "desc")
            .execute();

        console.timeEnd("entry search")


        return {
            type,
            q,
            results: entries.map(e => ({
                ...e,
                date: e.published ? new Date(e.published).getFullYear().toString() : undefined,
                image: e.image ?? "",
                id: getId(e)
            }))
        }
    }
    if (type === "notes") {
        // look for entries with this title

        console.time("note search")
        const notes = await db.selectFrom("Annotation as a")
            .leftJoin("Entry as e", "a.entryId", "e.id")
            .where(sql`MATCH(a.title,a.body,a.exact) AGAINST (${q})`)
            .select(annotations.notebook_select)
            .limit(10)
            .orderBy("a.createdAt", "desc")
            .execute();

        console.timeEnd("note search")


        return {
            type,
            q,
            results: [],
            notes
        }
    }
    if (type === "podcasts") {
        const podcasts = await pindex.search(q);
        return {
            type,
            q,
            results: podcasts.feeds.map(f => ({
                type: "show",
                id: `p${f.id}`,
                title: f.title,
                image: f.artwork,
            }))
        }

    }

    if (type === "music") {
        // TODO: search spotify

        const albums = spotify.search(q).then(r => r.albums.items.map(a => ({
            id: a.id,
            title: a.name,
            type: "album",
            image: a.images[0]?.url,
            date: a.release_date,
            author: a.artists[0]?.name
        })));

        return {
            type,
            q,
            results: albums
        }
    }


}) satisfies PageServerLoad