import * as z from "zod"

export const RssFeedItemModel = z.object({
  id: z.number().int(),
  uuid: z.string(),
  is_read: z.boolean(),
  starred: z.boolean(),
  podcast: z.boolean(),
  played: z.boolean(),
  link: z.string().nullish(),
  guid: z.string().nullish(),
  title: z.string().nullish(),
  contentSnippet: z.string().nullish(),
  pubDate: z.date().nullish(),
  creator: z.string().nullish(),
  summary: z.string().nullish(),
  author: z.string().nullish(),
  content: z.string().nullish(),
  isoDate: z.date().nullish(),
  categories: z.string().array(),
  createdAt: z.date(),
  updatedAt: z.date(),
  rssFeedId: z.number().int(),
})
