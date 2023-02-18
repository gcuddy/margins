import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteUser, UserModel, CompleteEntry, EntryModel } from "./index"

export const _LogModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  date: z.date(),
  userId: z.string(),
  entryId: z.number().int(),
  note: z.string().nullish(),
})

export interface CompleteLog extends z.infer<typeof _LogModel> {
  user: CompleteUser
  entry: CompleteEntry
}

/**
 * LogModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const LogModel: z.ZodSchema<CompleteLog> = z.lazy(() => _LogModel.extend({
  user: UserModel,
  entry: EntryModel,
}))
