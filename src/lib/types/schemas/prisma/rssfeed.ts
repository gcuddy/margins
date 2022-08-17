import * as z from "zod"

export const RssFeedModel = z.object({
  id: z.number().int(),
  feedUrl: z.string(),
  title: z.string().nullish(),
  link: z.string().nullish(),
  description: z.string().nullish(),
  lastBuildDate: z.date().nullish(),
  imageUrl: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
