import * as z from "zod"

export const RssInteractionModel = z.object({
  id: z.number().int(),
  articleId: z.number().int(),
  rssFeedId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  is_read: z.boolean(),
  podcast: z.boolean(),
  played: z.boolean(),
})
