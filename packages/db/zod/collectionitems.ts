import * as z from "zod"
import { CollectionItemType } from "@prisma/client"

export const CollectionItemsModel = z.object({
  id: z.string(),
  collectionId: z.number().int(),
  position: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  annotationId: z.string().nullish(),
  bookmarkId: z.string().nullish(),
  entryId: z.string().nullish(),
  note: z.string().nullish(),
  parentId: z.string().nullish(),
  type: z.nativeEnum(CollectionItemType),
  /**
   * This applies to sections only
   */
  title: z.string().nullish(),
  width: z.string().nullish(),
})
