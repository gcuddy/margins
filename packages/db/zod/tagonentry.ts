import * as z from "zod"

export const TagOnEntryModel = z.object({
  id: z.number().int(),
  tagId: z.number().int(),
  entryId: z.string(),
  userId: z.string(),
})
