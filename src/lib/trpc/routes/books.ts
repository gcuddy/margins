import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../t";

const googleBooksApi = "https://www.googleapis.com/books/v1/volumes";

// REVIEW: do we really need to import whole googleApis/books? We get TS... but a simple fetched and type coercion could be fine too

import { books, books_v1 } from "@googleapis/books";
import { DocumentType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import parse from "node-html-parser";

import { getAverageColor } from 'fast-average-color-node';

import { GOOGLE_BOOKS_API_KEY } from "$env/static/private";
import { dev } from "$app/environment";
import Color from "color";

export const saveInputSchema = z.object({
    bookId: z.string(),
    title: z.string(),
    author: z.string(),
    image: z.string().optional(),
    description: z.string().optional(),
    isbn: z.string(),
    published: z.coerce.date(),
    pageCount: z.coerce.number()
});

export const booksRouter = router({
    save: protectedProcedure.input(saveInputSchema).query(async ({ ctx, input }) => {
        const { userId } = ctx;
        const data = {
            googleBooksId: input.bookId,
            author: input.author,
            image: input.image,
            title: input.title,
            summary: input.description,
            type: DocumentType.book,
            uri: 'isbn:' + input.isbn,
            published: input.published,
            pageCount: input.pageCount
        }
        const bookEntry = await ctx.prisma.entry.upsert({
            where: {
                googleBooksId: input.bookId,
                // or: isbn, etc
            },
            update: data,
            create: data
        })
        const bookmark = await ctx.prisma.bookmark.create({
            data: {
                user: {
                    connect: {
                        id: ctx.userId,
                    },
                },
                state: {
                    connect: {
                        id: ctx.user?.default_state_id as number,
                    },
                },
                entry: {
                    connect: {
                        id: bookEntry.id,
                    }
                },
            },
            include: {
                entry: true,
            },
        });
        console.dir(
            { bookmark },
            {
                depth: null,
            }
        );
        return bookmark;
    }),
    public: router({
        search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
            const url = new URL(googleBooksApi);
            url.searchParams.set("q", input);
            const results = await books("v1").volumes.list({
                key: GOOGLE_BOOKS_API_KEY,
                q: input,
                // projection: "lite",
            });
            if (results.status === 200) {
                // ensure no duplicate results
                const ids = new Set((results.data.items?.map(item => item.id).filter(Boolean)) || []);
                const items = Array.from(ids).map(id => results.data.items?.find(item => item.id === id)).filter(Boolean);
                return {
                    ...results.data,
                    items
                }
                return results.data;
            } else {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    cause: results,
                });
            }
        }),
        byId: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
            // store in redis (this should also use cache-control headers)
            const useRedis = !dev;
            const book = await ctx.redis.get("book:" + input);
            if (book) {
                console.log("Found in cache", book);
                if (useRedis) return book as books_v1.Schema$Volume & {
                    color?: string;
                };
            }
            const results = await books("v1").volumes.get({
                key: GOOGLE_BOOKS_API_KEY,
                volumeId: input,
            });
            if (results.status === 200) {
                // get image color
                const image = results.data.volumeInfo?.imageLinks?.thumbnail;
                if (image) {
                    const bookColor = await getAverageColor(image);
                    const c = Color(bookColor.rgba);
                    const color = c.fade(0.75);
                    console.log({ color });
                    const data = {
                        ...results.data,
                        color: color.rgb().string()
                    }
                    await ctx.redis.set("book:" + input, data, {
                        // expire after 1 week
                        ex: 60 * 60 * 24 * 7,
                    });
                    return data;
                }
                const { data } = results;
                await ctx.redis.set("book:" + input, data, {
                    // expire after 1 week
                    ex: 60 * 60 * 24 * 7,
                });
                return {
                    ...data,
                    color: undefined,
                };
            } else {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    cause: results,
                });
            }
        }),
        findGoodreadsBookCover: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
            // Store in DB, cache for 24 hoursp
            const stored = await ctx.redis.get("goodreads-book-cover:" + input);
            if (stored) {
                console.log("Found in cache", stored);
                return stored;
            }
            const googleQuery = `${input} site:goodreads.com/book/show`;
            const html = await fetch(
                `https://www.google.com/search?q=${googleQuery}&sourceid=chrome&ie=UTF-8`
            ).then((res) => res.text());
            const doc = parse(html);
            console.log({ html });
            const links = doc.querySelectorAll("a");
            const link = links
                .find((link) => link.getAttribute("href")?.includes("goodreads.com/book/show/"))
                ?.getAttribute("href")
                ?.split("q=")?.[1];
            console.log({ links, link });
            // const link = doc
            // 	.querySelector(`document.querySelector('a[href*="goodreads.com/book/show/"]')`)
            // 	?.getAttribute("href");
            if (!link) return;
            const goodReadsHtml = await fetch(link).then((res) => res.text());
            const grDoc = parse(goodReadsHtml);
            const src = grDoc.querySelector(`.BookCover__image img`)?.getAttribute("src");
            if (src) {
                await ctx.redis.set("goodreads-book-cover:" + input, src, {
                    ex: 60 * 60 * 24,
                });
                return src;
            }
        }),
    }),
});
