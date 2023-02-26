import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteEntry, EntryModel, CompleteUser, UserModel, CompleteBookmark, BookmarkModel } from "./index"

export const _InteractionModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  is_read: z.boolean().nullish(),
  progress: z.number().nullish(),
  /**
   * The current page, if it's a book
   */
  currentPage: z.number().int().nullish(),
  finished: z.boolean().nullish(),
  entryId: z.number().int(),
  userId: z.string(),
  last_viewed: z.date(),
  last_annotated: z.date(),
  last_interaction: z.date(),
})

export interface CompleteInteraction extends z.infer<typeof _InteractionModel> {
  entry: CompleteEntry
  user: CompleteUser
  bookmark?: CompleteBookmark | null
}

/**
 * InteractionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const InteractionModel: z.ZodSchema<CompleteInteraction> = z.lazy(() => _InteractionModel.extend({
  entry: EntryModel,
  user: UserModel,
  bookmark: BookmarkModel.nullish(),
}))
