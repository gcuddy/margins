import * as z from "zod"

export const ListItemModel = z.object({
  id: z.number().int(),
  listId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  articleId: z.number().int().nullish(),
  bookmarkId: z.number().int().nullish(),
  highlightId: z.string().nullish(),
  annotationId: z.number().int().nullish(),
  type: z.string().nullish(),
})
