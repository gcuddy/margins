import * as z from "zod"

export const CssModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  domain: z.string(),
  css: z.string().nullish(),
})
