import * as z from "zod"
import { RelationType } from "@prisma/client"

export const RelationModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  /**
   * The type of the relation
   */
  type: z.nativeEnum(RelationType),
  userId: z.string(),
  entryId: z.string(),
  relatedEntryId: z.string(),
})
