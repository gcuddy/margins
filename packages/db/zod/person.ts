import * as z from "zod"

export const PersonModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  tmdbId: z.number().int().nullish(),
})
