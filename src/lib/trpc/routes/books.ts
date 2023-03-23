import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../t";

const googleBooksApi = "https://www.googleapis.com/books/v1/volumes";

// REVIEW: do we really need to import whole googleApis/books? We get TS... but a simple fetched and type coercion could be fine too

import type { books_v1 } from "@googleapis/books";
import { DocumentType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
// import parse from "node-html-parser";

import dayjs from "$lib/dayjs"

// import { getAverageColor } from 'fast-average-color-node';

import { GOOGLE_BOOKS_API_KEY } from "$env/static/private";
import Color from "color";
import { EntryCreateInputSchema } from "$lib/prisma/zod-prisma";

export const saveInputSchema = z.object({
    bookId: z.string(),
    title: z.string(),
    author: z.string(),
    image: z.string().optional(),
    description: z.string().optional(),
    isbn: z.string(),
});

export const booksRouter = router({
    save: protectedProcedure.input(z.object({
        bookId: z.string(),
        isbn: z.string(),
        data: EntryCreateInputSchema,
    })).mutation(async ({ ctx, input }) => {
        const { userId } = ctx;
        const data = {
            googleBooksId: input.bookId,
            uri: 'isbn:' + input.isbn,
            type: DocumentType.book,
        }
        const bookEntry = await ctx.prisma.entry.upsert({
            where: {
                googleBooksId: input.bookId,
                // or: isbn, etc
            },
            update: {
                ...input.data,
                ...data,
            },
            create: {
                ...input.data,
                ...data
            }
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
            // get from redis
            const stored = await ctx.redis.get("books:" + input);
            if (stored) {
                console.log("Found in cache", stored);
                return stored;
            }
            const url = new URL(googleBooksApi);
            url.searchParams.set("q", input);
            url.searchParams.set("key", GOOGLE_BOOKS_API_KEY);

            // convert above to a fetch
            const response = await fetch(url.toString(), {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const results = await response.json() as books_v1.Schema$Volumes;
            if (response.status === 200) {
                // ensure no duplicate results
                const ids = new Set((results.items?.map(item => item.id).filter(Boolean)) || []);
                const items = Array.from(ids).map(id => results.items?.find(item => item.id === id)).filter(Boolean);
                // store in redis (this should also use cache-control headers)
                await ctx.redis.set("books:" + input, {
                    ...results.items,
                    items
                }, {
                    // expire after 1 day
                    ex: 60 * 60 * 24
                });
                return {
                    ...results.items,
                    items
                }
            } else {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    cause: response,
                });
            }
        }),
        byId: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
            // store in redis (this should also use cache-control headers)
            const useRedis = true;
            const book = await ctx.redis.get("book:" + input);
            if (book) {
                console.log("Found in cache", book);
                if (useRedis) return book as books_v1.Schema$Volume & {
                    color?: string;
                };
            }
            const url = new URL(googleBooksApi + "/" + input);
            url.searchParams.set("key", GOOGLE_BOOKS_API_KEY);

            const response = await fetch(url.toString(), {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const results = await response.json() as books_v1.Schema$Volume;

            if (response.status === 200) {
                // get image color
                const image = results.volumeInfo?.imageLinks?.thumbnail;
                if (image && false) {
                    // const bookColor = await getAverageColor(image);
                    // const c = Color(bookColor.rgba);
                    // const color = c.fade(0.15);
                    // console.log({ color });
                    // const data = {
                    //     ...results,
                    //     color: color.rgb().string()
                    // }
                    // await ctx.redis.set("book:" + input, data, {
                    //     // expire after 1 week
                    //     ex: 60 * 60 * 24 * 7,
                    // });
                    // return data
                }
                await ctx.redis.set("book:" + input, results, {
                    // expire after 1 week
                    ex: 60 * 60 * 24 * 7,
                });
                return {
                    ...results,
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
        update: publicProcedure.input(z.object({
            googleBooksId: z.string(),
        })).mutation(async ({ ctx, input }) => {
            const url = new URL(googleBooksApi + "/" + input.googleBooksId);
            url.searchParams.set("key", GOOGLE_BOOKS_API_KEY);
            const response = await fetch(url.toString(), {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const item = await response.json() as books_v1.Schema$Volume;

            if (response.status === 200) {
                if (!item) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Book not found",
                    });
                }
                const data = {
                    googleBooksId: item.id,
                    type: DocumentType.book,
                    title: item.volumeInfo?.title,
                    summary: item.volumeInfo?.subtitle || null,
                    html: item.volumeInfo?.description,
                    author: item.volumeInfo?.authors?.join(', '),
                    publisher: item.volumeInfo?.publisher,
                    published: dayjs(item.volumeInfo?.publishedDate).toDate(),
                    genres: item.volumeInfo?.categories?.[0]?.split('/')[0],
                    language: item.volumeInfo?.language,
                    pageCount: item.volumeInfo?.pageCount,
                }
                const updated = await ctx.prisma.entry.update({
                    where: {
                        googleBooksId: input.googleBooksId,
                    },
                    data,
                })
            }
        })
    }),
});
