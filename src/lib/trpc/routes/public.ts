import rehypeStringify from 'rehype-stringify';
import remarkObsidian from 'remark-obsidian';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified'
import { z } from "zod";

import { uploadFile } from "$lib/backend/s3.server";
// import { getScreenshot } from "$lib/features/entries/bookmarks/image";
import { normalizeUrl } from "$lib/feeds/utils";
import parse from "$lib/parse";
import { publicProcedure, router } from "$lib/trpc/t";
import type { Metadata } from '$lib/web-parser';
import { dev } from '$app/environment';

export const publicRouter = router({
    parse: publicProcedure.input(z.object({
        url: z.string(),
        html: z.string().optional()
    })).query(async ({ input, ctx }) => {
        const cached = await ctx.redis.get(input.url);
        if (cached && !dev) {
            return cached as Metadata;
        }
        const normalizedUrl = normalizeUrl(input.url);
        const parsed = await parse(normalizedUrl);
        await ctx.redis.set(input.url, parsed, {
            // cache for one day
            ex: 60 * 60 * 24
        })
        return parsed as Metadata;
    }),
    parseMarkdown: publicProcedure.input(z.object({
        markdown: z.string()
    })).query(async ({ctx, input}) => {
        const { value } = unified()
        .use(remarkParse)
        .use(remarkObsidian)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeStringify, { allowDangerousHtml: true })
        .processSync(input.markdown);
        console.log({value})
        return value;
    }),
    loadEntry: publicProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { id } = input;
            const entry = await ctx.prisma.entry.findUniqueOrThrow({
                where: {
                    id,
                },
            });
            return entry;
        }),
    generateScreenshot: publicProcedure
        .input(z.object({
            url: z.string(),
            type: z.enum(["jpeg", "png"]).default("png"),
            waitUntil: z.enum(["load", "domcontentloaded", "networkidle0", "networkidle2"]).default("load"),
            width: z.number().default(1280),
            height: z.number().default(720),
            deviceScaleFactor: z.number().default(1),
            js: z.string().default(""),
            css: z.string().default("")
        }))
        .query(async ({ ctx, input }) => {
            const { css, url, type, waitUntil, height, width, deviceScaleFactor, js } = input
            // TODO: heavily cache this
            // setHeaders({
            // "content-type": `image/${type}`,
            // "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
            // // TODO: access control allow origin
            // });
            // const res = await fetch(`/api/screenshot/${encodeURIComponent(input)}`)

            // TODO: CACHE THIS VERY AGGRESSIVELY (1 day)
            // const image = await renderImage({
            // 	css,
            // 	url,
            // 	type,
            // 	waitUntil,
            // 	height,
            // 	width,
            // 	deviceScaleFactor,
            // 	js
            // })
            // TODO: figure out a screenshot service, current ones exceeding 50mb function limit
            //    End of March hard deadline: AWS removes node 12 support
            // currently using zachleat's version — will see what he does
            const res = await fetch(`https://admirable-croissant-98e7d9.netlify.app/${encodeURIComponent(url)}/large/1:1/larger/`);
            const image = await res.arrayBuffer();
            //    const image = await getScreenshot(url)
            if (!image) {
                throw new Error("No image");
            }
            // upload image to s3
            // if (!image) {
            // 	throw new Error("No image");
            // }
            // const blob = new Blob([image], { type: `image/${type}` })
            const Key = `screenshots/${url.replace(/[^a-zA-Z0-9]/g, "_")}.${type}`
            const data = await uploadFile({
                Key,
                // @ts-expect-error
                Body: image
            });
            return Key;
        })
});
