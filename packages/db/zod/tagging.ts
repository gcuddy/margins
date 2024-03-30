import * as z from "zod"

export const TaggingModel = z.object({
  id: z.number().int(),
  tagId: z.number().int(),
  userId: z.string(),
  feedId: z.number().int().nullish(),
  bookmarkId: z.string().nullish(),
})
