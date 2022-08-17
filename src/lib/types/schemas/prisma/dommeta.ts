import * as z from "zod"

export const DomMetaModel = z.object({
  id: z.number().int(),
  parentTagName: z.string(),
  parentIndex: z.string(),
  textOffset: z.number().int(),
})
