import * as z from "zod"

export const ContextNodeModel = z.object({
  /**
   * context node refers to a source or referrer — for example, a Discord Server, or another user
   */
  id: z.string(),
  name: z.string(),
  url: z.string().nullish(),
  description: z.string().nullish(),
  userId: z.string(),
  refers_to: z.string().nullish(),
})
