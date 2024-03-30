import * as z from "zod"
import { FavoriteType } from "@prisma/client"

export const FavoriteModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  deleted: z.date().nullish(),
  tagId: z.number().int().nullish(),
  smartListId: z.number().int().nullish(),
  annotationId: z.string().nullish(),
  bookmarkId: z.string().nullish(),
  entryId: z.string().nullish(),
  feedId: z.number().int().nullish(),
  sortOrder: z.number().nullish(),
  /**
   * The name of the folder. Only applies to favorites of type folder.
   */
  folderName: z.string().nullish(),
  parentId: z.string().nullish(),
  type: z.nativeEnum(FavoriteType),
  collectionId: z.number().int().nullish(),
})
