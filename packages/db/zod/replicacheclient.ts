import * as z from "zod"

export const ReplicacheClientModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
  clientGroupId: z.string(),
  clientVersion: z.number().int(),
  lastMutationId: z.bigint(),
})
