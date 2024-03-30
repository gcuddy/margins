import * as z from "zod"

export const person_to_entryModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  personId: z.number().int(),
  entryId: z.string(),
  role: z.string(),
})
