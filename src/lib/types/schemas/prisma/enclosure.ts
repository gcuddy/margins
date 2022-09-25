import * as z from "zod"

export const EnclosureModel = z.object({
  url: z.string().nullish(),
  length: z.number().int().nullish(),
  type: z.string().nullish(),
  feedId: z.number().int(),
})
