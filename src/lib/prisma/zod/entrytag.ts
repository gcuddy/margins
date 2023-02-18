import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteTag, TagModel, CompleteEntry, EntryModel, CompleteUser, UserModel } from "./index"

export const _EntryTagModel = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  tagId: z.number().int(),
  entryId: z.number().int(),
  userId: z.string(),
})

export interface CompleteEntryTag extends z.infer<typeof _EntryTagModel> {
  tag: CompleteTag
  entry: CompleteEntry
  user: CompleteUser
}

/**
 * EntryTagModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const EntryTagModel: z.ZodSchema<CompleteEntryTag> = z.lazy(() => _EntryTagModel.extend({
  tag: TagModel,
  entry: EntryModel,
  user: UserModel,
}))
