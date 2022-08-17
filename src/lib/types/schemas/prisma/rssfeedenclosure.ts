import * as z from "zod"

export const RssFeedEnclosureModel = z.object({
  id: z.number().int(),
  url: z.string().nullish(),
  length: z.number().int().nullish(),
  type: z.string().nullish(),
  feedId: z.number().int(),
})
