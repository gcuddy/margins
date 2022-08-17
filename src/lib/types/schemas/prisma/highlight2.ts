import * as z from "zod"

export const Highlight2Model = z.object({
  id: z.number().int(),
  articleId: z.number().int(),
  targetId: z.number().int(),
  text: z.string(),
  sanitizedHtml: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  flagged: z.boolean(),
})
