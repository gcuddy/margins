import * as z from "zod"

export const StringConditionModel = z.object({
  id: z.number().int(),
  contains: z.boolean(),
  value: z.string(),
})
