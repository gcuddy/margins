import * as z from "zod"

export const ListModel = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
