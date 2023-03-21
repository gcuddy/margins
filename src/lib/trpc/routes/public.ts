import rehypeStringify from 'rehype-stringify';
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
import { BOARD_GAME_ID, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } from '$env/static/private';
import type { Redis } from '@upstash/redis';


const boardGameSchema = z.object({
  games: z.array(z.object({
    id: z.string(),
    name: z.string(),
    image_url: z.string(),
    thumb_url: z.string(),
    year_published: z.coerce.number(),
    description: z.string(),
    msrp: z.coerce.number(),
    primary_designer: z.object({
      name: z.string().optional(),
    }).nullish(),
    primary_publisher: z.object({
      name: z.string().optional(),
    }).nullish(),
    official_url: z.string().nullish(),
    min_players: z.coerce.number(),
    max_players: z.coerce.number(),
    min_playtime: z.coerce.number(),
    max_playtime: z.coerce.number(),
    min_age: z.coerce.number(),
    categories: z.array(z.object({
      id: z.string(),
    })).optional(),
  }))
});

const twitchResponse = z.object({
  access_token: z.string(),
  expires_in: z.number(),
})
async function getTwitchToken(redis: Redis) {
  // check redis for token
  const cached = await redis.get('twitch-token');
  if (cached) {
    // check if token is expired
    const parsed = twitchResponse.safeParse(cached);
    console.log('twitch cache hit', parsed)
    if (parsed.success) {
      const expires = new Date(new Date().getTime() + parsed.data.expires_in * 1000);
      if (expires > new Date()) {
        return parsed.data.access_token;
      }
    }
  }
  const response = await fetch('https://id.twitch.tv/oauth2/token?client_id=' + TWITCH_CLIENT_ID + '&client_secret=' + TWITCH_CLIENT_SECRET + '&grant_type=client_credentials', {
    method: 'POST'
  });
  const data = await response.json();
  const parsed = twitchResponse.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }
  await redis.set('twitch-token', parsed.data, {
    ex: parsed.data.expires_in
  })
  return parsed.data.access_token;
}


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
  })).query(async ({ ctx, input }) => {
    const { value } = unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .processSync(input.markdown);
    console.log({ value })
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
    }),
  games: publicProcedure
    .input(z.object({
      search: z.string()
    }))
    .query(async ({ ctx, input }) => {
      type GameResponse = {
        name: string;
        cover: {
          url: string;
        };
        id: number;
        first_release_date: number;
      }[];
      // check redis
      const cached = await ctx.redis.get(`games:search:${input.search}`);
      if (cached) {
        return cached as GameResponse;
      }
      const access_token = await getTwitchToken(ctx.redis);
      // search igdb
      const response = await fetch('https://api.igdb.com/v4/games', {
        method: 'POST',
        headers: {
          'Client-ID': TWITCH_CLIENT_ID,
          'Authorization': 'Bearer ' + access_token,
        },
        // get name, cover url, and release date
        body: `search "${input.search}"; fields name, cover.url, id, first_release_date; limit 10;`
      });
      const data = await response.json();
      await ctx.redis.set(`games:search:${input.search}`, data, {
        // cache for one day
        ex: 60 * 60 * 24
      })
      return data as GameResponse;
      // const client = igdb(TWITCH_CLIENT_ID, access_token)
      // const games = client.search(input.search);
      // console.log({games})
      // return games;
    }),
  gameById: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const access_token = await getTwitchToken(ctx.redis);
      // get game by id
      const response = await fetch('https://api.igdb.com/v4/games', {
        method: 'POST',
        headers: {
          'Client-ID': TWITCH_CLIENT_ID,
          'Authorization': 'Bearer ' + access_token,
        },
        // get name, cover url, and release date
        body: `where id = ${input.id}; fields *, cover.url, platforms.name, websites.*;`
      });
      // TODO: involved companies is bloated, want to just get the parent companies?
      const data = await response.json() as {
        name: string;
        cover: {
          url: string;
        };
        id: number;
        first_release_date: number;
        involved_companies: {
          company: {
            name: string;
          }
        }[];
        platforms: {
          name: string;
        }[];
        websites: {
          url: string;
          category: number;
        }[];
      }[];
      return data[0];
    }),
  boardgames: publicProcedure
    .input(z.object({
      search: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const res = await fetch(`https://api.boardgameatlas.com/api/search?name=${input.search}&pretty=true&client_id=${BOARD_GAME_ID}`)
      const data = await res.json();
      console.log({ data })
      const parsed = boardGameSchema.parse(data);
      return parsed.games;
    }),
  boardGameById: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const res = await fetch(`https://api.boardgameatlas.com/api/search?ids=${input.id}&pretty=true&client_id=${BOARD_GAME_ID}`)
      const data = await res.json();
      const parsed = boardGameSchema.parse(data);
      return parsed.games[0];
    })
});
