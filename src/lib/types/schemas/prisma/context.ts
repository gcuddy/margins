import * as z from "zod"

export const ContextModel = z.object({
  id: z.number().int(),
  url: z.string(),
  description: z.string().nullish(),
  createdAt: z.date(),
  articleId: z.number().int().nullish(),
})
