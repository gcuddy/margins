import * as z from "zod"

export const SubscriptionToTagModel = z.object({
  A: z.number().int(),
  B: z.number().int(),
})
