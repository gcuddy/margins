import * as z from "zod"

export const SmartListConditionModel = z.object({
  id: z.number().int(),
  smartListId: z.number().int().nullish(),
  any: z.boolean(),
  title: z.string().nullish(),
})
