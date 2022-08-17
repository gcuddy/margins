import * as z from "zod"

export const BookmarkModel = z.object({
  id: z.number().int(),
  url: z.string(),
  title: z.string(),
  description: z.string().nullish(),
  createdAt: z.date(),
  html: z.string(),
  articleId: z.number().int().nullish(),
  contextId: z.number().int(),
})
