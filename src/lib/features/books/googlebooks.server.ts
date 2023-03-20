import { GOOGLE_BOOKS_API_KEY } from "$env/static/private";
import type { books_v1 } from "@googleapis/books";

const googleBooksApi = "https://www.googleapis.com/books/v1/volumes";
export const books = {
    get: async (volumeId: string) => {
        const response = await fetch(`${googleBooksApi}/${volumeId}?key=${GOOGLE_BOOKS_API_KEY}`);
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json() as books_v1.Schema$Volume;
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
