import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteUser, UserModel, CompleteEntry, EntryModel } from "./index"

export const _RelationModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  /**
   * The type of the relation
   */
  type: z.string().nullish(),
  userId: z.string(),
  entryId: z.number().int(),
  relatedEntryId: z.number().int(),
})

export interface CompleteRelation extends z.infer<typeof _RelationModel> {
  user: CompleteUser
  entry: CompleteEntry
  relatedEntry: CompleteEntry
}

/**
 * RelationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelationModel: z.ZodSchema<CompleteRelation> = z.lazy(() => _RelationModel.extend({
  user: UserModel,
  /**
   * The entry whose relationship is being described
   */
  entry: EntryModel,
  /**
   * The entry that is related to the entry
   */
  relatedEntry: EntryModel,
}))
