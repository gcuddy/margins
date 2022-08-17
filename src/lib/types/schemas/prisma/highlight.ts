import * as z from "zod"

export const HighlightModel = z.object({
  id: z.string(),
  articleId: z.number().int(),
  nonTextNodes: z.string().nullish(),
  text: z.string(),
  sanitizedHtml: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  flagged: z.boolean(),
  startMetaId: z.number().int(),
  endMetaId: z.number().int(),
})
