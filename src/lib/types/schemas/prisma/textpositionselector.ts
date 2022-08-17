import * as z from "zod"

export const TextPositionSelectorModel = z.object({
  id: z.number().int(),
  start: z.number().int(),
  end: z.number().int(),
})
