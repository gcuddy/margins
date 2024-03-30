import * as z from "zod"

export const ContextModel = z.object({
  id: z.number().int(),
  url: z.string().nullish(),
  description: z.string().nullish(),
  createdAt: z.date(),
  entryId: z.string().nullish(),
  feedId: z.number().int().nullish(),
  userId: z.string(),
})
