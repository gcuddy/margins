import * as z from "zod"

export const RssFeedItemModel = z.object({
  id: z.number().int(),
  uuid: z.string(),
  duration: z.number().int().nullish(),
  image: z.string().nullish(),
  link: z.string().nullish(),
  author: z.string().nullish(),
  title: z.string().nullish(),
  content: z.string().nullish(),
  contentSnippet: z.string().nullish(),
  pubDate: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  rssFeedId: z.number().int(),
})
