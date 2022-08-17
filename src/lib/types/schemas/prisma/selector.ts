import * as z from "zod"

export const SelectorModel = z.object({
  id: z.number().int(),
  type: z.string(),
  exact: z.string().nullish(),
  prefix: z.string().nullish(),
  suffix: z.string().nullish(),
  start: z.number().int().nullish(),
  end: z.number().int().nullish(),
  value: z.string().nullish(),
  refinedById: z.number().int().nullish(),
})
