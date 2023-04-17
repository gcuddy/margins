import { dev } from "$app/environment";
import { GOOGLE_BOOKS_API_KEY } from "$env/static/private";
import { redis } from "$lib/redis";
import type { books_v1 } from "@googleapis/books";

const googleBooksApi = "https://www.googleapis.com/books/v1/volumes";

type Book = books_v1.Schema$Volume & {
    volumeInfo: NonNullable<books_v1.Schema$Volume["volumeInfo"]>
}

function assertIsBook(book: books_v1.Schema$Volume): asserts book is Book {
    if (!book.volumeInfo) throw new Error("Invalid book");
}

const time = (msg: string) => dev && console.time(msg);
const timeEnd = (msg: string) => dev && console.timeEnd(msg);

export const books = {
    get: async (volumeId: string) => {
        time("get book")
        const cached = await redis.get(`gbook:${volumeId}`);
        if (cached) {
            console.log("cached")
            timeEnd("get book")
            return cached as Book;
        }
        const response = await fetch(`${googleBooksApi}/${volumeId}?key=${GOOGLE_BOOKS_API_KEY}`);
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json() as books_v1.Schema$Volume;
        assertIsBook(data);
        await redis.set(`gbook:${volumeId}`, data, { ex: 60 * 60 * 24 * 7 });
        timeEnd("get book")
        return data;
    },
    search: async (q: string) => {
        const url = new URL(googleBooksApi);
        url.searchParams.set("q", q);
        url.searchParams.set("key", GOOGLE_BOOKS_API_KEY);
        const response = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
            },
        })
        if (!response.ok) throw new Error(response.statusText);
        const results = await response.json() as books_v1.Schema$Volumes;
        return results;
    }
};
