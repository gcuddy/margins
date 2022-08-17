import * as z from "zod"

export const RssFeedTagModel = z.object({
  id: z.number().int(),
  name: z.string(),
})
