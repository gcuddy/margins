import { z } from "zod";

import { uploadFile } from "$lib/backend/s3.server";
import { getScreenshot } from "$lib/features/entries/bookmarks/image";
import { normalizeUrl } from "$lib/feeds/utils";
import parse from "$lib/parse";
import { publicProcedure, router } from "$lib/trpc/t";

export const publicRouter = router({
	parse: publicProcedure.input(z.string()).query(async ({ input }) => {
		const normalizedUrl = normalizeUrl(input);
		const parsed = await parse(normalizedUrl);
		return parsed;
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
           const image = await getScreenshot(url)
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
