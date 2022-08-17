import * as z from "zod"

export const TargetModel = z.object({
  id: z.number().int(),
  source: z.string(),
  selectorId: z.number().int(),
})
