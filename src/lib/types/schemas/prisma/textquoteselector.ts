import * as z from "zod"

export const TextQuoteSelectorModel = z.object({
  id: z.number().int(),
  exact: z.string(),
  prefix: z.string().nullish(),
  suffix: z.string().nullish(),
  type: z.string(),
})
