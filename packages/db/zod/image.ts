import * as z from "zod"

export const ImageModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  url: z.string(),
  width: z.number().int().nullish(),
  height: z.number().int().nullish(),
})
