import * as z from "zod"

export const RssItemInteractionModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  is_read: z.boolean(),
  podcast: z.boolean(),
  played: z.boolean(),
  timestamp: z.number().int().nullish(),
  itemUuid: z.string(),
  userId: z.string(),
})
