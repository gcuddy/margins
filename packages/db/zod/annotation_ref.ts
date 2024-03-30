import * as z from "zod"

export const annotation_refModel = z.object({
  referencerId: z.string(),
  referencingId: z.string(),
})
