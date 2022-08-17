import * as z from "zod"

export const MediaModel = z.object({
  id: z.number().int(),
  url: z.string(),
  title: z.string(),
  description: z.string(),
  duration: z.number().int(),
  type: z.string(),
  articleId: z.number().int(),
})
