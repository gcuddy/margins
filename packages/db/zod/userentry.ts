import * as z from "zod"

export const UserEntryModel = z.object({
  id: z.number().int(),
  entryId: z.string(),
  userId: z.string(),
  seen: z.date().nullish(),
})
