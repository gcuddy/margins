import * as z from "zod"

export const EntryTagModel = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  tagId: z.number().int(),
  entryId: z.string(),
  userId: z.string(),
})
