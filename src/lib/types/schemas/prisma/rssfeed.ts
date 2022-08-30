import * as z from "zod"

export const RssFeedModel = z.object({
  id: z.number().int(),
  itunes_id: z.string().nullish(),
  feedUrl: z.string(),
  title: z.string().nullish(),
  link: z.string().nullish(),
  description: z.string().nullish(),
  lastBuildDate: z.date().nullish(),
  imageUrl: z.string().nullish(),
  podcast: z.boolean(),
  creator: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
