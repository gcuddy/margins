import * as z from "zod"

export const FavoriteModel = z.object({
  id: z.number().int(),
  position: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().nullish(),
  articleId: z.number().int().nullish(),
  tagId: z.number().int().nullish(),
  rssId: z.number().int().nullish(),
  smartListId: z.number().int().nullish(),
})
