import * as z from "zod"

export const SubscriptionModel = z.object({
  id: z.number().int(),
  feedId: z.number().int(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  title: z.string(),
  download_full: z.boolean(),
})
